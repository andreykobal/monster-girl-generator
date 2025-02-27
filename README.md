# Monster Speed Dating: Get Her Number or Die

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

![NoteGPT-Flowchart-1740682242702](https://github.com/user-attachments/assets/14820588-2724-403f-a04f-9f0470b191a6)

## 🧠 AI Technology

This game is powered by AI to generate unique character cards, descriptions, and interactive dialogue. We use **OpenRouter API** to generate character descriptions, **Pinata** for storing assets, and a **smart contract** to mint the characters as NFTs. The AI handles the creativity for the bios, character interactions, and visual descriptions, ensuring each playthrough is different.


## 🔧 How It Works

1. **Generate Monster Girl**:  
   - You start the game by clicking on a button to generate a random monster girl.  
   - The game fetches an image and uses AI to generate detailed character information, including their name, age, race, profession, bio, and a roleplay starter message.

2. **Character Description**:  
   - Once the character is generated, the AI analyzes the image and provides a vivid description of the character's appearance and personality.  
   - This description is used to build a backstory and to provide context for the game.

3. **Start the Chat**:  
   - You are then introduced to the character through an initial message generated by the AI.  
   - The game enters a speed-dating scenario where you interact with the character in a text-based conversation.  
   - The AI creates dynamic responses and provides suggestions for what you can say next.

4. **Make Choices**:  
   - As the conversation progresses, you will be given different choices on how to respond, all driven by the AI.  
   - The character will react based on your responses, either positively or negatively, depending on your "technique," "charisma," and "emotional intelligence."

5. **Time Limit**:  
   - You have a limited time to impress the character (usually around 3 minutes).  
   - As the countdown ticks down, the AI tracks the quality of your conversation based on predefined metrics.

6. **Evaluation**:  
   - Once the timer runs out, the AI evaluates the conversation and provides feedback on how well you did.  
   - It calculates your score based on various factors like technique, charisma, creativity, and emotional intelligence.

7. **Game Over**:  
   - Based on your evaluation score, the game either ends in success (you win the character’s number) or failure (you "die" in a humorous, dramatic fashion).  
   - The AI provides a closing message, summarizing your performance and offering a chance to try again.

8. **NFT Minting (Optional)**:  
   - If you successfully impress the monster girl, you can mint her as an NFT.  
   - The character's data, including her image and bio, is stored on the blockchain, making her uniquely yours.


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

## 👷 Smart Contract Integration

Mint your monster girl as an NFT with an easy-to-use smart contract interface. You own her, and you can sell her, trade her, and use for further AI chat interactions.


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

