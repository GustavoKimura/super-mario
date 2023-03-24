import { findPlayers } from '../player.js';
import Player from '../traits/Player.js';
import LevelTimer from '../traits/LevelTimer.js';

function getPlayerTrait(level) {
  for (const entity of findPlayers(level.entities)) {
    return entity.traits.get(Player);
  }
}

function getTimerTrait(level) {
  for (const entity of level.entities) {
    if (entity.traits.has(LevelTimer)) {
      return entity.traits.get(LevelTimer);
    }
  }
}

export function createDashboardLayer(font, level) {
  const LINE_1 = font.size;
  const LINE_2 = font.size * 2;

  const timerTrait = getTimerTrait(level);

  return function drawDashboard(context) {
    const playerTrait = getPlayerTrait(level);

    const { nickname, score, coins } = playerTrait;
    const { currentTime } = timerTrait;

    font.print(nickname, context, 16, LINE_1);

    font.print(score.toString().padStart(6, '0'), context, 16, LINE_2);

    font.print(`@x${coins.toString().padStart(2, '0')}`, context, 96, LINE_2);

    font.print('WORLD', context, 152, LINE_1);

    font.print(level.name, context, 160, LINE_2);

    font.print('TIME', context, 208, LINE_1);

    font.print(
      currentTime.toFixed().toString().padStart(3, '0'),
      context,
      216,
      LINE_2
    );
  };
}
