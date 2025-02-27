# Monster Speed Dating: Get Her Number or Die 💀💘

Welcome to **Monster Speed Dating**, where you get the chance to date unique monster girls... but you better impress them fast! In this thrilling AI-driven dating simulator, your goal is to win the heart (or at least get the number) of a monster girl before time runs out. It's a race against the clock, and if you fail? Well, let's just say things can get pretty monstrous... 👹

![Create-Next-App-02-27-2025_06_27_PM](https://github.com/user-attachments/assets/7420f7a3-f29b-4cd8-a4ac-54537f67925c)

## ✅ Demo
[PLAY NOW]
[WATCH DEMO VIDEO]

## 🚀 Game Concept

**Monster Speed Dating** is an AI-powered dating simulator game with a twist: the characters you meet are all unique, AI-generated monster girls! You’ll chat, flirt, and compete in various mini-games, all while using cutting-edge AI technology to drive the interactions.

The core gameplay loop involves:

- **Generate a Monster Girl**: Using a random image, we create an AI-powered character complete with a name, bio, and personality.
- **Speed Dating**: You’ll need to impress the character by chatting, answering questions, and participating in mini-games.
- **Game Over**: Did you succeed in winning her number? Or did you fail and meet a monstrous fate? Only time will tell!

## 🎮 Game Features

- **AI-Powered Characters**: Each character is generated with a unique story and personality.
- **Speed Dating Mode**: Engage in quick interactions and try to impress your date before time runs out!
- **Multiple Endings**: Depending on your performance, the date can end in success or failure (or something worse... 😱).
- **NFT Integration**: Mint your monster girl as an NFT once you’ve impressed her!

## 🕹️ Play Now

Ready to dive into the monster speed dating world? [Click here to play the game!](#)

## 🧠 AI Technology

This game is powered by AI to generate unique character cards, descriptions, and interactive dialogue. We use **OpenRouter API** to generate character descriptions, **Pinata** for storing assets, and a **smart contract** to mint the characters as NFTs. The AI handles the creativity for the bios, character interactions, and visual descriptions, ensuring each playthrough is different.

## 💻 Tech Stack

- **OpenAI**: For generating character dialogue and chat response suggestions, to evaluate the outcome of the game.
- **OpenRouter**: Powers API calls for character generation and image descriptions.
- **Gemini 2.0 Flash**: Analyzes and describes images for character creation.
- **Llama 3.1**: Used for character metadata generation.
- **Foundry**: Manages smart contract deployment and NFT minting.
- **Pinata**: Stores images and metadata on IPFS.
- **RainbowKit**: Web3 wallet connection for blockchain interactions.
- **Wagmi**: Facilitates smart contract interactions.
- **Next.js**: Scalable React framework for server-side rendering.

## 🔧 How It Works

1. **AI Character Generation**:
   The game selects a random image of a monster girl, compresses it for better quality, and then uses AI to generate a full character card. This includes name, age, race, profession, bio, and a "first message" for your roleplay starter.

   ```js
   const characterData = await generateData();
   ```

2. **Character Interaction**:
   After generating the character, you engage in a chat where you can use your wit, charm, and emotional intelligence to impress her. The character will respond to your messages, and based on your interactions, the game will either continue or end.

   ```js
   <Chat characterData={{ ...characterData }} onGameOver={handleGameOver} />
   ```

3. **NFT Minting**:
   After a successful date, you can mint your monster girl as an NFT! The character data (like name, bio, and image) is uploaded to Pinata, and a unique NFT is created on the blockchain.

   ```js
   const txHash = await mintToken({ abi: contractABI, address: CONTRACT_ADDRESS, functionName: "createToken", args: [metadataUrl] });
   ```

## 🤖 AI Features

- **Character Generation**: Powered by AI, each monster girl is unique, with a generated backstory, personality traits, and a starting conversation.
- **Image Description**: The AI analyzes the image to create a detailed description of the character, ensuring that each interaction feels immersive and dynamic.
  
  ```js
  const payloadDescription = {
    model: "google/gemini-2.0-flash-lite-001",
    messages: [{ role: "user", content: "What's in this image?" }]
  };
  ```

- **Smart Contract Integration**: Mint your monster girl as an NFT with an easy-to-use smart contract interface. You own her, and you can sell her, trade her, or simply admire her!

## 💡 Snippets

### Example Character Card Generation

Here’s a sneak peek at how the AI generates a character card:

```json
{
  "name": "Gorgonina",
  "age": "26",
  "race": "Gorgon",
  "profession": "Librarian",
  "bio": "Gorgonina is a bookworm with a venomous touch. She can petrify anyone with a glance, but don't worry, she only turns people to stone if they’re rude. She's a bit shy but loves talking about ancient myths.",
  "first message": "*You sit down at a cozy café when a voice startles you:* ‘Hey there... You’ve got a real nice vibe. Wanna talk mythology with me?’"
}
```

### Chat Interaction Example

Here’s an example of the AI-powered chat interaction:

```js
const message = "Hey, how's it going?";
const response = await chatBot.getResponse(message);
console.log(response); // "Gorgonina smiles nervously: 'Not bad... Just trying to avoid turning anyone to stone today!'"
```

## 👹 Installation

To run the game locally, clone this repository and install the dependencies:

```bash
git clone https://github.com/yourusername/monster-speed-dating.git
cd monster-speed-dating
npm install
npm run dev
```

Make sure to have your **Pinata API keys** and **OpenRouter API keys** ready for the character generation and image uploads.

