import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadFont } from './loaders/font.js';
import { loadEntities } from './entities.js';
import { setupKeyboard, setupButtons } from './input.js';
import { setupDebugLayers, setupDebugControls } from './debug.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createPlayer, createPlayerEnvironment } from './player.js';

const SHOW_BUTTON_CONTROLLERS = false;

const DEBUG_MODE = true;

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = createLevelLoader(entityFactory);

  const level = await loadLevel('1-2');

  const mario = createPlayer(entityFactory.mario());
  mario.player.nickname = 'MARIO';
  level.entities.add(mario);

  const playerEnvironment = createPlayerEnvironment(mario);
  level.entities.add(playerEnvironment);

  level.compositor.layers.push(createDashboardLayer(font, level));

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  if (SHOW_BUTTON_CONTROLLERS) {
    setupButtons(mario);
  }

  if (DEBUG_MODE) {
    setupDebugLayers(level);
    setupDebugControls(canvas, mario, level.camera);
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;

    level.update(gameContext);
    level.draw(gameContext);
  };

  timer.start();
}

const canvas = document.getElementById('screen');

const start = () => {
  window.removeEventListener('click', start);

  main(canvas);
};

window.addEventListener('click', start);
