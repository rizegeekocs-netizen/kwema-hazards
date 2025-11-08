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
    let isPaused = false;

    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again-button');

    // Control buttons
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');

    // --- TIMER LOGIC ---
    function startTimer() {
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

    // --- PAUSE/RESUME LOGIC ---
    function togglePause() {
        if (!gameActive) return;

        isPaused = !isPaused;

        if (isPaused) {
            clearInterval(timerInterval);
            pauseButton.textContent = 'Resume';
            pauseButton.classList.add('resume');
        } else {
            startTimer();
            pauseButton.textContent = 'Pause';
            pauseButton.classList.remove('resume');
        }
    }

    // --- RESET GAME LOGIC ---
    function resetGame() {
        clearInterval(timerInterval);
        timeLeft = 60;
        foundCount = 0;
        gameActive = true;
        isPaused = false;

        timerDisplay.textContent = '1:00';
        updateFeedback();
        circles.forEach(circle => circle.classList.add('hidden'));
        modalOverlay.classList.add('hidden');

        pauseButton.textContent = 'Pause';
        pauseButton.classList.remove('resume');

        startTimer();
    }

    // --- HELPER FUNCTIONS ---
    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
    }

    // --- EVENT LISTENERS ---
    
    // CHANGED 'click' to 'touchend'
    playAgainButton.addEventListener('touchend', () => {
        location.reload();
    });

    // CHANGED 'click' to 'touchend'
    pauseButton.addEventListener('touchend', togglePause);
    
    // CHANGED 'click' to 'touchend'
    resetButton.addEventListener('touchend', resetGame);

    // CHANGED 'click' to 'touchend'
    areas.forEach(area => {
        area.addEventListener('touchend', (event) => {
            event.preventDefault(); // Stop the screen from bouncing
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
