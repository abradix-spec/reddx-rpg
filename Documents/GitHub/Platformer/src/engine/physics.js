window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/engine/physics.js',
  exports: ['Physics', 'checkCollision'],
  dependencies: ['Vector2D']
});

window.Physics = class Physics {
  static checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  static resolveCollision(entity, platform) {
    const overlapX = Math.min(
      entity.x + entity.width - platform.x,
      platform.x + platform.width - entity.x
    );
    const overlapY = Math.min(
      entity.y + entity.height - platform.y,
      platform.y + platform.height - entity.y
    );

    if (overlapX < overlapY) {
      // Horizontal collision
      if (entity.x < platform.x) {
        entity.x = platform.x - entity.width;
      } else {
        entity.x = platform.x + platform.width;
      }
      entity.velocityX = 0;
    } else {
      // Vertical collision
      if (entity.y < platform.y) {
        entity.y = platform.y - entity.height;
        entity.velocityY = 0;
        entity.onGround = true;
      } else {
        entity.y = platform.y + platform.height;
        entity.velocityY = 0;
      }
    }
  }
};

window.checkCollision = Physics.checkCollision;