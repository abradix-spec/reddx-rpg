# Platformer Game

## Game Overview
A precision platformer with advanced movement mechanics including double-jump, wall-sliding, and coyote time. Navigate through three increasingly challenging levels to reach the goal while collecting coins and gems for points.

## Architecture Summary
- Component-based game system with separated physics, rendering, and input
- Level data-driven design with JSON-based level definitions
- Camera system that smoothly follows the player
- Global game state management for score, lives, and level progression

## File Index
### Core Systems
- `index.html` - Entry point, canvas, script loading order
- `src/core/input.js` - Keyboard input handling and fullscreen toggle
- `src/core/loop.js` - Game loop with delta time and 60fps cap
- `src/utils/math.js` - Vector2D class and utility functions

### Engine
- `src/engine/physics.js` - Collision detection and resolution
- `src/engine/renderer.js` - Canvas rendering with camera system

### Game Logic
- `src/game/main.js` - Game initialization, state management, update/render loop
- `src/game/player.js` - Player movement with advanced mechanics (double-jump, wall-slide, coyote time)
- `src/game/level.js` - Level system, collectibles, and three pre-designed levels

## Current Features
- ✅ Complete platformer with smooth controls - Player physics in player.js, collision in physics.js
- ✅ Advanced movement mechanics - Double-jump, wall-slide, coyote time implemented in player.js
- ✅ Three progressive levels - Level definitions in level.js with increasing difficulty
- ✅ Collectible system - Coins and gems with scoring in level.js
- ✅ Camera system - Smooth following camera in renderer.js
- ✅ Lives and scoring - Game state management in main.js

## Key Patterns
- Delta time movement - All movement uses dt for frame-rate independence
- Component separation - Clear separation between physics, rendering, and input
- Level data-driven - Levels defined as data objects for easy modification
- Global namespace - All game code attached to window for production builds