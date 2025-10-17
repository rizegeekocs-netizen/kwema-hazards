document.addEventListener('DOMContentLoaded', () => {
    // --- ORIGINAL GAME LOGIC ---
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    const resetButton = document.getElementById('reset-button');
    const totalHazards = 7; // We know there are 7 hazards
    let foundCount = 0;

    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
        if (foundCount === totalHazards) {
            feedbackText.textContent = 'Congratulations! You found all the hazards!';
        }
    }
    
    // --- NEW RESPONSIVE MAP LOGIC ---
    const image = document.querySelector('#game-container img');
    const areas = document.querySelectorAll('.hazard');
    let originalCoords = [];
    let originalWidth = 0;

    // This function resizes the map coordinates
    function resizeMap() {
        if (!originalWidth) return; // Don't run if the image hasn't loaded yet

        const currentWidth = image.clientWidth;
        const ratio = currentWidth / originalWidth;

        areas.forEach((area, index) => {
            const coords = originalCoords[index];
            const newCoords = coords.map(c => Math.round(c * ratio)).join(',');
            area.setAttribute('coords', newCoords);
        });
    }

    // This runs ONCE after the image has fully loaded
    image.onload = () => {
        // Store the image's original, full-size width
        originalWidth = image.naturalWidth;
        
        // Store the original coordinates from the HTML
        areas.forEach(area => {
            originalCoords.push(area.coords.split(',').map(Number));
        });

        // Add click listeners to each hazard area
        areas.forEach(area => {
            area.addEventListener('click', (event) => {
                event.preventDefault(); // Stop the link from trying to navigate

                const hazardId = area.dataset.hazard;
                const correspondingCircle = document.querySelector(`.circle.hazard-${hazardId}`);

                // Only act if the hazard hasn't been found yet
                if (correspondingCircle && correspondingCircle.classList.contains('hidden')) {
                    correspondingCircle.classList.remove('hidden');
                    foundCount++;
                    updateFeedback();
                }
            });
        });
        
        // Run the resize function for the first time
        resizeMap();
    };

    // Run the resize function every time the window size changes
    window.addEventListener('resize', resizeMap);
    
    // Add a click listener for the reset button
    resetButton.addEventListener('click', () => {
        foundCount = 0;
        circles.forEach(circle => {
            circle.classList.add('hidden');
        });
        updateFeedback();
    });
});
