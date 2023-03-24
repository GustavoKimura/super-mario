import Level from '../Level.js';
import Entity from '../Entity.js';
import LevelTimer from '../traits/LevelTimer.js';
import { Matrix } from '../math.js';
import { createSpriteLayer } from '../layers/sprites.js';
import { createBackgroundLayer } from '../layers/background.js';
import { loadJSON } from '../loaders.js';
import { loadMusicSheet } from './music.js';
import { loadSpriteSheet } from './sprite.js';

async function loadPattern(name) {
  return await loadJSON(`./sprites/patterns/${name}.json`);
}

function setupBackgrounds(
  levelSpecification,
  level,
  backgroundSprites,
  patterns
) {
  levelSpecification.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);

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

function setupBehavior(level) {
  const timer = new Entity();

  timer.addTrait(new LevelTimer());

  level.entities.add(timer);

  level.events.listen(LevelTimer.EVENT_TIMER_OK, () =>
    level.musicController.playTheme()
  );

  level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () =>
    level.musicController.playHurryTheme()
  );
}

function setupLevel(
  levelSpecification,
  backgroundSprites,
  entityFactory,
  musicPlayer,
  patterns
) {
  const level = new Level();

  setupBackgrounds(levelSpecification, level, backgroundSprites, patterns);
  setupEntities(levelSpecification, level, entityFactory);
  setupMusic(level, musicPlayer);
  setupBehavior(level);

  return level;
}

export function createLevelLoader(entityFactory) {
  return async function loadLevel(name) {
    const levelSpecification = await loadJSON(`./levels/${name}.json`);

    const backgroundSprites = await loadSpriteSheet(
      levelSpecification.spriteSheet
    );

    const musicPlayer = await loadMusicSheet(levelSpecification.musicSheet);

    const patterns = await loadPattern(levelSpecification.patternSheet);

    const level = setupLevel(
      levelSpecification,
      backgroundSprites,
      entityFactory,
      musicPlayer,
      patterns
    );

    level.name = name;

    return level;
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
