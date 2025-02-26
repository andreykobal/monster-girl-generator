"use client";

import React, { useState } from "react";
import axios from "axios";
import BgImage from "./assets/bg.jpeg";
import localFont from "next/font/local";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useWriteContract } from "wagmi";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { PinataSDK } from "pinata-web3";
import imageCompression from "browser-image-compression"; // Use browser-image-compression

import TypingEffect from "./TypingEffect";

// Load your custom font.
const gothicByte = localFont({
  src: "./assets/GothicByte.ttf",
  display: "swap",
});

// Create a custom chain config for Base Sepolia using your RPC URL.
const customBase = {
  ...base,
  rpcUrls: {
    default:
      "https://base-mainnet.g.alchemy.com/v2/qIrFR-Jsp877rR-MIYcE3EfutHGjKh1W",
  },
};

// Configure RainbowKit/wagmi with your custom chain.
const config = getDefaultConfig({
  appName: "Monster Girl Generator",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [customBase],
  transports: {
    [customBase.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/qIrFR-Jsp877rR-MIYcE3EfutHGjKh1W"
    ),
  },
  ssr: true,
});

const queryClient = new QueryClient();

// Smart contract configuration.
const CONTRACT_ADDRESS = "0x019c7d3FdC33E28967c3Abe83F3BdF55f16dbF59";
const contractABI = [
  {
    inputs: [{ internalType: "string", name: "tokenUrl", type: "string" }],
    name: "createToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// -----------------------------------------------------------------------------
// MONSTER GIRL GENERATOR HELPER FUNCTIONS
// -----------------------------------------------------------------------------

// Convert a Blob into a Base64 data URL.
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Fallback: Use regex extraction to parse a character card string.
function parseCharacterCardFallback(str) {
  const regex = /['"]?([\w\s]+)['"]?\s*:\s*(['"])([\s\S]*?)\2/g;
  let match;
  const result = {};
  while ((match = regex.exec(str)) !== null) {
    const key = match[1].trim();
    const value = match[3].trim();
    result[key] = value;
  }
  return result;
}

// Generate the character card using an API (with retry logic).
async function generateCharacterCard(imageDescription, retryCount = 0) {
  const payloadCharacterCard = {
    model: "sao10k/l3.1-70b-hanami-x1",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content:
          "You are a creative writer that helps to create monster girl character cards.",
      },
      {
        role: "user",
        content: `### Task:
Using the provided image description, create a character card in JSON format.

### Output Format (JSON):

\`\`\`json
{
  "name": "A simple name",
  "age": "Character's age",
  "race": "Character's race",
  "profession": "Character's profession",
  "bio": "A short biography (2-3 paragraphs) written in the third person. It should be exaggerated, sassy, hilarious, absurd, awkward, and sexy. Use Gen Z slang. Include a short description of character's appearance and personality.",
  "first message": "A short roleplay starter (maximum 1 paragraph), random and absurd situation between the character and user, that begins with a narrative enclosed in asterisks (**) followed by direct speech. Use hero's journey, Gen Z slang, and humor. Address the user as 'you'."
}
\`\`\`

### Instructions:
- Use the image description to inform your details.
- Write the biography and first message using Gen Z slang.
- Ensure the tone is exaggerated, sassy, hilarious, absurd, awkward, and sexy.
- The biography should be in the third person, and address the protagonist as "you".
- The first message must start with a narrative enclosed in asterisks (e.g., **narrative**) followed by direct speech.
- Include only the valid JSON object in your response.

### IMAGE DESCRIPTION:
${imageDescription}

### RESPONSE: `,
      },
    ],
  };

  const headers = {
    Authorization:
      `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const responseCharacter = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payloadCharacterCard,
      { headers }
    );
    const characterMessage = responseCharacter.data.choices[0].message;
    if (characterMessage && characterMessage.content) {
      let content = characterMessage.content;
      console.log("Character Card Content:", content);
      // Extract JSON substring by finding the first '{' and the last '}'
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        content = content.substring(start, end + 1);
      }
      const parsedContent = parseCharacterCardFallback(content);
      if (parsedContent && Object.keys(parsedContent).length > 0) {
        console.log("Fallback parsing succeeded.");
        return parsedContent;
      } else {
        console.error("Fallback parsing returned an empty object.");
      }
    } else {
      console.log("No character card content found in the response.");
    }
  } catch (error) {
    console.error(
      "Error in character card API call:",
      error.response ? error.response.data : error.message
    );
  }

  if (retryCount < 10) {
    console.log("Retrying character card generation...");
    return await generateCharacterCard(imageDescription, retryCount + 1);
  } else {
    console.error(
      "Failed to generate a valid character card after multiple attempts."
    );
    return null;
  }
}

// New Helper: Upload converted image to Pinata.
async function uploadImageToPinata(imageFile) {
  try {
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    });
    const uploadResponse = await pinata.upload.file(imageFile);
    console.debug("uploadImageToPinata: Upload response", uploadResponse);
    const ipfsHash = uploadResponse.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading image to Pinata:", error);
    throw error;
  }
}

// Generate monster girl data by fetching a random image, converting it, getting its description,
// and then generating a character card.
async function generateData() {
  const totalImages = 2270;
  const randomNumber = Math.floor(Math.random() * totalImages) + 1;
  const imageNumberStr = randomNumber.toString().padStart(4, "0");
  const blobBaseUrl =
    "https://metaversetestnetstorage.blob.core.windows.net/monster-girls/";
  const imageUrl = `${blobBaseUrl}${imageNumberStr}.png`;  // Use Azure image URL

  console.log("Selected image URL:", imageUrl);

  try {
    // Fetch the image as a Blob from Azure (only for image processing).
    const imageResponse = await axios.get(imageUrl, { responseType: "blob" });

    // Use browser-image-compression to convert the PNG Blob to a JPEG Blob with 80% quality.
    const jpgBlob = await imageCompression(imageResponse.data, {
      fileType: "image/jpeg",
      quality: 0.8,
    });

    // Create a File from the converted JPEG Blob.
    const jpgFile = new File([jpgBlob], `${imageNumberStr}.jpg`, {
      type: "image/jpeg",
    });

    // Upload the processed image to Pinata (we only use Pinata to store the processed image).
    const imagePinataUrl = await uploadImageToPinata(jpgFile);
    console.log("Image uploaded to Pinata:", imagePinataUrl);

    // Convert the JPEG Blob to a Base64 URL for the image description API.
    const base64Jpg = await blobToBase64(jpgBlob);

    // First API call: Get a detailed image description.
    const payloadDescription = {
      model: "google/gemini-2.0-flash-lite-001",
      messages: [
        {
          role: "system",
          content:
            "You are a creative writer that helps to describe images (character, features of the character, race, visual appearance, pose, scenery, setting) in vivid detail. Provide 2-3 paragraphs.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What's in this image?" },
            {
              type: "image_url",
              image_url: { url: base64Jpg },
            },
          ],
        },
      ],
    };

    const headers = {
      Authorization:
        `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    };

    const responseDescription = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payloadDescription,
      { headers }
    );
    const descriptionMessage = responseDescription.data.choices[0].message;
    let imageDescription = "";
    if (descriptionMessage && descriptionMessage.content) {
      imageDescription = descriptionMessage.content;
      console.log("Image Description:", imageDescription);
    } else {
      console.log("No image description found in the response.");
      throw new Error("No image description found");
    }

    // Second API call: Generate the character card using the image description.
    const characterCard = await generateCharacterCard(imageDescription);
    if (characterCard) {
      // Use the Pinata URL in metadata, but use Azure URL for frontend display.
      characterCard.image = imagePinataUrl;  // Use Pinata URL for metadata

      // Upload metadata JSON to Pinata
      const metadataUrl = await uploadMetadataToPinata(characterCard);
      console.log("Uploaded metadata URL:", metadataUrl);

      // Return the character card with the Azure image URL for frontend display
      characterCard.azureImageUrl = imageUrl; // Include Azure image URL for display in frontend

      return characterCard;
    } else {
      throw new Error("Failed to generate character card");
    }
  } catch (error) {
    console.error("Error in generateData:", error);
    throw error;
  }
}


