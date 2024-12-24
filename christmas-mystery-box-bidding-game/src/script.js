document.addEventListener('DOMContentLoaded', () => {
    let numPlayers = 7;
    let numBoxes = 14;
    let defaultTimer = 60;
    let playerNames = [];
    let boxDescriptions = [];

    // Load box descriptions from JSON file
    fetch('assets/box-descriptions.json')
        .then(response => response.json())
        .then(data => {
            boxDescriptions = data.descriptions;
            initializeGame();
        })
        .catch(error => {
            console.error('Error loading box descriptions:', error);
            boxDescriptions = Array.from({ length: numBoxes }, (_, i) => `Description for Box ${i + 1}`);
            initializeGame();
        });

    function initializeGame() {
        // Initialize game variables
        let players = Array.from({ length: numPlayers }, (_, i) => ({
            name: playerNames[i] || `Player ${i + 1}`,
            points: 100,
            boxesWon: 0
        }));

        let currentBox = 1;
        let timer;
        let timeLeft = defaultTimer;
        let isPaused = true;
        let boxes = Array.from({ length: numBoxes }, (_, i) => ({
            number: i + 1,
            sold: false,
            winningBidder: null,
            bidAmount: null,
            description: boxDescriptions[i]
        }));

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
                document.getElementById('box-hint').innerText = selectedBox.description;
                document.getElementById('sell-box-form').style.display = 'block';
                document.getElementById('sold-box-details').style.display = 'none';
                showSellBoxForm();
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
            timeLeft = defaultTimer; // Reset the timer to default value
            document.getElementById('countdown').innerText = timeLeft;
            document.getElementById('countdown').style.color = 'green';
            isPaused = true;
            document.getElementById('start-pause-btn').innerText = 'Start';
        }

        // Function to reset the timer
        function resetTimer() {
            clearInterval(timer);
            timeLeft = defaultTimer;
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
                playerInfo.innerText = `${player.name}: ${player.points} points, ${player.boxesWon} boxes`;
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
                if (player.boxesWon >= 2) {
                    alert(`${player.name} has already won 2 boxes and cannot win more.`);
                    return;
                }
                player.points -= bidAmount;
                player.boxesWon += 1;
                const box = boxes.find(b => b.number === currentBox);
                if (box) {
                    box.sold = true;
                    box.winningBidder = winningBidder;
                    box.bidAmount = bidAmount;
                    updateScoreboard();
                    updateBoxButtons();
                    updateBoxWinners();
                    document.getElementById('sell-box-form').style.display = 'none';
                    document.getElementById('sold-box-details').style.display = 'block';
                    document.getElementById('sold-box-info').innerText = `Winning Bidder: ${winningBidder}, Bid Amount: ${bidAmount}`;
                }
            } else {
                console.error('Invalid bid amount or insufficient points.', { player, bidAmount });
                alert('Invalid bid amount or insufficient points.');
            }
        }

        // Function to update the box winners table
        function updateBoxWinners() {
            const boxWinnersBody = document.getElementById('box-winners-body');
            boxWinnersBody.innerHTML = '';
            boxes.forEach(box => {
                const row = document.createElement('tr');
                const boxNumberCell = document.createElement('td');
                const winnerCell = document.createElement('td');
                boxNumberCell.innerText = `Box ${box.number}`;
                winnerCell.innerText = box.sold ? box.winningBidder : '';
                row.appendChild(boxNumberCell);
                row.appendChild(winnerCell);
                boxWinnersBody.appendChild(row);
            });
        }

        // Function to reset the game
        function resetGame() {
            location.reload(); // Refresh the page to prompt for the number of players and boxes again
        }

        // Event listeners for timer buttons
        document.getElementById('start-pause-btn').addEventListener('click', toggleTimer);
        document.getElementById('stop-btn').addEventListener('click', stopTimer);
        document.getElementById('reset-btn').addEventListener('click', resetTimer);
        document.getElementById('mark-as-sold-btn').addEventListener('click', markBoxAsSold);
        document.getElementById('reset-game-btn').addEventListener('click', resetGame);

        // Event listener for toggling box winners visibility
        document.getElementById('toggle-box-winners-btn').addEventListener('click', function() {
            var boxWinnersModal = document.getElementById('box-winners-modal');
            boxWinnersModal.style.display = 'block';
        });

        // Start the game
        updateScoreboard();
        updateBoxWinners();
        startBiddingRound(currentBox);
    }

    // Initialize the game
    initializeGame();

    // Settings modal
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const playersBtn = document.getElementById('players-btn');
    const playersModal = document.getElementById('players-modal');
    const editBoxesBtn = document.getElementById('edit-boxes-btn');
    const editBoxesModal = document.getElementById('boxes-modal');
    const boxWinnersBtn = document.getElementById('toggle-box-winners-btn');
    const boxWinnersModal = document.getElementById('box-winners-modal');
    const closeBtns = document.getElementsByClassName('close');
    const settingsForm = document.getElementById('settings-form');
    const playersForm = document.getElementById('players-form');
    const editBoxesForm = document.getElementById('boxes-form');
    const numPlayersInput = document.getElementById('num-players');
    const playerNamesContainer = document.getElementById('player-names-container');
    const boxDescriptionsContainer = document.getElementById('box-descriptions-container');

    settingsBtn.onclick = function() {
        settingsModal.style.display = 'block';
    }

    playersBtn.onclick = function() {
        playersModal.style.display = 'block';
        generatePlayerNameInputs();
    }

    editBoxesBtn.onclick = function() {
        editBoxesModal.style.display = 'block';
        generateBoxDescriptionInputs();
    }

    boxWinnersBtn.onclick = function() {
        boxWinnersModal.style.display = 'block';
    }

    Array.from(closeBtns).forEach(btn => {
        btn.onclick = function() {
            settingsModal.style.display = 'none';
            playersModal.style.display = 'none';
            editBoxesModal.style.display = 'none';
            boxWinnersModal.style.display = 'none';
        }
    });

    window.onclick = function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target == playersModal) {
            playersModal.style.display = 'none';
        }
        if (event.target == editBoxesModal) {
            editBoxesModal.style.display = 'none';
        }
        if (event.target == boxWinnersModal) {
            boxWinnersModal.style.display = 'none';
        }
    }

    window.onkeydown = function(event) {
        if (event.key === 'Escape') {
            settingsModal.style.display = 'none';
            playersModal.style.display = 'none';
            editBoxesModal.style.display = 'none';
            boxWinnersModal.style.display = 'none';
        }
    }

    numPlayersInput.oninput = function() {
        generatePlayerNameInputs();
    }

    function generatePlayerNameInputs() {
        const numPlayers = parseInt(numPlayersInput.value, 10);
        playerNamesContainer.innerHTML = '';
        for (let i = 0; i < numPlayers; i++) {
            const row = document.createElement('tr');
            const playerNumberCell = document.createElement('td');
            playerNumberCell.innerText = `Player ${i + 1}`;
            const playerNameCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-name-${i}`;
            input.name = `player-name-${i}`;
            input.value = playerNames[i] || `Player ${i + 1}`;
            playerNameCell.appendChild(input);
            row.appendChild(playerNumberCell);
            row.appendChild(playerNameCell);
            playerNamesContainer.appendChild(row);
        }
    }

    function generateBoxDescriptionInputs() {
        boxDescriptionsContainer.innerHTML = '';
        for (let i = 0; i < numBoxes; i++) {
            const row = document.createElement('tr');
            const boxNumberCell = document.createElement('td');
            boxNumberCell.innerText = `Box ${i + 1}`;
            const boxDescriptionCell = document.createElement('td');
            const textarea = document.createElement('textarea');
            textarea.id = `box-description-${i}`;
            textarea.name = `box-description-${i}`;
            textarea.value = boxDescriptions[i];
            boxDescriptionCell.appendChild(textarea);
            row.appendChild(boxNumberCell);
            row.appendChild(boxDescriptionCell);
            boxDescriptionsContainer.appendChild(row);
        }
    }

    settingsForm.onsubmit = function(event) {
        event.preventDefault();
        numPlayers = parseInt(document.getElementById('num-players').value, 10);
        numBoxes = parseInt(document.getElementById('num-boxes').value, 10);
        defaultTimer = parseInt(document.getElementById('default-timer').value, 10);
        settingsModal.style.display = 'none';
        initializeGame();
    }

    playersForm.onsubmit = function(event) {
        event.preventDefault();
        playerNames = Array.from({ length: numPlayers }, (_, i) => document.getElementById(`player-name-${i}`).value);
        initializeGame(); // Reinitialize the game with updated player names
        playersModal.style.display = 'none';
    }

    editBoxesForm.onsubmit = function(event) {
        event.preventDefault();
        boxDescriptions = Array.from({ length: numBoxes }, (_, i) => document.getElementById(`box-description-${i}`).value);
        editBoxesModal.style.display = 'none';
        initializeGame();
    }

    // Trigger initial input event to generate player name inputs
    numPlayersInput.oninput();
});