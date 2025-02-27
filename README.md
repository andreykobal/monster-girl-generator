# Monster Speed Dating: Get Her Number or Die 💀💘

Welcome to **Monster Speed Dating**, where you get the chance to date unique monster girls... but you better impress them fast! In this thrilling AI-driven dating simulator, your goal is to win the heart (or at least get the number) of a monster girl before time runs out. It's a race against the clock, and if you fail? Well, let's just say things can get pretty monstrous... 👹

![Create-Next-App-02-27-2025_06_27_PM](https://github.com/user-attachments/assets/7420f7a3-f29b-4cd8-a4ac-54537f67925c)

## ✅ Demo

#### [👉 WATCH DEMO VIDEO 👈](https://youtube.com)
#### [👉 PLAY NOW 👈](https://monster-girl-generator.vercel.app/)

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

1. **Character Card Generation**:
   The character card is generated using AI with details like name, age, race, profession, bio, and first message. This is done by sending the image description to OpenRouter API.

   ```js
   const characterCard = await generateCharacterCard(imageDescription);
   ```

2. **Image Description**:
   AI analyzes the random image, providing a vivid, detailed description of the monster girl's features, race, and personality, which helps create a rich narrative.

   ```js
   const responseDescription = await axios.post(
     "https://openrouter.ai/api/v1/chat/completions", 
     payloadDescription, { headers }
   );
   ```

3. **Chat Evaluation**:
   After the speed dating chat, AI evaluates the user's performance based on metrics like technique, charisma, creativity, and emotional intelligence. This feedback is structured in JSON format.

   ```js
   const evaluationMessage = { role: 'system', content: 'Evaluate the conversation...' };
   const evaluationResponse = await fetch('https://api.openai.com/v1/chat/completions', { body: evaluationMessage });
   ```

4. **Roleplay Dialogue**:
   The character’s responses in the chat are powered by AI. It uses previous messages to generate engaging dialogues and offers suggestions for the player’s next move.

   ```js
   const response = await fetch('https://api.openai.com/v1/chat/completions', { body: updatedMessages });
   const parsedMessage = JSON.parse(response.choices[0].message.content);
   ```

5. **Character Background**:
   AI uses structured prompts to craft unique character backgrounds and scenarios. This ensures each encounter feels fresh and dynamic.

   ```js
   const systemMessage = { role: 'system', content: `You are ${characterData.name}, a...` };
   ```

- **Smart Contract Integration**: Mint your monster girl as an NFT with an easy-to-use smart contract interface. You own her, and you can sell her, trade her, and use for further AI chat interactions.

## 👹 Installation

To run the game locally, clone this repository and install the dependencies:

```bash
git clone https://github.com/andreykobal/monster-speed-dating.git
cd monster-speed-dating
npm install
npm run dev
```

Make sure to have your **Pinata API keys** and **OpenRouter API keys** ready for the character generation and image uploads.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Contribute

We welcome contributions! To get started, fork the repository, make your changes, and submit a pull request. Please ensure your code follows the existing style and includes tests where applicable.

