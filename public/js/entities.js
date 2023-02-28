import { loadMario } from './entities/Mario.js';
import { loadGoomba } from './entities/Goomba.js';
import { loadKoopa } from './entities/Koopa.js';

export async function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    return (factory) => (entityFactories[name] = factory);
  }

  await Promise.all([
    loadMario(audioContext).then(addAs('mario')),
    loadGoomba(audioContext).then(addAs('goomba')),
    loadKoopa(audioContext).then(addAs('koopa')),
  ]);

  return entityFactories;
}
