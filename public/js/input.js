import KeyboardState from './KeyboardState.js';
import ButtonsState from './ButtonsState.js';

const DIRECTION_INCREASE = 1;
const DIRECTION_DECREASE = -1;

function goToLeft(mario, keyState) {
  const directionBalance = keyState ? DIRECTION_DECREASE : DIRECTION_INCREASE;

  mario.go.dir += directionBalance;
}

function goToRight(mario, keyState) {
  const directionBalance = keyState ? DIRECTION_INCREASE : DIRECTION_DECREASE;

  mario.go.dir += directionBalance;
}

function controlJump(mario, keyState) {
  if (keyState) {
    mario.jump.start();
  } else {
    mario.jump.cancel();
  }
}

function mapControls(mario, input, controls) {
  const { LEFT, RIGHT, RUN, JUMP } = controls;

  input.addMapping(LEFT, (keyState) => goToLeft(mario, keyState));
  input.addMapping(RIGHT, (keyState) => goToRight(mario, keyState));
  input.addMapping(RUN, (keyState) => mario.turbo(keyState));
  input.addMapping(JUMP, (keyState) => controlJump(mario, keyState));

  return input;
}

export function setupKeyboard(mario) {
  const LEFT_KEY = 'KeyA';
  const RIGHT_KEY = 'KeyD';
  const RUN_KEY = 'KeyZ';
  const JUMP_KEY = 'KeyW';

  const input = new KeyboardState();

  mapControls(mario, input, {
    LEFT: LEFT_KEY,
    RIGHT: RIGHT_KEY,
    RUN: RUN_KEY,
    JUMP: JUMP_KEY,
  });

  input.listenTo(window);
}

export function setupButtons(mario) {
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
