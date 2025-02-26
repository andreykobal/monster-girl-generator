"use client";

import React, { useState } from "react";
import axios from "axios";
import JSON5 from "json5";
import BgImage from "./assets/bg.jpeg";
import localFont from "next/font/local";

const gothicByte = localFont({
  src: "./assets/GothicByte.ttf",
  display: "swap",
});

// Helper function to convert a Blob into a Base64 data URL.
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Third fallback: Use regex extraction to parse the character card content.
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

// Helper function to generate the character card (with retries).
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
      "Bearer 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",
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
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Strict JSON parsing failed:", e.message);
        try {
          return JSON5.parse(content);
        } catch (e2) {
          console.error("JSON5 parsing also failed:", e2.message);
          // Third fallback: use regex-based extraction
          try {
            const fallbackParsed = parseCharacterCardFallback(content);
            if (fallbackParsed && Object.keys(fallbackParsed).length > 0) {
              console.log("Fallback parsing succeeded.");
              return fallbackParsed;
            } else {
              console.error("Fallback parsing returned an empty object.");
            }
          } catch (e3) {
            console.error("Fallback parsing also failed:", e3.message);
          }
        }
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

// Main function to pick a random image from blob storage, get an image description, and generate a character card.
async function generateData() {
  const totalImages = 2270;
  const randomNumber = Math.floor(Math.random() * totalImages) + 1;
  const imageNumberStr = randomNumber.toString().padStart(4, "0");
  const blobBaseUrl =
    "https://metaversetestnetstorage.blob.core.windows.net/monster-girls/";
  const imageUrl = `${blobBaseUrl}${imageNumberStr}.png`;

  console.log("Selected image URL:", imageUrl);

  try {
    // Fetch the image from blob storage as a Blob.
    const imageResponse = await axios.get(imageUrl, { responseType: "blob" });
    const base64Image = await blobToBase64(imageResponse.data);

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
            {
              type: "text",
              text: "What's in this image?",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
    };

    const headers = {
      Authorization:
        "Bearer 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",
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
      // Append the image URL to the character card.
      characterCard.image = imageUrl;
      return characterCard;
    } else {
      throw new Error("Failed to generate character card");
    }
  } catch (error) {
    console.error("Error in generateData:", error);
    throw error;
  }
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    // Remove or comment out the line below so the previous card remains visible.
    // setCharacterData(null);
    try {
      const data = await generateData();
      setCharacterData(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 w-full">
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
          className={`${gothicByte.className} text-6xl font-bold mb-4 text-white`}
        >
          Monster Girl Generator
        </h1>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mb-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {error && (
          <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
            {error}
          </div>
        )}
        {characterData && (
          <div className="w-full max-w-5xl bg-white p-6 rounded shadow">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={characterData.image}
                  alt="Random Monster Girl"
                  className="w-full h-auto mb-4 md:mb-0 rounded"
                />
              </div>
              <div className="md:w-1/2 md:pl-6">
                <div className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
