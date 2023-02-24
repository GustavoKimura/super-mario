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

export function setupKeyboard(mario, keyboardControls) {
  const input = new KeyboardState();

  mapControls(mario, input, keyboardControls);

  return input;
}

export function setupButtons(mario, buttonsControls) {
  const input = new ButtonsState();

  mapControls(mario, input, buttonsControls);

  return input;
}
