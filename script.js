document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    const areas = document.querySelectorAll('.clickable-area');
    const totalHazards = areas.length;
    let foundCount = 0;
    
    // Found hazards list elements
    const foundHazardsContainer = document.getElementById('found-hazards-container');
    const foundHazardsList = document.getElementById('found-hazards-list');

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

    // --- Universal Click/Tap Event Handler ---
    // This prevents "ghost clicks" on mobile
    function addSmartEventListener(element, handler) {
        let isHandlingEvent = false;

        element.addEventListener('touchend', (e) => {
            e.preventDefault(); 
            if (isHandlingEvent) return;
            isHandlingEvent = true;
            handler(e);
            setTimeout(() => {
                isHandlingEvent = false;
            }, 300);
        });

        element.addEventListener('click', (e) => {
            if (isHandlingEvent) return;
            handler(e);
        });
    }

    // --- TIMER LOGIC ---
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isPaused) return; // Don't count down if paused
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
            // No need to clear interval, just let it skip
            pauseButton.textContent = 'Resume';
            pauseButton.classList.add('resume'); 
        } else {
            // No need to restart, it will just resume counting
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

        foundHazardsList.innerHTML = '';
        foundHazardsContainer.classList.add('hidden');

        startTimer();
    }

    // --- HELPER FUNCTIONS ---
    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
    }

    // --- EVENT LISTENERS (Using the new smart handler) ---
    
    addSmartEventListener(playAgainButton, () => {
        location.reload();
    });

    addSmartEventListener(pauseButton, togglePause);
    
    addSmartEventListener(resetButton, resetGame);

    areas.forEach(area => {
        addSmartEventListener(area, (event) => {
            if (!gameActive || isPaused) return;

            const hazardId = area.dataset.hazard;
            const correspondingCircle = document.querySelector(`.circle.hazard-${hazardId}`);

            if (correspondingCircle && correspondingCircle.classList.contains('hidden')) {
                correspondingCircle.classList.remove('hidden');
                foundCount++;
                updateFeedback();
                
                // Add the hazard name to the list
                const hazardName = area.dataset.name;
                const newListItem = document.createElement('li');
                newListItem.textContent = hazardName;
                foundHazardsList.appendChild(newListItem);
                foundHazardsContainer.classList.remove('hidden'); // Show the list
                
                if (foundCount === totalHazards) {
                    endGame(true);
                }
            }
        });
    });

    // --- START THE GAME ---
    startTimer();
});
