document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    const image = document.querySelector('#game-container img');
    const areas = document.querySelectorAll('.hazard');
    const totalHazards = areas.length;
    let foundCount = 0;
    
    // Timer elements
    const timerDisplay = document.getElementById('timer');
    let timeLeft = 60; // 60 seconds for the timer
    let timerInterval;
    let gameActive = true;

    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again-button');

    // --- TIMER LOGIC ---
    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds; // Add leading zero
            
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 0) {
                endGame(false); // Game over, player lost
            }
        }, 1000);
    }

    // --- GAME END LOGIC ---
    function endGame(playerWon) {
        clearInterval(timerInterval); // Stop the timer
        gameActive = false; // Stop player from clicking hazards

        if (playerWon) {
            modalTitle.textContent = 'Congratulations! 🎉';
            modalMessage.textContent = `You found all ${totalHazards} hazards with ${timeLeft} seconds to spare!`;
        } else {
            modalTitle.textContent = "Time's Up! ⏳";
            modalMessage.textContent = `You found ${foundCount} out of ${totalHazards} hazards. Better luck next time!`;
        }
        modalOverlay.classList.remove('hidden');
    }

    // --- GAME SETUP AND EVENT LISTENERS ---
    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
    }

    playAgainButton.addEventListener('click', () => {
        location.reload(); // Easiest way to restart the game
    });

    let originalCoords = [];
    let originalWidth = 0;

    function resizeMap() {
        if (!originalWidth) return;
        const currentWidth = image.clientWidth;
        const ratio = currentWidth / originalWidth;

        areas.forEach((area, index) => {
            const coords = originalCoords[index];
            const newCoords = coords.map(c => Math.round(c * ratio)).join(',');
            area.setAttribute('coords', newCoords);
        });
    }

    image.onload = () => {
        originalWidth = image.naturalWidth;
        
        areas.forEach(area => {
            originalCoords.push(area.coords.split(',').map(Number));
        });

        areas.forEach(area => {
            area.addEventListener('click', (event) => {
                event.preventDefault();
                if (!gameActive) return; // Ignore clicks if game is over

                const hazardId = area.dataset.hazard;
                const correspondingCircle = document.querySelector(`.circle.hazard-${hazardId}`);

                if (correspondingCircle && correspondingCircle.classList.contains('hidden')) {
                    correspondingCircle.classList.remove('hidden');
                    foundCount++;
                    updateFeedback();
                    
                    if (foundCount === totalHazards) {
                        endGame(true); // Game over, player won
                    }
                }
            });
        });
        
        resizeMap();
        startTimer(); // Start the timer only after the image is loaded
    };

    window.addEventListener('resize', resizeMap);
});
