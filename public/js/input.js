import KeyboardState from './KeyboardState.js';
import ButtonsState from './ButtonsState.js';
import InputRouter from './InputRouter.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';

const DIRECTION_INCREASE = 1;
const DIRECTION_DECREASE = -1;

function goToLeft(router, keyState) {
  const directionBalance = keyState ? DIRECTION_DECREASE : DIRECTION_INCREASE;

  router.route((entity) => (entity.traits.get(Go).dir += directionBalance));
}

function goToRight(router, keyState) {
  const directionBalance = keyState ? DIRECTION_INCREASE : DIRECTION_DECREASE;

  router.route((entity) => (entity.traits.get(Go).dir += directionBalance));
}

function controlJump(router, keyState) {
  if (keyState) {
    router.route((entity) => entity.traits.get(Jump).start());
  } else {
    router.route((entity) => entity.traits.get(Jump).cancel());
  }
}

function mapControls(router, input, controls) {
  const { LEFT, RIGHT, RUN, JUMP } = controls;

  input.addMapping(LEFT, (keyState) => goToLeft(router, keyState));
  input.addMapping(RIGHT, (keyState) => goToRight(router, keyState));

  input.addMapping(RUN, (keyState) =>
    router.route((entity) => entity.turbo(keyState))
  );

  input.addMapping(JUMP, (keyState) => controlJump(router, keyState));

  return input;
}

export function setupKeyboard(window) {
  const LEFT_KEY = 'KeyA';
  const RIGHT_KEY = 'KeyD';
  const RUN_KEY = 'KeyZ';
  const JUMP_KEY = 'KeyW';

  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  mapControls(router, input, {
    LEFT: LEFT_KEY,
    RIGHT: RIGHT_KEY,
    RUN: RUN_KEY,
    JUMP: JUMP_KEY,
  });

  return router;
}

export function setupButtons(mario) {
  const buttons = document.getElementById('buttons');
  buttons.style.display = 'flex';

  const leftButton = document.getElementById('left');
  const rightButton = document.getElementById('right');
  const runButton = document.getElementById('run');
  const jumpButton = document.getElementById('jump');

  const { id: LEFT_BUTTON } = leftButton;
  const { id: RIGHT_BUTTON } = rightButton;
  const { id: RUN_BUTTON } = runButton;
  const { id: JUMP_BUTTON } = jumpButton;

  const input = new ButtonsState();

  mapControls(mario, input, {
    LEFT: LEFT_BUTTON,
    RIGHT: RIGHT_BUTTON,
    RUN: RUN_BUTTON,
    JUMP: JUMP_BUTTON,
  });

  input.listenTo(leftButton, rightButton, runButton, jumpButton);
}