// -----------------------------------------------------------------------------
// Helper: Upload metadata JSON to Pinata and return the gateway URL.
// -----------------------------------------------------------------------------
async function uploadMetadataToPinata(metadata) {
  try {
    const metadataString = JSON.stringify(metadata);
    const blob = new Blob([metadataString], { type: "application/json" });
    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    });
    const uploadResponse = await pinata.upload.file(file);
    console.debug("uploadMetadataToPinata: Upload response", uploadResponse);
    const ipfsHash = uploadResponse.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw error;
  }
}

// -----------------------------------------------------------------------------
// MONSTER GIRL GENERATOR COMPONENT
// -----------------------------------------------------------------------------
function MonsterGirlGenerator() {
  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);

  // useWriteContract hook to call the contract's createToken function.
  const { writeContractAsync: mintToken } = useWriteContract();

  // Handler to generate a monster girl.
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateData();
      setCharacterData(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handler to mint the generated monster girl using your smart contract.
  const handleMint = async () => {
    if (!characterData) return;
    setMinting(true);
    try {
      // Build the metadata JSON using characterData.
      const metadata = {
        description: "MONSTER GIRL NFT COLLECTION",
        external_url: "https://app.avasocial.net/",
        image: characterData.image,
        name: "MONSTER GIRL",
        attributes: [
          {
            trait_type: "name",
            value: characterData.name,
          },
          {
            trait_type: "age",
            value: characterData.age,
          },
          {
            trait_type: "race",
            value: characterData.race,
          },
          {
            trait_type: "profession",
            value: characterData.profession,
          },
          {
            trait_type: "bio",
            value: characterData.bio,
          },
          {
            trait_type: "firstMessage",
            value: characterData["first message"],
          },
        ],
      };

      // Upload the metadata JSON to Pinata.
      const metadataUrl = await uploadMetadataToPinata(metadata);
      console.log("Uploaded metadata URL:", metadataUrl);

      // Call the smart contract createToken function with the metadata URL.
      const txHash = await mintToken({
        abi: contractABI,
        address: CONTRACT_ADDRESS,
        functionName: "createToken",
        args: [metadataUrl],
      });
      console.log("Mint transaction hash:", txHash);
      alert("Mint successful! Transaction hash: " + txHash);
    } catch (error) {
      console.error("Error minting token:", error);
      alert("Mint failed: " + error.message);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 w-full pt-16">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={BgImage.src}
        className="absolute inset-0 object-cover w-full h-full"
      >
        <source src="/bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 w-full items-center flex flex-col justify-center">
        <h1
          className={`${gothicByte.className} text-4xl md:text-8xl text-center font-bold mb-4 text-white`}
        >
          Monster Girl Generator
        </h1>
        {!loading && (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-4 bg-zinc-900 text-lg font-bold font-mono rounded-full text-white rounded hover:bg-zinc-800 disabled:opacity-50 glow-on-hover"
        > 
          Generate Monster Girl
        </button>
        )}
        {loading && <TypingEffect />}
        {error && (
          <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}
        {characterData && (
          <div className="mt-4 w-full max-w-6xl bg-zinc-950 p-6 rounded-xl shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={characterData.azureImageUrl} // Use the Azure URL for frontend display
                  alt="Random Monster Girl"
                  className="w-full h-auto mb-4 md:mb-0 rounded-xl"
                />
              </div>
              <div className="md:w-1/2 md:pl-6">
                <div className="whitespace-pre-wrap text-zinc-100 space-y-1 font-mono text-sm">
                  <p className="font-bold">Name</p>
                  <p>{characterData.name}</p>
                  <p className="font-bold">Age</p>
                  <p>{characterData.age}</p>
                  <p className="font-bold">Race</p>
                  <p>{characterData.race}</p>
                  <p className="font-bold">Profession</p>
                  <p>{characterData.profession}</p>
                  <p className="font-bold">Bio</p>
                  <p>{characterData.bio}</p>
                  <p className="font-bold">First Message</p>
                  <p>{characterData["first message"]}</p>
                </div>
                <button
                  onClick={handleMint}
                  disabled={minting}
                  className="mb-4 mt-4 px-8 py-4 bg-zinc-900 text-lg font-bold font-mono rounded-full text-white rounded hover:bg-zinc-800 disabled:opacity-50 shadow-lg shadow-violet-500/50 border-2 border-violet-500"
                >
                  {minting ? "Minting..." : "Mint Monster Girl"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// APP COMPONENT WRAPPED WITH PROVIDERS
// -----------------------------------------------------------------------------
export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="relative min-h-screen">
            {/* Connect Wallet button */}
            <div className="fixed top-4 right-4 z-50">
              <ConnectButton />
            </div>
            <MonsterGirlGenerator />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
