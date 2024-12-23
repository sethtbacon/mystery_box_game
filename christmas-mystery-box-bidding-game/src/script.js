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
    let timer;
    let timeLeft = 60;
    let isPaused = false;

    // Function to start bidding round
    function startBiddingRound(box) {
        // Display box and start timer
        document.getElementById('box-display').innerText = `Mystery Box ${box}`;
        startTimer();
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

    // Function to pause the timer
    function pauseTimer() {
        isPaused = true;
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timer);
        timeLeft = 0;
        document.getElementById('countdown').innerText = timeLeft;
    }

    // Function to reset the timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 60;
        document.getElementById('countdown').innerText = timeLeft;
        isPaused = false;
    }

    // Function to update scoreboard
    function updateScoreboard() {
        let scoreboard = document.getElementById('scoreboard');
        scoreboard.innerHTML = '';
        players.forEach(player => {
            let playerInfo = document.createElement('div');
            playerInfo.innerText = `${player.name}: ${player.points} points, ${player.boxesWon} boxes won`;
            scoreboard.appendChild(playerInfo);
        });
    }

    // Event listeners for buttons
    document.getElementById('start-btn').addEventListener('click', () => {
        isPaused = false;
        startTimer();
    });

    document.getElementById('pause-btn').addEventListener('click', pauseTimer);
    document.getElementById('stop-btn').addEventListener('click', stopTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);

    // Start the game
    updateScoreboard();
    startBiddingRound(currentBox);
});