const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const HOST = "localhost";
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));

const {initializeGame, gameState, onNext} = require('./p5-game.js');

initializeGame();

// Route to serve the index.html file
app.get('/index.html', (req, res) => {
  initializeGame();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Respond with game state
app.get('/api/game-state', (req, res) => {
  res.status(200).type('application/json; charset=utf-8');
  res.json(gameState);
});

//Handle player actions
app.post('/api/player-action', (req, res) => {
  const { action, target } = req.body; // Get the action from the request body
  gameState.player.setAction(action, target); // Handle the player action
  onNext();
  res.status(200).type('application/json; charset=utf-8');
  res.json(gameState);
});

//Handle advancing the current step
app.post('/api/on-next', (req, res) => {
  onNext();
  res.status(200).type('application/json; charset=utf-8');
  res.json(gameState);
});

//Handle 404 for all other routes
app.use((req, res) => {
  res.status(404).send('404 Not Found')
});

//Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server runnning at http://${HOST}:${PORT}`)
});