import Level from '../Level.js';
import { Matrix } from '../math.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { createBackgroundLayer } from '../layers/background.js';
import { loadJSON } from '../loaders.js';
import { loadMusicSheet } from './music.js';
import { loadSpriteSheet } from './sprite.js';

function setupBackgrounds(levelSpecification, level, backgroundSprites) {
  levelSpecification.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, levelSpecification.patterns);

    const backgroundLayer = createBackgroundLayer(
      level,
      grid,
      backgroundSprites
    );

    level.compositor.layers.push(backgroundLayer);
    level.tileCollider.addGrid(grid);
  });
}

function setupEntities(levelSpecification, level, entityFactory) {
  levelSpecification.entities.forEach(({ name, pos: [x, y] }) => {
    const createEntity = entityFactory[name];

    const entity = createEntity();
    entity.pos.set(x, y);

    level.entities.add(entity);
  });

  const spriteLayer = createSpriteLayer(level.entities);

  level.compositor.layers.push(spriteLayer);
}

function setupMusic(level, musicPlayer) {
  level.musicController.setPlayer(musicPlayer);
}

function setupLevel(
  levelSpecification,
  backgroundSprites,
  entityFactory,
  musicPlayer
) {
  const level = new Level();

  setupBackgrounds(levelSpecification, level, backgroundSprites);
  setupEntities(levelSpecification, level, entityFactory);
  setupMusic(level, musicPlayer);

  return level;
}

export function createLevelLoader(entityFactory) {
  return async function loadLevel(name) {
    const levelSpecification = await loadJSON(`./levels/${name}.json`);

    const backgroundSprites = await loadSpriteSheet(
      levelSpecification.spriteSheet
    );

    const musicPlayer = await loadMusicSheet(levelSpecification.musicSheet);

    return setupLevel(
      levelSpecification,
      backgroundSprites,
      entityFactory,
      musicPlayer
    );
  };
}

function createGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }

  return grid;
}

function* expandSpan(xStart, xLength, yStart, yLength) {
  const xEnd = xStart + xLength;
  const yEnd = yStart + yLength;

  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      yield { x, y };
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [xStart, xLength, yStart, yLength] = range;

    return expandSpan(xStart, xLength, yStart, yLength);
  } else if (range.length === 3) {
    const [xStart, xLength, yStart] = range;

    return expandSpan(xStart, xLength, yStart, 1);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;

    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles, patterns) {
  function* walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;

          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield { tile, x: derivedX, y: derivedY };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}
