document.addEventListener('DOMContentLoaded', () => {
    const hazards = document.querySelectorAll('.hazard');
    const circles = document.querySelectorAll('.circle');
    const feedbackText = document.getElementById('feedback-text');
    const resetButton = document.getElementById('reset-button');
    const totalHazards = hazards.length;
    let foundCount = 0;

    function updateFeedback() {
        feedbackText.textContent = `Found ${foundCount} of ${totalHazards} hazards.`;
        if (foundCount === totalHazards) {
            feedbackText.textContent = 'Congratulations! You found all the hazards!';
        }
    }

    hazards.forEach(hazard => {
        hazard.addEventListener('click', (event) => {
            event.preventDefault(); 

            const hazardId = hazard.dataset.hazard;
            const correspondingCircle = document.querySelector(`.circle.hazard-${hazardId}`);

            if (correspondingCircle && correspondingCircle.classList.contains('hidden')) {
                correspondingCircle.classList.remove('hidden');
                foundCount++;
                updateFeedback();
            }
        });
    });

    resetButton.addEventListener('click', () => {
        foundCount = 0;
        circles.forEach(circle => {
            circle.classList.add('hidden');
        });
        updateFeedback();
    });
});