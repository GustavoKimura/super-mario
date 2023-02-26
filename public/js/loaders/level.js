import Level from '../Level.js';
import { Matrix } from '../math.js';
import { createBackgroundLayer, createSpriteLayer } from '../layers.js';
import { loadJSON, loadSpriteSheet } from '../loaders.js';

export async function loadLevel(name) {
  const levelSpecification = await loadJSON(`./levels/${name}.json`);

  const backgroundSprites = await loadSpriteSheet(
    levelSpecification.spriteSheet
  );

  const level = new Level();

  const mergedTiles = levelSpecification.layers.flatMap(
    (layerSpecification) => layerSpecification.tiles
  );

  const collisionGrid = createCollisionGrid(
    mergedTiles,
    levelSpecification.patterns
  );

  level.setCollisionGrid(collisionGrid);

  levelSpecification.layers.forEach((layer) => {
    const backgroundGrid = createBackgroundGrid(
      layer.tiles,
      levelSpecification.patterns
    );

    const backgroundLayer = createBackgroundLayer(
      level,
      backgroundGrid,
      backgroundSprites
    );

    level.compositor.layers.push(backgroundLayer);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.compositor.layers.push(spriteLayer);

  return level;
}

function createCollisionGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.type });
  }

  return grid;
}

function createBackgroundGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { name: tile.name });
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
    for (const item of expandRange(range)) {
      yield item;
    }
  }
}

function expandTiles(tiles, patterns) {
  const expandedTiles = [];

  function walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;

          walkTiles(tiles, derivedX, derivedY);
        } else {
          expandedTiles.push({ tile, x: derivedX, y: derivedY });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);

  return expandedTiles;
}
