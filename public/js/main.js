import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadLevel } from './loaders/level.js';
import { loadEntities } from './entities.js';
import { setupKeyboard, setupButtons } from './input.js';
import { setupDebugLayers, setupDebugControls } from './debug.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

const left = document.getElementById('left');
const right = document.getElementById('right');
const run = document.getElementById('run');
const jump = document.getElementById('jump');

const LEFT_KEY = 'KeyA';
const RIGHT_KEY = 'KeyD';
const RUN_KEY = 'KeyZ';
const JUMP_KEY = 'KeyW';

const { id: LEFT_BUTTON } = left;
const { id: RIGHT_BUTTON } = right;
const { id: RUN_BUTTON } = run;
const { id: JUMP_BUTTON } = jump;

const KEYBOARD_CONTROLS = {
  LEFT: LEFT_KEY,
  RIGHT: RIGHT_KEY,
  RUN: RUN_KEY,
  JUMP: JUMP_KEY,
};

const BUTTON_CONTROLS = {
  LEFT: LEFT_BUTTON,
  RIGHT: RIGHT_BUTTON,
  RUN: RUN_BUTTON,
  JUMP: JUMP_BUTTON,
};

const DEBUG_MODE = true;

Promise.all([loadEntities(), loadLevel('1-1')]).then(([entity, level]) => {
  const camera = new Camera();

  const mario = entity.mario();
  const goomba = entity.goomba();
  const koopa = entity.koopa();

  mario.pos.set(64, 64);
  goomba.pos.set(240, 64);
  koopa.pos.set(260, 64);

  level.entities.add(mario);
  level.entities.add(goomba);
  level.entities.add(koopa);

  setupKeyboard(mario, KEYBOARD_CONTROLS).listenTo(window);
  setupButtons(mario, BUTTON_CONTROLS).listenTo(left, right, run, jump);

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
