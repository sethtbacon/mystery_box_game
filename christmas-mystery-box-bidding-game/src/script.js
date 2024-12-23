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
    let boxes = Array.from({ length: totalBoxes }, (_, i) => ({ number: i + 1, sold: false, winningBidder: null, bidAmount: null }));

    // Function to start bidding round
    function startBiddingRound(box) {
        const selectedBox = boxes.find(b => b.number === box);
        document.getElementById('box-number').innerText = box;
        if (selectedBox.sold) {
            document.getElementById('box-hint').innerText = `Box ${box} was sold to ${selectedBox.winningBidder} for ${selectedBox.bidAmount} points.`;
            document.getElementById('sell-box-form').style.display = 'none';
            document.getElementById('sold-box-details').style.display = 'block';
            document.getElementById('sold-box-info').innerText = `Winning Bidder: ${selectedBox.winningBidder}, Bid Amount: ${selectedBox.bidAmount}`;
        } else {
            document.getElementById('box-hint').innerText = `Hint about the contents of Mystery Box ${box}`;
            document.getElementById('sell-box-form').style.display = 'block';
            document.getElementById('sold-box-details').style.display = 'none';
        }
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
                if (timeLeft <= 15) {
                    document.getElementById('countdown').style.color = 'red';
                } else {
                    document.getElementById('countdown').style.color = 'green';
                }
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
        document.getElementById('countdown').style.color = 'green';
        isPaused = true;
        document.getElementById('start-pause-btn').innerText = 'Start';
    }

    // Function to reset the timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 60;
        document.getElementById('countdown').innerText = timeLeft;
        document.getElementById('countdown').style.color = 'green';
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
        boxes.forEach(box => {
            let button = document.createElement('button');
            button.innerText = box.sold ? `Sold ${box.number}` : `Box ${box.number}`;
            button.classList.add('box-button');
            if (box.number === currentBox) {
                button.classList.add('selected');
            }
            button.addEventListener('click', () => {
                currentBox = box.number;
                startBiddingRound(currentBox);
            });
            boxButtonsContainer.appendChild(button);
        });
    }

    // Function to show the sell box form
    function showSellBoxForm() {
        const sellBoxForm = document.getElementById('sell-box-form');
        const winningBidderSelect = document.getElementById('winning-bidder');
        winningBidderSelect.innerHTML = '';
        players.forEach(player => {
            let option = document.createElement('option');
            option.value = player.name;
            option.innerText = player.name;
            winningBidderSelect.appendChild(option);
        });
        sellBoxForm.style.display = 'block';
    }

    // Function to mark a box as sold
    function markBoxAsSold() {
        const winningBidder = document.getElementById('winning-bidder').value;
        const bidAmount = parseInt(document.getElementById('bid-amount').value, 10);
        const player = players.find(p => p.name === winningBidder);
        if (player && bidAmount > 0 && bidAmount <= player.points) {
            player.points -= bidAmount;
            player.boxesWon += 1;
            const box = boxes.find(b => b.number === currentBox);
            if (box) {
                box.sold = true;
                box.winningBidder = winningBidder;
                box.bidAmount = bidAmount;
                updateScoreboard();
                updateBoxButtons();
                document.getElementById('sell-box-form').style.display = 'none';
                document.getElementById('sold-box-details').style.display = 'block';
                document.getElementById('sold-box-info').innerText = `Winning Bidder: ${winningBidder}, Bid Amount: ${bidAmount}`;
            }
        } else {
            alert('Invalid bid amount or insufficient points.');
        }
    }

    // Function to reset the game
    function resetGame() {
        players = players.map(player => ({ ...player, points: 100, boxesWon: 0 }));
        currentBox = 1;
        boxes = Array.from({ length: totalBoxes }, (_, i) => ({ number: i + 1, sold: false, winningBidder: null, bidAmount: null }));
        resetTimer();
        updateScoreboard();
        updateBoxButtons();
        document.getElementById('sell-box-form').style.display = 'none';
        document.getElementById('sold-box-details').style.display = 'none';
    }

    // Event listeners for timer buttons
    document.getElementById('start-pause-btn').addEventListener('click', toggleTimer);
    document.getElementById('stop-btn').addEventListener('click', stopTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);
    document.getElementById('mark-as-sold-btn').addEventListener('click', markBoxAsSold);
    document.getElementById('reset-game-btn').addEventListener('click', resetGame);

    // Start the game
    updateScoreboard();
    startBiddingRound(currentBox);
});