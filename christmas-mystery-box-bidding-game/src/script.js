document.addEventListener('DOMContentLoaded', () => {
    // Initialize game variables
    let players = [
        { name: 'Player 1', points: 100, boxesWon: 0 },
        { name: 'Player 2', points: 100, boxesWon: 0 },
        { name: 'Player 3', points: 100, boxesWon: 0 },
        { name: 'Player 4', points: 100, boxesWon: 0 },
        { name: 'Player 5', points: 100, boxesWon: 0 },
        { name: 'Player 6', points: 100, boxesWon: 0 },
        { name: 'Player 7', points: 100, boxesWon: 0 }
    ];

    let currentBox = 1;
    let totalBoxes = 14;
    let timer;
    let timeLeft = 60;
    let isPaused = true;

    // Function to start bidding round
    function startBiddingRound(box) {
        // Display box and start timer
        document.getElementById('box-number').innerText = box;
        document.getElementById('box-hint').innerText = `Hint about the contents of Mystery Box ${box}`;
        updateScoreboard();
        updateBoxButtons();
    }

    // Function to start the timer
    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                document.getElementById('countdown').innerText = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Handle end of bidding round
                }
            }
        }, 1000);
    }

    // Function to toggle the timer
    function toggleTimer() {
        isPaused = !isPaused;
        if (!isPaused) {
            startTimer();
            document.getElementById('start-pause-btn').innerText = 'Pause';
        } else {
            clearInterval(timer);
            document.getElementById('start-pause-btn').innerText = 'Start';
        }
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timer);
        timeLeft = 0;
        document.getElementById('countdown').innerText = timeLeft;
        isPaused = true;
        document.getElementById('start-pause-btn').innerText = 'Start';
    }

    // Function to reset the timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 60;
        document.getElementById('countdown').innerText = timeLeft;
        isPaused = true;
        document.getElementById('start-pause-btn').innerText = 'Start';
    }

    // Function to update scoreboard
    function updateScoreboard() {
        let scoreboard = document.getElementById('scoreboard');
        scoreboard.innerHTML = '<h2>Scoreboard</h2>';
        players.forEach(player => {
            let playerInfo = document.createElement('div');
            playerInfo.innerText = `${player.name}: ${player.points} points, ${player.boxesWon} boxes won`;
            scoreboard.appendChild(playerInfo);
        });
    }

    // Function to update box buttons
    function updateBoxButtons() {
        let boxButtonsContainer = document.getElementById('box-buttons-container');
        boxButtonsContainer.innerHTML = '';
        for (let i = 1; i <= totalBoxes; i++) {
            let button = document.createElement('button');
            button.innerText = `Box ${i}`;
            button.classList.add('box-button');
            if (i === currentBox) {
                button.classList.add('selected');
            }
            button.addEventListener('click', () => {
                currentBox = i;
                startBiddingRound(currentBox);
            });
            boxButtonsContainer.appendChild(button);
        }
    }

    // Event listeners for timer buttons
    document.getElementById('start-pause-btn').addEventListener('click', toggleTimer);
    document.getElementById('stop-btn').addEventListener('click', stopTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);

    // Start the game
    updateScoreboard();
    startBiddingRound(currentBox);
});