import Camera from './Camera.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadEntities } from './entities.js';
import { setupKeyboard, setupButtons } from './input.js';
import { setupDebugLayers, setupDebugControls } from './debug.js';

const DEBUG_MODE = true;

async function main(canvas) {
  const context = canvas.getContext('2d');

  const entityFactory = await loadEntities();

  const loadLevel = createLevelLoader(entityFactory);

  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();
  mario.pos.set(64, 64);

  level.entities.add(mario);

  setupKeyboard(mario);
  setupButtons(mario);

  if (DEBUG_MODE) {
    setupDebugLayers(level, camera);
    setupDebugControls(canvas, mario, camera);
  }

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.compositor.draw(context, camera);
  };

  timer.start();
}

const canvas = document.getElementById('screen');

main(canvas);
