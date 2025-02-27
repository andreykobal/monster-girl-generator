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

    const handleGameOver = (gameOver) => {
        alert(gameOver ? 'Game Over: You scored above 8!' : 'Game Over: Better luck next time!');
    };

    return <Chat characterData={characterData} onGameOver={handleGameOver} />;
}
