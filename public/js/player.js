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

export function makePlayer(entity, nickname) {
  const player = new Player();
  player.nickname = nickname;

  entity.addTrait(player);
}

export function* findPlayers(entities) {
  for (const entity of entities) {
    if (entity.traits.has(Player)) {
      yield entity;
    }
  }
}
