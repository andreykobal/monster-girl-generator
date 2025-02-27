'use client';

import Chat from './Chat';

export default function Parent() {
    const characterData = {
        name: 'Eliza',
        age: 30,
        profession: 'Arcane Technomancer',
        race: 'Human',
        bio: 'Eliza is an Arcane Technomancer...',
        ["first message"]: '*The air crackles with ethereal energy...*',
        image: 'https://metaversetestnetstorage.blob.core.windows.net/generated-images/4728173c1cbb4098b939c9ae6933b426.png',
    };

    const handleGameOver = (gameOver, message, metrics) => {
        alert(`
            Game Over: ${gameOver ? 'You scored above 8!' : 'Better luck next time!'}
            Evaluation Message: ${message}
            Scores:
            Technique: ${metrics.technique}
            Charisma: ${metrics.charisma}
            Creativity: ${metrics.creativity}
            Emotional Intelligence: ${metrics.emotional_intelligence}
        `);
    };

    return <Chat characterData={characterData} onGameOver={handleGameOver} />;
}
