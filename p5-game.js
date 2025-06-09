const{player, encounter, getRandomInt} = require('./p5-class.js');

//game state
let gameState = {
  player: null,
  encounter: null,
  isGameOver: false,
  currentStep: 0,
  message: ''
};

//game initialization
function initializeGame() {
  gameState.player = new player(getRandomInt(1, 3), 8, 50); // Initialize player with default stats
  gameState.encounter = new encounter(); // Initialize encounter with goblins
  gameState.encounter.createGoblins(getRandomInt(2, 4)); //Fill encounter with 1 to 3 goblins
  gameState.isGameOver = false;
  gameState.message = 'A goblin approaches...';
  updateGameDisplay();
}

//game steps
const gameSteps = [
  playerTurn, // Step 0: Player's turn
  checkGoblinDeath, //Step 1: Check if any goblins died
  checkGameOver, //Step 2: Check if game is over
  goblinTurn, // Step 3: Goblins' turn(s)
  checkGameOver //Step 4: Check if game is over
];

function onNext(shouldIncrementStep = true) {
  if(!gameState.isGameOver) {
    if (gameState.currentStep < gameSteps.length) {
      if(gameState.currentStep === 0) {
        const {action, target} = gameState.player; //destructure action and target from player
        gameSteps[gameState.currentStep](action, target); // Call the current step function (playerTurn) with action and target params
        gameState.player.action = ""; //reset action
        gameState.player.target = 0; //reset target
      } else {
        gameSteps[gameState.currentStep](); // Call the current step function
      }
      updateGameDisplay();
      if(shouldIncrementStep){
      gameState.currentStep++; // Move to the next step
      }
    } else {
      gameState.currentStep = 0; //Reset to step 0 on round end
    }
  }
}

//player actions
function playerTurn(action, target) {
  gameState.player.isImpervious = false;
  switch (action) {
    case 'attack':
      let targ = gameState.encounter._goblins[target];
      let dmg = gameState.player.attack();
      targ.damage(dmg);
      gameState.message = `You hit ${targ.name} the Goblin for ${dmg} damage!`;
      break;
    case 'defend':
      gameState.player.defend();
      gameState.message = `You take a defensive stance!`;
      break;
  }
}

function checkGoblinDeath() {
  let deadGoblins = gameState.encounter.checkGoblins();
  if(deadGoblins.length === 1) {
    for(let gob of deadGoblins) {
     gameState.message = `${gob.name} the Goblin falls dead.`;
    }
  } else if (deadGoblins.length > 1) {
    gameState.message = `${deadGoblins.length} goblins fall dead.`;
  } else {
    gameState.message = 'The goblins snarl viciously.';
  }
}

//goblin actions
function goblinTurn() {
  let atks = gameState.encounter.getAttacks();
  let dmg = 0;
  atks.forEach((num) => {dmg += num});
  if(dmg > 0) {
    if(!gameState.player.isImpervious){
      gameState.player.damage(dmg);
      gameState.message = `The goblins hit you for ${dmg} damage!`;
    } else {
      gameState.message = `You defend yourself from the goblins' attacks expertly!`;
    }
  } else {
    gameState.message = `The goblins swing wildly and miss you entirely!`
  }
}

//game over
function checkGameOver() {
  const {player, encounter} = gameState;
  if (player.hp <= 0) {
    gameState.isGameOver = true;
    gameState.message = 'You have perished.';
  } else if (encounter._goblins.length === 0) {
    gameState.isGameOver = true;
    gameState.message = 'You emerge victorious.';
  } else {
    gameState.message = 'You grit your teeth.';
  }
}

//update the front-end game display
let currentMessage = "";

function updateGameDisplay() {
  // Implement logic to update the UI with the current game state
  if(!(currentMessage === gameState.message)) {
    currentMessage = gameState.message;
    // console.log(gameState.message);
  }
}

module.exports = {
  initializeGame,
  gameState,
  onNext,
}

//————————————————//
//———TEST CASES———//
//————————————————//

// initializeGame();

// console.log(gameState.encounter._goblins);

// goblinTurn();
// console.log(gameState.message);
// playerTurn("attack", 0);
// console.log(gameState.message);
// playerTurn("defend");
// console.log(gameState.message);

// onNext();
// onNext();
// onNext();
// onNext();
// onNext();
// onNext();
// onNext();
