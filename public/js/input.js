import KeyboardState from './KeyboardState.js';

export function setupKeyboard(mario) {
  const input = new KeyboardState();

  const JUMP = 'KeyW';
  const RUN = 'KeyZ';
  const LEFT = 'KeyA';
  const RIGHT = 'KeyD';

  const DIRECTION_INCREASE = 1;
  const DIRECTION_DECREASE = -1;

  input.addMapping(JUMP, (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.addMapping(RUN, (keyState) => {
    mario.turbo(keyState);
  });

  input.addMapping(LEFT, (keyState) => {
    const directionBalance = keyState ? DIRECTION_DECREASE : DIRECTION_INCREASE;

    mario.go.dir += directionBalance;
  });

  input.addMapping(RIGHT, (keyState) => {
    const directionBalance = keyState ? DIRECTION_INCREASE : DIRECTION_DECREASE;

    mario.go.dir += directionBalance;
  });

  return input;
}
