import TileResolver from './TileResolver.js';
import { ground } from './tiles/ground.js';
import { brick } from './tiles/brick.js';

const handlers = {
  ground,
  brick,
};

export default class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity) {
    let x;

    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        x,
        x,
        entity.bounds.top,
        entity.bounds.bottom
      );

      matches.forEach((match) => {
        this.handle(0, entity, match);
      });
    }
  }

  checkY(entity) {
    let y;

    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        y,
        y
      );

      matches.forEach((match) => {
        this.handle(1, entity, match);
      });
    }
  }

  handle(index, entity, match) {
    const handler = handlers[match.tile.type];

    if (handler) {
      handler[index](entity, match);
    }
  }
}
