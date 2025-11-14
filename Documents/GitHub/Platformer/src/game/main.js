window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/main.js',
  exports: ['update', 'render', 'loadLevel', 'gameComplete'],
  dependencies: ['Player', 'Level', 'Renderer']
});

// Game state
window.gameState = {
  currentLevel: 0,
  score: 0,
  lives: 3,
  gameOver: false,
  paused: false
};

// Game objects
let canvas, renderer, player, currentLevel;

// Initialize game
window.initGame = function() {
  canvas = document.getElementById('gameCanvas');
  renderer = new window.Renderer(canvas);
  
  loadLevel(0);
  updateUI();
};

window.loadLevel = function(levelIndex) {
  if (levelIndex >= window.LEVELS.length) {
    gameComplete();
    return;
  }
  
  currentLevel = window.createLevel(levelIndex);
  const spawn = currentLevel.spawns[0];
  player = new window.Player(spawn.x, spawn.y);
  
  window.gameState.currentLevel = levelIndex;
  updateUI();
};

window.update = function(deltaTime) {
  if (window.gameState.gameOver || window.gameState.paused) return;

  const dt = deltaTime / 1000;

  // Update player
  player.update(deltaTime, currentLevel.platforms);

  // Check if player fell off the map
  if (player.y > canvas.height + 100) {
    playerDeath();
  }

  // Update level
  currentLevel.update(deltaTime, player);
};

window.render = function() {
  renderer.clear();
  
  // Update camera to follow player
  renderer.updateCamera(player);

  // Render level
  currentLevel.render(renderer);

  // Render player
  renderer.renderEntity(player);

  // Render game over or pause screen
  if (window.gameState.gameOver) {
    renderer.renderText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2, '#ff0000', '32px monospace');
    renderer.renderText('Press R to restart', canvas.width / 2 - 100, canvas.height / 2 + 40, '#fff', '16px monospace');
  }

  if (window.gameState.paused) {
    renderer.renderText('PAUSED', canvas.width / 2 - 50, canvas.height / 2, '#fff', '32px monospace');
    renderer.renderText('Press P to resume', canvas.width / 2 - 80, canvas.height / 2 + 40, '#fff', '16px monospace');
  }
};

window.playerDeath = function() {
  window.gameState.lives--;
  updateUI();

  if (window.gameState.lives <= 0) {
    window.gameState.gameOver = true;
  } else {
    // Respawn at level start
    const spawn = currentLevel.spawns[0];
    player.respawn(spawn.x, spawn.y);
  }
};

window.gameComplete = function() {
  window.gameState.gameOver = true;
  // Will render completion message in next frame
};

window.updateUI = function() {
  document.getElementById('level').textContent = window.gameState.currentLevel + 1;
  document.getElementById('score').textContent = window.gameState.score;
  document.getElementById('lives').textContent = window.gameState.lives;
};

window.restartGame = function() {
  window.gameState = {
    currentLevel: 0,
    score: 0,
    lives: 3,
    gameOver: false,
    paused: false
  };
  loadLevel(0);
};

// Input handlers for pause and restart
window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    if (window.gameState.gameOver) {
      restartGame();
    }
  }
  
  if (e.key === 'p' || e.key === 'P') {
    if (!window.gameState.gameOver) {
      window.gameState.paused = !window.gameState.paused;
    }
  }
});

// Initialize game when page loads
window.addEventListener('load', () => {
  initGame();
  startGame();
});