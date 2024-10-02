let isDarkMode = false;
let timer = 0;
let timerInterval;
let playerName = '';
let playerPosition = { x: 0, y: 0 };
let gridSize = 10;
let cellSize = 50;
let maze, ctx;
let userGamesPlayed = {}; 

const mazeStructure = [
  [0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
];

function startGame() {
  const nameInput = document.getElementById('name').value;
  if (nameInput) {
    playerName = nameInput;
    document.getElementById('player-name').textContent = playerName;
    document.getElementById('name-input').style.display = 'none';

    if (!userGamesPlayed[playerName]) {
      userGamesPlayed[playerName] = 0;
    }
    userGamesPlayed[playerName]++;
    document.getElementById('times-played').textContent = userGamesPlayed[playerName];
    
    startTimer();
    initMaze();
    document.addEventListener('keydown', handleMovement);
  } else {
    alert('Please enter your name to start the game.');
  }
}

function startTimer() {
  timer = 0;
  document.getElementById('timer').textContent = timer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function toggleMode() {
  const body = document.body;
  const button = document.getElementById('mode-button');
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    body.classList.add('dark-mode');
    button.textContent = 'Light Mode';
  } else {
    body.classList.remove('dark-mode');
    button.textContent = 'Dark Mode';
  }

  drawMaze();
}

function initMaze() {
  maze = document.getElementById('maze');
  ctx = maze.getContext('2d');
  playerPosition = { x: 0, y: 0 };
  drawMaze();
}

function drawMaze() {
  ctx.clearRect(0, 0, maze.width, maze.height);

  if (isDarkMode) {
    ctx.fillStyle = '#333';
  } else {
    ctx.fillStyle = '#f0f0f0';
  }
  ctx.fillRect(0, 0, maze.width, maze.height);

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (mazeStructure[row][col] === 1) {
        ctx.fillStyle = isDarkMode ? '#fff' : '#000';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  drawPlayer();
}

function drawPlayer() {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(playerPosition.x * cellSize, playerPosition.y * cellSize, cellSize, cellSize);
}

function handleMovement(event) {
  const { key } = event;
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  switch (key) {
    case 'ArrowUp':
      if (newY > 0 && mazeStructure[newY - 1][newX] === 0) newY--;
      break;
    case 'ArrowDown':
      if (newY < gridSize - 1 && mazeStructure[newY + 1][newX] === 0) newY++;
      break;
    case 'ArrowLeft':
      if (newX > 0 && mazeStructure[newY][newX - 1] === 0) newX--;
      break;
    case 'ArrowRight':
      if (newX < gridSize - 1 && mazeStructure[newY][newX + 1] === 0) newX++;
      break;
  }

  playerPosition = { x: newX, y: newY };
  drawMaze();

  if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('result-name').textContent = playerName;
  document.getElementById('result-time').textContent = timer;
  document.getElementById('resultModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('resultModal').style.display = 'none';
  askReplayOrNewUser();
}

function askReplayOrNewUser() {
  const replay = confirm('Do you want to play again? Press OK to replay or Cancel for a new player.');
  
  if (replay) {
    startGame(); 
  } else {
    resetGameForNewUser(); 
  }
}

function resetGameForNewUser() {
  document.getElementById('name-input').style.display = 'block';
  document.getElementById('name').value = '';
  document.getElementById('times-played').textContent = '0';
  clearInterval(timerInterval);
  playerPosition = { x: 0, y: 0 };
  drawMaze();
}