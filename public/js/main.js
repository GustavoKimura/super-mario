import Camera from './Camera.js';
import Timer from './Timer.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import { createLevelLoader } from './loaders/level.js';
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

async function main(canvas) {
  const context = canvas.getContext('2d');

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);

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

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.compositor.draw(context, camera);
  };

  timer.start();
}

const canvas = document.getElementById('screen');

main(canvas);
