import Level from './Level.js';
import Timer from './Timer.js';
import { createLevelLoader } from './loaders/level.js';
import { loadFont } from './loaders/font.js';
import { loadEntities } from './entities.js';
import { setupKeyboard, setupButtons } from './input.js';
import { setupDebugLayers, setupDebugControls } from './debug.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createPlayerProgressLayer } from './layers/player-progress.js';
import { createColorLayer } from './layers/color.js';
import { createPlayer, createPlayerEnvironment } from './player.js';
import SceneRunner from './SceneRunner.js';
import TimedScene from './TimedScene.js';

const SHOW_BUTTON_CONTROLLERS = false;

const DEBUG_MODE = false;

async function main(canvas) {
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  mario.player.nickname = 'MARIO';

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  if (SHOW_BUTTON_CONTROLLERS) {
    setupButtons(mario);
  }

  async function runLevel(name) {
    const level = await loadLevel(name);

    level.events.listen(
      Level.EVENT_TRIGGER,
      (specification, trigger, touches) => {
        if (specification.type === 'goto') {
          for (const entity of touches) {
            if (entity.player) {
              runLevel(specification.name);

              return;
            }
          }
        }
      }
    );

    if (DEBUG_MODE) {
      setupDebugLayers(level);
      setupDebugControls(canvas, mario, level.camera);
    }

    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgressLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);
    const playerEnvironment = createPlayerEnvironment(mario);
    level.entities.add(playerEnvironment);

    const waitScreen = new TimedScene();
    waitScreen.countDown = 2;
    waitScreen.compositor.layers.push(createColorLayer('#000'));
    waitScreen.compositor.layers.push(dashboardLayer);
    waitScreen.compositor.layers.push(playerProgressLayer);
    sceneRunner.addScene(waitScreen);

    level.compositor.layers.push(dashboardLayer);

    sceneRunner.addScene(level);

    sceneRunner.runNext();
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

    sceneRunner.update(gameContext);
  };

  timer.start();

  runLevel('debug-progression');
}

const canvas = document.getElementById('screen');

const start = () => {
  window.removeEventListener('click', start);

  main(canvas);
};

window.addEventListener('click', start);
