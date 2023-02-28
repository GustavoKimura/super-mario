import Camera from './Camera.js';
import Timer from './Timer.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import { createLevelLoader } from './loaders/level.js';
import { createAudioLoader } from './loaders/audio.js';
import { loadFont } from './loaders/font.js';
import { loadEntities } from './entities.js';
import { setupKeyboard, setupButtons } from './input.js';
import { setupDebugLayers, setupDebugControls } from './debug.js';
import { createDashboardLayer } from './layers/dashboard.js';

const SHOW_BUTTON_CONTROLLERS = false;

const DEBUG_MODE = false;

function createPlayerEnvironment(playerEntity) {
  const playerEnvironment = new Entity();
  const playerController = new PlayerController();

  playerController.checkpoint.set(64, 64);
  playerController.setPlayer(playerEntity);

  playerEnvironment.addTrait(playerController);

  return playerEnvironment;
}

class AudioBoard {
  constructor(context) {
    this.context = context;

    this.buffers = new Map();
  }

  addAudio(name, buffer) {
    this.buffers.set(name, buffer);
  }

  playAudio(name) {
    const source = this.context.createBufferSource();

    source.connect(this.context.destination);
    source.buffer = this.buffers.get(name);

    source.start(0);
  }
}

async function main(canvas) {
  const context = canvas.getContext('2d');

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);

  const audioContext = new AudioContext();
  const audioBoard = new AudioBoard(audioContext);
  const loadAudio = createAudioLoader(audioContext);

  loadAudio('./audio/jump.ogg').then((buffer) => {
    audioBoard.addAudio('jump', buffer);
  });

  const loadLevel = createLevelLoader(entityFactory);

  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();
  const playerEnvironment = createPlayerEnvironment(mario);

  level.entities.add(playerEnvironment);

  setupKeyboard(mario);

  if (SHOW_BUTTON_CONTROLLERS) {
    setupButtons(mario);
  }

  if (DEBUG_MODE) {
    setupDebugLayers(level, camera);
    setupDebugControls(canvas, mario, camera);
  }

  level.compositor.layers.push(createDashboardLayer(font, playerEnvironment));

  const gameContext = {
    audioBoard,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;

    level.update(gameContext);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.compositor.draw(context, camera);
  };

  timer.start();
}

const canvas = document.getElementById('screen');

const start = () => {
  window.removeEventListener('click', start);

  main(canvas);
};

window.addEventListener('click', start);
