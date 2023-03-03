import Entity from './Entity.js';
import Player from './traits/Player.js';
import PlayerController from './traits/PlayerController.js';

export function createPlayerEnvironment(playerEntity) {
  const playerEnvironment = new Entity();
  const playerController = new PlayerController();

  playerController.checkpoint.set(64, 64);
  playerController.setPlayer(playerEntity);

  playerEnvironment.addTrait(playerController);

  return playerEnvironment;
}

export function createPlayer(entity) {
  entity.addTrait(new Player());

  return entity;
}

export function* findPlayers(level) {
  for (const entity of level.entities) {
    if (entity.player) {
      yield entity;
    }
  }
}
