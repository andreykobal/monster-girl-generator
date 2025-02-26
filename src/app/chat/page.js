'use client';

import { useState, useEffect } from "react";
import { FaPaperPlane, FaHome } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [agentData, setAgentData] = useState(null);
    const [downloading, setDownloading] = useState(false);

    // Get character data from query params
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const age = urlParams.get("age");
    const race = urlParams.get("race");
    const profession = urlParams.get("profession");
    const bio = urlParams.get("bio");
    const firstMessage = urlParams.get("firstMessage");
    const image = urlParams.get("image");

    useEffect(() => {
        if (name && age && race && profession && bio && firstMessage && image) {
            const initialMessages = [
                {
                    role: "system",
                    content: `You are a fictional character named ${name}. Age: ${age}. Race: ${race}. Profession: ${profession}. Bio: ${bio}.`,
                },
                {
                    role: "assistant",
                    content: firstMessage || "Hello, how can I assist you today?",
                },
            ];
            setMessages(initialMessages);
            setAgentData({ name, age, race, profession, bio, firstMessage, image });
        }
    }, [name, age, race, profession, bio, firstMessage, image]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = {
            role: "user",
            content: chatInput.trim(),
        };
        const updatedMessages = [...messages, userMessage];
        if (updatedMessages.length > 50) updatedMessages.slice(-50);
        setMessages(updatedMessages);
        setChatInput("");
        setLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-2024-08-06",
                    messages: updatedMessages,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch from OpenAI");

            const result = await response.json();
            const newAssistantMessage = result.choices[0].message;
            setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
        } catch (error) {
            console.error("Error during chat:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const chatContainer = document.getElementById("chat-container");
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className="relative min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                    <FaHome className="text-xl" />
                    <span>Back</span>
                </button>
            </div>

            <div className="relative w-full max-w-3xl min-h-dvh bg-zinc-900 bg-opacity-80 mx-auto flex flex-col p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-4">
                    <img
                        src={agentData?.image || "/default-avatar.png"}
                        alt="Character Avatar"
                        className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                        <h1 className="text-white text-2xl font-bold">{agentData?.name || "Character"}</h1>
                        <p className="text-white text-sm">{agentData?.profession || "Unknown Profession"}</p>
                    </div>
                </div>

                <div
                    id="chat-container"
                    className="flex-1 overflow-y-auto p-4 bg-black bg-opacity-50 rounded-lg shadow-lg"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                    {messages
                        .filter((msg, idx) => idx !== 0) // Hide the first system message
                        .map((msg, idx) => (
                            <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                <span
                                    className={`inline-block max-w-[80%] p-2 rounded-xl bg-opacity-80 backdrop-blur-xl ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-neutral-900 text-white"}`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
                    <form onSubmit={handleSendMessage} className="flex w-full">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-1 p-2 rounded-l-lg bg-zinc-800 text-white border border-zinc-600"
                            placeholder="Type your message..."
                        />
                        <button
                            type="submit"
                            className="p-4 bg-violet-500 rounded-r-lg text-white"
                            disabled={loading}
                        >
                            {loading ? <ImSpinner2 className="animate-spin h-5 w-5" /> : <FaPaperPlane className="text-white text-xl" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
