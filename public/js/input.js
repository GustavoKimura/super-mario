import KeyboardState from './KeyboardState.js';

export function setupKeyboard(entity) {
  const input = new KeyboardState();

  const JUMP = 'KeyW';
  const LEFT = 'KeyA';
  const RIGHT = 'KeyD';

  const DIRECTION_INCREASE = 1;
  const DIRECTION_DECREASE = -1;

  input.addMapping(JUMP, (keyState) => {
    if (keyState) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  input.addMapping(LEFT, (keyState) => {
    const directionBalance = keyState ? DIRECTION_DECREASE : DIRECTION_INCREASE;

    entity.go.dir += directionBalance;
  });

  input.addMapping(RIGHT, (keyState) => {
    const directionBalance = keyState ? DIRECTION_INCREASE : DIRECTION_DECREASE;

    entity.go.dir += directionBalance;
  });

  return input;
}
