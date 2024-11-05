const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js';
document.head.appendChild(script);

// Configuration object
const CONFIG = {
    initialSize: 500, // Final size of the black hole after initial animation
    growthIncrement: 5, // Amount to increase size on each interval (in pixels)
    spinSpeed: 1.5, // Spin speed in seconds for one full rotation
    animationDuration: 3.2, // Duration of the initial expansion animation (in seconds)
    sparkleImage: 'https://github.com/TemplateDev/swirling-blackhole-js/blob/main/sparkle.png?raw=true', // Sparkle image URL
    sparkleTint: 'rgba(0, 0, 255, 1)', // Tint color for the sparkles
    sparkleSpawnInterval: 5, // Time between sparkle spawns in milliseconds
    lensFlareImage: 'https://github.com/TemplateDev/swirling-blackhole-js/blob/main/lens-flare.png?raw=true', // Lens flare image URL
    lensFlareSpawnInterval: 10, // Time between lens flare spawns in milliseconds
    lensFlareRotationOffset: 0, // Offset rotation for the lens flare
    blackHoleSpawnSound: 'https://github.com/TemplateDev/swirling-blackhole-js/raw/refs/heads/main/blackhole-spawn.mp3',
    ambienceSound: 'https://github.com/TemplateDev/swirling-blackhole-js/raw/refs/heads/main/ambience.mp3',
    music1: 'https://github.com/TemplateDev/swirling-blackhole-js/raw/refs/heads/main/music1.mp3',
    music2: 'https://github.com/TemplateDev/swirling-blackhole-js/raw/refs/heads/main/music2.mp3'
};

