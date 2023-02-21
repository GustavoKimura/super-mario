import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import { setupKeyboard } from './input.js';

import { setupDebugLayers, setupDebugControls } from './debug.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const left = document.getElementById('left');
const right = document.getElementById('right');
const run = document.getElementById('run');
const jump = document.getElementById('jump');

const DEBUG_MODE = false;

Promise.all([createMario(), loadLevel('1-1')]).then(([mario, level]) => {
  const camera = new Camera();

  mario.pos.set(64, 64);
  level.entities.add(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window, left, right, run, jump);

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
});
