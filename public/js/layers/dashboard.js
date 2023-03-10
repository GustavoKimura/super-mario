import { findPlayers } from '../player.js';

function getPlayerTrait(level) {
  for (const entity of findPlayers(level)) {
    return entity.player;
  }
}

function getTimerTrait(level) {
  for (const entity of level.entities) {
    const { levelTimer } = entity;

    if (levelTimer) {
      return levelTimer;
    }
  }
}

export function createDashboardLayer(font, level) {
  const LINE_1 = font.size;
  const LINE_2 = font.size * 2;

  const playerTrait = getPlayerTrait(level);
  const timerTrait = getTimerTrait(level);

  return function drawDashboard(context) {
    const { nickname, score, lives, coins } = playerTrait;
    const { currentTime } = timerTrait;

    font.print(nickname, context, 16, LINE_1);

    font.print(score.toString().padStart(6, '0'), context, 16, LINE_2);

    font.print(`+${lives.toString().padStart(2, '0')}`, context, 96, LINE_1);
    font.print(`@x${coins.toString().padStart(2, '0')}`, context, 96, LINE_2);

    font.print('WORLD', context, 152, LINE_1);

    font.print('1-1', context, 160, LINE_2);

    font.print('TIME', context, 208, LINE_1);

    font.print(
      currentTime.toFixed().toString().padStart(3, '0'),
      context,
      216,
      LINE_2
    );
  };
}
