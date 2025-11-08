document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    const areas = document.querySelectorAll('.clickable-area');
    const totalHazards = areas.length;
    let foundCount = 0;
    
    // Timer elements
    const timerDisplay = document.getElementById('timer');
    let timeLeft = 60;
    let timerInterval;
    let gameActive = true;
    let isPaused = false; // New state for pausing

    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again-button');

    // NEW: Control buttons
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');

    // --- TIMER LOGIC ---
    function startTimer() {
        // Make sure to clear any previous timer before starting a new one
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    // --- GAME END LOGIC ---
    function endGame(playerWon) {
        clearInterval(timerInterval);
        gameActive = false;

        if (playerWon) {
            modalTitle.textContent = 'Congratulations! 🎉';
            modalMessage.textContent = `You found all ${totalHazards} hazards with ${timeLeft} seconds to spare!`;
        } else {
            modalTitle.textContent = "Time's Up! ⏳";
            modalMessage.textContent = `You found ${foundCount} out of ${totalHazards} hazards. Better luck next time!`;
        }
        modalOverlay.classList.remove('hidden');
    }

    // --- NEW: PAUSE/RESUME LOGIC ---
    function togglePause() {
        if (!gameActive) return; // Don't pause if game is already over

        isPaused = !isPaused; // Flip the pause state

        if (isPaused) {
            clearInterval(timerInterval); // Stop the timer
            pauseButton.textContent = 'Resume';
            pauseButton.classList.add('resume'); // Add .resume class for green color
        } else {
            startTimer(); // Resume the timer
            pauseButton.textContent = 'Pause';
            pauseButton.classList.remove('resume'); // Remove .resume class
        }
    }

    // --- NEW: RESET GAME LOGIC ---
    function resetGame() {
        // Reset all game variables
        clearInterval(timerInterval);
        timeLeft = 60;
        foundCount = 0;
        gameActive = true;
        isPaused = false;

        // Reset UI
        timerDisplay.textContent = '1:00';
        updateFeedback();
        circles.forEach(circle => circle.classList.add('hidden'));
        modalOverlay.classList.add('hidden'); // Hide modal if it's open

        // Reset pause button
        pauseButton.textContent = 'Pause';
        pauseButton.classList.remove('resume');

        // Start a new game
        startTimer();
    }

    // --- HELPER FUNCTIONS ---
    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
    }

    // --- EVENT LISTENERS ---
    playAgainButton.addEventListener('click', () => {
        location.reload(); // "Play Again" does a full page reload
    });

    // NEW: Add listeners for new buttons
    pauseButton.addEventListener('click', togglePause);
    resetButton.addEventListener('click', resetGame);

    areas.forEach(area => {
        area.addEventListener('click', () => {
            // Don't allow clicking if paused or game is over
            if (!gameActive || isPaused) return;

            const hazardId = area.dataset.hazard;
            const correspondingCircle = document.querySelector(`.circle.hazard-${hazardId}`);

            if (correspondingCircle && correspondingCircle.classList.contains('hidden')) {
                correspondingCircle.classList.remove('hidden');
                foundCount++;
                updateFeedback();
                
                if (foundCount === totalHazards) {
                    endGame(true);
                }
            }
        });
    });

    // --- START THE GAME ---
    startTimer();
});
