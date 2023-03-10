import { Sides } from '../Entity.js';

function handle({ entity, match, resolver }) {
  if (entity.player) {
    const grid = resolver.matrix;

    grid.delete(match.indexX, match.indexY);
  }
}

export const coin = [handle, handle];
