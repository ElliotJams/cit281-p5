let gameState = {currentStep: 0, encounter: []};

fetch('/api/game-state')
  .then(response => response.json)
  .then(data => {
     gameState = data;
    })
  .catch(error => console.error('Error fetching the greeting:', error));

// Function to update the game display
function updateGameDisplay() {
  const goblinDisplay = document.getElementById('goblinDisplay');
  const playerDisplay = document.getElementById('playerPortrait');
  const messageBox = document.getElementById('messageBox');
  const playerHP = document.getElementById('playerHP');
  const actionButtons = document.getElementById('actionButtons');

  // Clear previous goblins
  goblinDisplay.innerHTML = '';

  // Display goblins
  gameState.encounter._goblins.forEach(goblin => {
    const goblinImg = document.createElement('img');
    goblinImg.src = `images/Goblin${goblin.type}.png`;
    goblinImg.alt = `${goblin.name} the Goblin`;
    goblinImg.classList.add('goblin-image');
    goblinImg.addEventListener('click', () => selectTarget(goblin)); // Add click event for targeting
    goblinDisplay.appendChild(goblinImg);
  });

  //Display player portrait
  playerDisplay.src = `images/Player${gameState.player.type}.png`;

  // Update player HP
  playerHP.textContent = gameState.player.hp;

  //Update background for death
  if(gameState.isGameOver) {
    document.body.style.backgroundColor = 'darkred';
  }

  // Update message box
  messageBox.textContent = gameState.message;

  // Show or hide action buttons based on current step
  if (gameState.currentStep === 0) {
    actionButtons.style.display = 'block'; // Show action buttons
  } else {
    actionButtons.style.display = 'none'; // Hide action buttons
  }
}

// Function to handle player action selection
function selectAction(action) {
  if (action === 'attack') {
    // Hide action buttons and update message
    document.getElementById('actionButtons').style.display = 'none';
    gameState.message = 'Select a target.';
    updateGameDisplay(); // Refresh the display
  } else {
    // Handle defend action
    fetch('/api/player-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    })
    .then(response => response.json())
    .then(data => {
      // Update game state and display
      gameState = data; // Update the game state with the response
      updateGameDisplay(); // Refresh the display
    })
    .catch(error => console.error('Error:', error));
  }
}

// Function to select a target goblin
function selectTarget(goblin) {
    // Send the action and target to the server
    fetch('/api/player-action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'attack', target: goblin.id }) // Assuming goblin has an id property
    })
    .then(response => response.json())
    .then(data => {
        // Update game state and display
        gameState = data; // Update the game state with the response
        updateGameDisplay(); // Refresh the display
    })
    .catch(error => console.error('Error:', error));
}

// Function to handle the next step in the game
function onNext() {
  fetch('/api/on-next', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Update game state and display
    gameState = data; // Update the game state with the response
    updateGameDisplay(); // Refresh the display
  })
  .catch(error => console.error('Error:', error));
}

// Event listeners for action buttons
document.getElementById('attackButton').addEventListener('click', () => {
  selectAction('attack'); // Call selectAction with 'attack'
});

document.getElementById('defendButton').addEventListener('click', () => {
  selectAction('defend'); // Call selectAction with 'defend'
});

// Event listener for advancing the game on click
document.body.addEventListener('click', () => {
  if (gameState.currentStep !== 0) { // Only call onNext if it's not the player's turn
    onNext();
  }
});