document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    // Select the NEW clickable areas
    const areas = document.querySelectorAll('.clickable-area');
    const totalHazards = areas.length;
    let foundCount = 0;
    
    // Timer elements
    const timerDisplay = document.getElementById('timer');
    let timeLeft = 60;
    let timerInterval;
    let gameActive = true;

    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again-button');

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

    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
    }

    playAgainButton.addEventListener('click', () => {
        location.reload();
    });

    // Add click listeners to the new clickable areas
    areas.forEach(area => {
        area.addEventListener('click', () => {
            if (!gameActive) return;

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

    // Start the timer when the script loads
    startTimer();
});
