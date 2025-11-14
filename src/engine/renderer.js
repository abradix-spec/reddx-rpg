window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/engine/renderer.js',
  exports: ['Renderer'],
  dependencies: []
});

window.Renderer = class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
  }

  clear() {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCamera(target) {
    const idealX = target.x - this.canvas.width / 2;
    const idealY = target.y - this.canvas.height / 2;
    
    this.camera.x = window.lerp(this.camera.x, idealX, 0.1);
    this.camera.y = window.lerp(this.camera.y, idealY, 0.1);
  }

  renderEntity(entity) {
    this.ctx.save();
    this.ctx.translate(entity.x - this.camera.x, entity.y - this.camera.y);
    this.ctx.fillStyle = entity.color;
    this.ctx.fillRect(0, 0, entity.width, entity.height);
    this.ctx.restore();
  }

  renderPlatform(platform) {
    this.ctx.save();
    this.ctx.translate(platform.x - this.camera.x, platform.y - this.camera.y);
    this.ctx.fillStyle = platform.color;
    this.ctx.fillRect(0, 0, platform.width, platform.height);
    this.ctx.restore();
  }

  renderCollectible(collectible) {
    this.ctx.save();
    this.ctx.translate(collectible.x - this.camera.x, collectible.y - this.camera.y);
    this.ctx.fillStyle = collectible.color;
    this.ctx.beginPath();
    this.ctx.arc(collectible.radius, collectible.radius, collectible.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  renderText(text, x, y, color = '#fff', font = '16px monospace') {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }
};