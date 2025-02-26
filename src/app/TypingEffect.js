'use client';

import React from 'react';
import Typewriter from 'typewriter-effect';

const TypingEffect = () => {
    return (
        <div className="max-w-6xl mx-auto min-h-[60px] text-center text-xl font-mono text-white flex justify-center items-center">
            <div className="bg-zinc-800 bg-opacity-40 font-bold backdrop-blur-lg p-2 text-white rounded-lg shadow-lg text-xs md:text-lg">
                <Typewriter
                    options={{
                        strings: [
                            'Mixing Monster DNA... because regular is overrated!',
                            'Unleashing chaos... prepare for total nonsense!',
                            'Summoning something weird... hope you’re ready!',
                            'Cooking up a monster with 99% chaos and 1% mystery...',
                            'Loading your new weird best friend... she bites!',
                            'Merging magic, mayhem, and a little bit of absurdity...',
                            'Creating a character with more drama than a reality show...',
                            'Activating pure nonsense... hold your horses!',
                            'Brace yourself... a monster’s coming to ruin your day!',
                            'Crossing wires... sparks, glitches, and general weirdness!',
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 100, // Typing speed
                        pauseFor: 1500, // Pause after a phrase
                        deleteSpeed: 50, // Speed at which the text is erased
                        cursor: '|', // The cursor style
                        cursorClassName: 'Typewriter__cursor', // Custom cursor class name
                        wrapperClassName: 'Typewriter__wrapper', // Wrapper class name
                    }}
                />
            </div>
        </div>
    );
};

export default TypingEffect;
