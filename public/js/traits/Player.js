import { Trait } from '../Entity.js';
import Stomper from '../traits/Stomper.js';

export default class Player extends Trait {
  constructor() {
    super('player');

    this.nickname = 'UNNAMED';
    this.lives = 3;
    this.score = 0;
    this.coins = 0;

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }
}