// Define the createBlackHole function
script.onload = function() {
    function createBlackHole() {
        const blackHole = document.createElement('div');

        // Set the initial styles for the black hole
        blackHole.style.width = '0px'; // Start with width of 0
        blackHole.style.height = '0px'; // Start with height of 0
        blackHole.style.backgroundImage = 'url("https://github.com/TemplateDev/swirling-blackhole-js/blob/main/blackhole.png?raw=true")';
        blackHole.style.backgroundSize = 'cover';
        blackHole.style.position = 'fixed'; // Fixed positioning for centering
        blackHole.style.top = '50%'; // Center vertically
        blackHole.style.left = '50%'; // Center horizontally
        blackHole.style.transform = 'translate(-50%, -50%)'; // Adjust for size
        blackHole.style.zIndex = '9999'; // Ensure it's on top of other elements

        // Append the black hole to the body
        document.body.appendChild(blackHole);

        // Play black hole spawn sound
        const spawnSound = new Audio(CONFIG.blackHoleSpawnSound);
        spawnSound.play();

        // Use GSAP to animate the width and height
        gsap.to(blackHole, {
            width: `${CONFIG.initialSize}px`, // Set the final width from config
            height: `${CONFIG.initialSize}px`, // Set the final height from config
            duration: CONFIG.animationDuration, // Duration of the animation from config
            ease: 'back.out', // Easing function for smooth transition
            onComplete: () => {
                // Start increasing the size of the black hole after the initial animation
                setInterval(() => {
                    // Get the current width and height
                    const currentWidth = parseInt(blackHole.style.width);
                    const currentHeight = parseInt(blackHole.style.height);

                    // Increase the size by the configured increment
                    blackHole.style.width = `${currentWidth + CONFIG.growthIncrement}px`;
                    blackHole.style.height = `${currentHeight + CONFIG.growthIncrement}px`;
                }, 100); // Set interval timing to 100 ms

                // Start emitting sparkles
                setInterval(emitSparkle, CONFIG.sparkleSpawnInterval);
                // Start emitting lens flares
                setInterval(emitLensFlare, CONFIG.lensFlareSpawnInterval);

                // Start the animation of elements to the black hole
                animateToBlackHole(blackHole);
            }
        });

        // Add a CSS animation for spinning
        blackHole.style.animation = `spin ${CONFIG.spinSpeed}s linear infinite`; // Spin continuously

        // Define the keyframes for the spin animation
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `, styleSheet.cssRules.length);
    }

    function emitSparkle() {
        // Create sparkle element
        const sparkle = document.createElement('img');
        sparkle.src = CONFIG.sparkleImage;
        sparkle.style.width = '50px'; // Set width of the sparkle
        sparkle.style.position = 'fixed';
        sparkle.style.zIndex = '9998'; // Ensure it's just below the black hole
        sparkle.style.pointerEvents = 'none'; // Prevent interaction

        // Set the initial position at the center of the black hole
        sparkle.style.top = '50%';
        sparkle.style.left = '50%';
        sparkle.style.transform = 'translate(-50%, -50%)'; // Center it on the black hole

        // Apply a tint using CSS filter
        sparkle.style.filter = `drop-shadow(0 0 10px ${CONFIG.sparkleTint})`;

        // Append sparkle to the body
        document.body.appendChild(sparkle);

        // Animate the sparkle in a spiral path
        const duration = 2; // Animation duration
        const distance = 1000; // Distance to move
        const rotation = Math.random() * 360; // Random initial rotation

        gsap.to(sparkle, {
            duration: duration,
            x: Math.cos(rotation) * distance, // Move along x in a spiral
            y: Math.sin(rotation) * distance, // Move along y in a spiral
            opacity: 0, // Fade out
            onComplete: () => {
                sparkle.remove(); // Remove the sparkle after the animation completes
            }
        });
    }

    function emitLensFlare() {
        // Create lens flare element
        const lensFlare = document.createElement('img');
        lensFlare.src = CONFIG.lensFlareImage;
        lensFlare.style.width = '100px'; // Set width of the lens flare
        lensFlare.style.position = 'fixed';
        lensFlare.style.pointerEvents = 'none'; // Prevent interaction
        lensFlare.style.zIndex = '10000'; // Ensure it's just below the black hole

        // Randomly position the lens flare off-screen
        const spawnSide = Math.random() < 0.5 ? -1 : 1; // Randomly choose left or right side
        const spawnYSide = Math.random() < 0.5 ? -1 : 1; // Randomly choose top or bottom side
        const spawnX = spawnSide === -1 ? -50 : window.innerWidth + 50; // Off-screen X position
        const spawnY = spawnYSide === -1 ? -50 : Math.random() * window.innerHeight; // Off-screen Y position

        // Set initial position
        lensFlare.style.left = `${spawnX}px`;
        lensFlare.style.top = `${spawnY}px`;

        // Append lens flare to the body
        document.body.appendChild(lensFlare);

        // Calculate the angle to the black hole
        const blackHoleX = window.innerWidth / 2;
        const blackHoleY = window.innerHeight / 2;
        const dx = blackHoleX - spawnX;
        const dy = blackHoleY - spawnY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + CONFIG.lensFlareRotationOffset; // Convert to degrees and apply rotation offset

        // Animate the lens flare moving to the black hole
        const duration = 1.5; // Duration for lens flare animation
        const distance = Math.sqrt(dx * dx + dy * dy); // Distance to black hole

        gsap.to(lensFlare, {
            duration: duration,
            x: blackHoleX - spawnX, // Move towards black hole in x
            y: blackHoleY - spawnY, // Move towards black hole in y
            rotation: angle, // Rotate towards the black hole
            opacity: 0, // Fade out as it reaches the black hole
            onComplete: () => {
                lensFlare.remove(); // Remove the lens flare after the animation completes
            }
        });
    }

    function animateToBlackHole(blackHole) {
        // Select all elements in the document
        const elements = Array.from(document.querySelectorAll('*'));

        let index = 0; // Initialize index for elements
        console.log(`Total elements to animate: ${elements.length}`);

        const pullInterval = setInterval(() => {
            if (index < elements.length) {
                const element = elements[index];

                try {
                    // Skip elements that are black hole or excluded tags
                    if (element === blackHole || 
                        element.tagName === 'BODY' || 
                        element.tagName === 'STYLE' || 
                        element.tagName === 'SCRIPT' || 
                        element.tagName === 'META' || 
                        element.tagName === 'HEAD' || 
                        element.tagName === 'HTML') {
                        console.log(`Skipping element: ${element.tagName}`);
                        index++; // Move to the next element
                        return; // Continue to the next iteration
                    }

                    // Get the children of the current element
                    const children = Array.from(element.children);
                    let childIndex = children.length - 1; // Start from the last child

                    // Animate each child in reverse order (last child first)
                    const childInterval = setInterval(() => {
                        if (childIndex >= 0) {
                            const child = children[childIndex];

                            try {
                                console.log(`Animating child: ${child.tagName} of element: ${element.tagName} at child index ${childIndex}`);

                                // Animate the child towards the black hole
                                const blackHoleX = window.innerWidth / 2;
                                const blackHoleY = window.innerHeight / 2;

                                // Animate the child towards the black hole
                                gsap.to(child, {
                                    duration: 0.5, // Animation duration for child
                                    x: blackHoleX - child.getBoundingClientRect().left,
                                    y: blackHoleY - child.getBoundingClientRect().top,
                                    onComplete: () => {
                                        // Fade out the child and remove it
                                        gsap.to(child, {
                                            duration: 0.5,
                                            opacity: 0,
                                            onComplete: () => {
                                                child.remove(); // Remove child after fading out
                                                console.log(`Child removed: ${child.tagName}`);
                                            }
                                        });
                                    }
                                });

                                childIndex--; // Move to the next child (going backwards)
                            } catch (error) {
                                console.error(`Error animating child ${child.tagName}: ${error}`);
                                childIndex--; // Move to the next child (even on error)
                            }
                        } else {
                            clearInterval(childInterval); // Stop pulling if all children have been animated
                            console.log(`All children of element ${element.tagName} have been animated.`);

                            // Animate the parent element itself after all children are done
                            try {
                                console.log(`Animating element: ${element.tagName} at index ${index}`);
                                gsap.to(element, {
                                    duration: 1.5, // Animation duration for element
                                    x: (blackHoleX - element.getBoundingClientRect().left) * 1,
                                    y: (blackHoleY - element.getBoundingClientRect().top) * 1,
                                    onComplete: () => {
                                        // Fade out the element and remove it
                                        gsap.to(element, {
                                            duration: 0.5,
                                            opacity: 0,
                                            onComplete: () => {
                                                element.remove(); // Remove element after fading out
                                                console.log(`Element removed: ${element.tagName}`);
                                            }
                                        });
                                    }
                                });
                            } catch (error) {
                                console.error(`Error animating element ${element.tagName}: ${error}`);
                            }

                            index++; // Move to the next element
                        }
                    }, 500); // Pull one child every 0.5 seconds

                } catch (error) {
                    console.error(`Error processing element ${element.tagName}: ${error}`);
                    index++; // Move to the next element (even on error)
                }
            } else {
                clearInterval(pullInterval); // Stop pulling if all elements have been animated
                console.log('All elements have been animated.');
            }
        }, 1500); // Pull one element every 1.5 seconds
    }

    // Call createBlackHole to start the process
    createBlackHole();
};
