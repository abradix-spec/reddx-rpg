window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/player.js',
  exports: ['Player'],
  dependencies: ['Vector2D', 'clamp']
});

window.Player = class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 200;
    this.jumpPower = 500;
    this.gravity = 1500;
    this.color = '#4CAF50';
    this.onGround = false;
    this.facing = 'right';
    
    // Advanced mechanics
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
    this.doubleJumpAvailable = true;
    this.wallSliding = false;
    this.wallJumpCooldown = 0;
  }

  update(deltaTime, platforms) {
    const dt = deltaTime / 1000;
    
    // Update timers
    this.coyoteTime = Math.max(0, this.coyoteTime - dt);
    this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    this.wallJumpCooldown = Math.max(0, this.wallJumpCooldown - dt);

    // Handle input
    this.handleInput(dt);

    // Apply physics
    this.velocityY += this.gravity * dt;
    this.velocityY = window.clamp(this.velocityY, -1000, 1000);

    // Update position
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;

    // Check collisions
    this.onGround = false;
    this.wallSliding = false;

    for (const platform of platforms) {
      if (window.Physics.checkCollision(this.getRect(), platform)) {
        this.handlePlatformCollision(platform);
      }
    }

    // Reset coyote time when leaving ground
    if (!this.onGround && this.coyoteTime <= 0) {
      this.doubleJumpAvailable = true;
    }
  }

  handleInput(dt) {
    // Horizontal movement
    if (window.input.isKeyDown('ArrowLeft')) {
      this.velocityX = -this.speed;
      this.facing = 'left';
    } else if (window.input.isKeyDown('ArrowRight')) {
      this.velocityX = this.speed;
      this.facing = 'right';
    } else {
      this.velocityX *= 0.8; // Friction
    }

    // Jumping with coyote time and jump buffer
    if (window.input.isKeyDown(' ')) {
      if (this.jumpBuffer === 0) {
        this.jumpBuffer = 0.15; // 150ms buffer
      }
    }

    if (this.jumpBuffer > 0) {
      if (this.onGround || this.coyoteTime > 0) {
        this.jump();
        this.jumpBuffer = 0;
      } else if (!this.onGround && this.doubleJumpAvailable && this.wallJumpCooldown <= 0) {
        this.doubleJump();
        this.jumpBuffer = 0;
      }
    }
  }

  handlePlatformCollision(platform) {
    const overlapX = Math.min(
      this.x + this.width - platform.x,
      platform.x + platform.width - this.x
    );
    const overlapY = Math.min(
      this.y + this.height - platform.y,
      platform.y + platform.height - this.y
    );

    if (overlapX < overlapY) {
      // Horizontal collision - check for wall slide
      if (!this.onGround && this.velocityY > 0) {
        this.wallSliding = true;
        this.velocityY = Math.min(this.velocityY, 100); // Wall slide speed
        
        // Wall jump
        if (window.input.isKeyDown(' ') && this.wallJumpCooldown <= 0) {
          this.wallJump();
          this.wallJumpCooldown = 0.2;
        }
      }
      
      if (this.x < platform.x) {
        this.x = platform.x - this.width;
      } else {
        this.x = platform.x + platform.width;
      }
      this.velocityX = 0;
    } else {
      // Vertical collision
      if (this.y < platform.y) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.onGround = true;
        this.coyoteTime = 0.1; // 100ms coyote time
        this.doubleJumpAvailable = true;
      } else {
        this.y = platform.y + platform.height;
        this.velocityY = 0;
      }
    }
  }

  jump() {
    this.velocityY = -this.jumpPower;
  }

  doubleJump() {
    this.velocityY = -this.jumpPower * 0.8;
    this.doubleJumpAvailable = false;
  }

  wallJump() {
    this.velocityY = -this.jumpPower * 0.9;
    this.velocityX = this.facing === 'left' ? 300 : -300;
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
  }
};