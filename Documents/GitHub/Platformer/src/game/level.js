window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/level.js',
  exports: ['Level', 'LEVELS'],
  dependencies: []
});

window.Level = class Level {
  constructor(data) {
    this.platforms = data.platforms || [];
    this.collectibles = data.collectibles || [];
    this.spawns = data.spawns || [];
    this.goal = data.goal;
    this.name = data.name;
  }

  update(deltaTime, player) {
    // Update collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      collectible.update(deltaTime);
      
      if (collectible.checkCollision(player)) {
        collectible.collected = true;
        this.collectibles.splice(i, 1);
        window.gameState.score += collectible.value;
        window.updateUI();
      }
    }

    // Check goal collision
    if (this.goal && window.Physics.checkCollision(player.getRect(), this.goal)) {
      this.onGoalReached();
    }
  }

  onGoalReached() {
    window.gameState.currentLevel++;
    if (window.gameState.currentLevel < window.LEVELS.length) {
      window.loadLevel(window.gameState.currentLevel);
    } else {
      window.gameComplete();
    }
  }

  render(renderer) {
    // Render platforms
    for (const platform of this.platforms) {
      renderer.renderPlatform(platform);
    }

    // Render collectibles
    for (const collectible of this.collectibles) {
      renderer.renderCollectible(collectible);
    }

    // Render goal
    if (this.goal) {
      renderer.renderPlatform(this.goal);
    }
  }
};

window.Collectible = class Collectible {
  constructor(x, y, type = 'coin') {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.type = type;
    this.collected = false;
    this.animationTime = 0;
    
    switch(type) {
      case 'coin':
        this.color = '#FFD700';
        this.value = 10;
        break;
      case 'gem':
        this.color = '#FF1493';
        this.value = 50;
        break;
      default:
        this.color = '#FFD700';
        this.value = 10;
    }
  }

  update(deltaTime) {
    this.animationTime += deltaTime / 1000;
  }

  checkCollision(player) {
    const dx = (this.x + this.radius) - (player.x + player.width / 2);
    const dy = (this.y + this.radius) - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.width / 2;
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }
};

// Level definitions
window.LEVELS = [
  {
    name: "Getting Started",
    platforms: [
      { x: 0, y: 544, width: 300, height: 32, color: '#666' },
      { x: 400, y: 480, width: 200, height: 32, color: '#666' },
      { x: 700, y: 400, width: 150, height: 32, color: '#666' },
      { x: 950, y: 320, width: 200, height: 32, color: '#666' },
      { x: 1250, y: 250, width: 300, height: 32, color: '#666' },
      { x: 1700, y: 200, width: 200, height: 376, color: '#666' },
      // Walls
      { x: 300, y: 400, width: 32, height: 144, color: '#666' },
      { x: 600, y: 300, width: 32, height: 180, color: '#666' },
    ],
    collectibles: [
      { x: 450, y: 440, type: 'coin' },
      { x: 750, y: 360, type: 'coin' },
      { x: 1000, y: 280, type: 'coin' },
      { x: 1350, y: 210, type: 'gem' },
    ],
    spawns: [{ x: 50, y: 500 }],
    goal: { x: 1800, y: 150, width: 50, height: 50, color: '#4CAF50' }
  },
  {
    name: "Wall Jump Challenge",
    platforms: [
      { x: 0, y: 544, width: 200, height: 32, color: '#666' },
      { x: 300, y: 450, width: 32, height: 126, color: '#666' },
      { x: 450, y: 350, width: 32, height: 226, color: '#666' },
      { x: 600, y: 250, width: 200, height: 32, color: '#666' },
      { x: 900, y: 400, width: 32, height: 176, color: '#666' },
      { x: 1050, y: 300, width: 32, height: 276, color: '#666' },
      { x: 1200, y: 200, width: 200, height: 32, color: '#666' },
      { x: 1500, y: 100, width: 300, height: 476, color: '#666' },
      { x: 200, y: 200, width: 100, height: 32, color: '#666' },
    ],
    collectibles: [
      { x: 250, y: 160, type: 'coin' },
      { x: 650, y: 210, type: 'coin' },
      { x: 950, y: 360, type: 'coin' },
      { x: 1100, y: 260, type: 'coin' },
      { x: 1250, y: 160, type: 'gem' },
    ],
    spawns: [{ x: 50, y: 500 }],
    goal: { x: 1600, y: 50, width: 50, height: 50, color: '#4CAF50' }
  },
  {
    name: "Precision Platforming",
    platforms: [
      { x: 0, y: 544, width: 150, height: 32, color: '#666' },
      { x: 200, y: 500, width: 80, height: 32, color: '#666' },
      { x: 330, y: 450, width: 80, height: 32, color: '#666' },
      { x: 460, y: 400, width: 80, height: 32, color: '#666' },
      { x: 590, y: 350, width: 80, height: 32, color: '#666' },
      { x: 720, y: 300, width: 80, height: 32, color: '#666' },
      { x: 850, y: 250, width: 80, height: 32, color: '#666' },
      { x: 980, y: 200, width: 80, height: 32, color: '#666' },
      { x: 1110, y: 150, width: 200, height: 32, color: '#666' },
      { x: 1400, y: 100, width: 400, height: 476, color: '#666' },
      // Moving platform area
      { x: 300, y: 150, width: 100, height: 32, color: '#999' },
      { x: 500, y: 100, width: 100, height: 32, color: '#999' },
    ],
    collectibles: [
      { x: 230, y: 460, type: 'coin' },
      { x: 360, y: 410, type: 'coin' },
      { x: 490, y: 360, type: 'coin' },
      { x: 620, y: 310, type: 'coin' },
      { x: 750, y: 260, type: 'coin' },
      { x: 880, y: 210, type: 'coin' },
      { x: 1010, y: 160, type: 'coin' },
      { x: 1200, y: 110, type: 'gem' },
    ],
    spawns: [{ x: 50, y: 500 }],
    goal: { x: 1500, y: 50, width: 50, height: 50, color: '#4CAF50' }
  }
];

// Helper to create level from definition
window.createLevel = function(levelIndex) {
  const data = window.LEVELS[levelIndex];
  const level = new Level(data);
  
  // Create collectible objects
  level.collectibles = data.collectibles.map(c => 
    new Collectible(c.x, c.y, c.type)
  );
  
  return level;
};