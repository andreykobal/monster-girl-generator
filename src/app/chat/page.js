'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaHome } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

// Hardcoded character data
const characterData = {
    name: 'Eliza',
    age: 30,
    profession: 'Arcane Technomancer',
    race: 'Human',
    bio: 'Eliza is an Arcane Technomancer, a master of blending ancient magic with cutting-edge technology. She roams the realms, seeking to unlock forgotten secrets and forge new paths in the ever-evolving balance between magic and machine.',
    firstMessage: '*The air crackles with ethereal energy as Eliza adjusts the glowing device in front of her, her fingers dancing over intricate runes. She looks up, her eyes gleaming with knowledge and curiosity.* "Ah, a new adventurer steps forth into the unknown. Welcome! You’ve arrived just in time to witness the merging of magic and technology. Will you join me in this grand quest?"',
    image: 'https://metaversetestnetstorage.blob.core.windows.net/generated-images/4728173c1cbb4098b939c9ae6933b426.png',
};

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]); // Initialize suggestions state
    const chatContainerRef = useRef(null); // Reference for the chat container
    const [countdown, setCountdown] = useState(20); // Initialize the countdown timer state

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup timer on component unmount
        } else {
            // Log and evaluate chat when the timer ends
            evaluateChatHistory();
        }
    }, [countdown, messages]); // Re-run effect whenever countdown or messages change

    const evaluateChatHistory = async () => {
        try {
            console.log('Preparing evaluation message...');

            // Define your schema for structured output
            const evaluationMessage = {
                role: 'system',
                content: `Evaluate the following conversation using these metrics:
            1. Technique of Execution (on a scale of 1 to 10)
            2. Charisma and Confidence (on a scale of 1 to 10)
            3. Creativity and Originality (on a scale of 1 to 10)
            4. Emotional Intelligence (on a scale of 1 to 10)
            Provide the evaluation in the following JSON format:
            {
                "message": "Roleplay character's thoughts on this conversation.",
                "metrics": {
                    "technique": number,
                    "charisma": number,
                    "creativity": number,
                    "emotional_intelligence": number
                }
            }`
            };

            console.log('Updated messages:', messages); // Log the messages to see what we are sending
            const updatedMessages = [...messages, evaluationMessage];

            // Send the request for evaluation with structured output
            console.log('Sending evaluation request...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-2024-08-06', // Ensure you're using the correct model
                    messages: updatedMessages,
                    response_format: {
                        type: 'json_schema',
                        json_schema: {
                            name: 'evaluation_response',
                            strict: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description: 'The roleplay character’s thoughts on the conversation.'
                                    },
                                    metrics: {
                                        type: 'object',
                                        properties: {
                                            technique: { type: 'number' },
                                            charisma: { type: 'number' },
                                            creativity: { type: 'number' },
                                            emotional_intelligence: { type: 'number' },
                                        },
                                        required: ['technique', 'charisma', 'creativity', 'emotional_intelligence'],
                                        additionalProperties: false  // Explicitly disallow additional properties
                                    }
                                },
                                required: ['message', 'metrics'],
                                additionalProperties: false
                            }
                        }
                    },
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();  // Get the detailed error
                console.error('Failed to fetch from OpenAI:', errorResponse);
                throw new Error('Evaluation API call failed');
            }

            const result = await response.json();
            console.log('Evaluation result:', result); // Log the response from the API

            const { message, metrics } = result.choices[0].message;

            // Display the character's evaluation and metrics
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: message },
                { role: 'assistant', content: JSON.stringify(metrics) },
            ]);
        } catch (error) {
            console.error('Error during evaluation:', error); // Log the error message
        }
    };


    // Initialize chat with the hardcoded character data
    useEffect(() => {
        const systemMessage = {
            role: 'system',
            content: `You are ${characterData.name}, a ${characterData.age}-year-old ${characterData.profession} in this fictional roleplay with the user. Describe your surroundings in vivid detail. Be creative, proactive, and detailed. Move the story forward by introducing fantasy elements and interesting characters. Use narration in asterisks before speaking your dialogue. Shorten your responses to keep the conversation engaging.
            Respond with the following JSON schema format:
            {
                "character_response": "Your response here",
                "suggestions": [
                    "Your suggestion in dialogue and action",
                    "Another suggestion in dialogue and action",
                    "A third suggestion in dialogue and action"
                ]
            }
            Ensure that both "character_response" and "suggestions" are included, with suggestions being an array of short suggestions for how the user can respond (each suggestion should be a sentence followed by an action in asterisks).`
        };
        const characterFirstMessage = {
            role: 'assistant',
            content: characterData.firstMessage,
        };
        setMessages([systemMessage, characterFirstMessage]);
    }, []);

    const handleSendMessage = async (e, userMessage) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        // Add user's message to chat
        const newUserMessage = { role: 'user', content: userMessage.trim() };
        let updatedMessages = [...messages, newUserMessage];
        if (updatedMessages.length > 50) {
            updatedMessages = updatedMessages.slice(updatedMessages.length - 50);
        }
        setMessages(updatedMessages);
        setChatInput('');
        setLoading(true);
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-2024-08-06',
                    messages: updatedMessages,
                    response_format: {
                        type: 'json_schema',
                        json_schema: {
                            name: 'roleplay_response',
                            strict: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    character_response: {
                                        type: 'string',
                                        description: 'The response of the character in roleplay.'
                                    },
                                    suggestions: {
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                            description: 'short suggestions for how the user can respond in format dialogue + action enclosed in asterisks.'
                                        }
                                    }
                                },
                                required: ['character_response', 'suggestions'],
                                additionalProperties: false
                            }
                        }
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Chat API call failed');
            }

            const result = await response.json();
            const message = result.choices[0].message;
            const parsedMessage = JSON.parse(message.content); // Parse the content

            const characterResponse = parsedMessage.character_response;
            const suggestionsList = parsedMessage.suggestions;

            if (!characterResponse || !suggestionsList) {
                throw new Error('Missing character_response or suggestions.');
            }

            let newMessages = [...updatedMessages, {
                role: 'assistant',
                content: characterResponse
            }];

            // Update suggestions state
            setSuggestions(suggestionsList);

            setMessages(newMessages);
        } catch (error) {
            console.error('Error during chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setChatInput(suggestion); // Set chatInput to the selected suggestion
        handleSendMessage({ preventDefault: () => { } }, suggestion); // Send the message immediately
    };

    // Scroll to the bottom of the chat container whenever messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <>
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMessages([])}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                    <FaHome className="text-xl" />
                    <span>Home</span>
                </button>
            </div>
            <div className="relative min-h-screen flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 filter blur-3xl z-[-1]" />
                <div style={{ backgroundImage: `url(${characterData.image})` }} className="w-full max-w-[500px] h-screen bg-cover bg-center mx-auto relative flex flex-col">
                    <header className="flex flex-col p-4 bg-black bg-opacity-50">
                        <div className="flex items-center w-full">
                            <img src={characterData.image} alt="Avatar" className="w-10 h-10 rounded-full object-cover object-top mr-4" />
                            <div>
                                <h1 className="text-white text-xl font-bold">{characterData.name}</h1>
                            </div>
                            <div className="countdown-timer text-white p-2">
                                Time remaining: {countdown}s
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef} id="chat-container">
                        {messages.filter((msg) => msg.role !== 'system').map((msg, idx) => (
                            <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block max-w-[80%] p-2 rounded-xl bg-opacity-80 backdrop-blur-xl ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-neutral-900 text-white'}`}>
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="suggestions-container flex space-x-2 mt-4">
                        {/* Display suggestions as buttons above the input field */}
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="btn-suggestion px-2 py-1 bg-blue-600 text-white rounded text-xs"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 bg-black bg-opacity-50">
                        <form onSubmit={(e) => handleSendMessage(e, chatInput)} className="flex">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 text-black p-2 rounded-l"
                                placeholder="Type your message..."
                            />
                            <button type="submit" className="p-4 bg-violet-500 rounded-r">
                                {loading ? <ImSpinner2 className="animate-spin h-5 w-5 text-white" /> : <FaPaperPlane className="text-white text-xl" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
