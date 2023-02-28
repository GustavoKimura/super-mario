import { loadJSON } from '../loaders.js';
import AudioBoard from '../AudioBoard.js';

export async function loadAudioBoard(name, audioContext) {
  const audioSheet = await loadJSON(`./sounds/${name}.json`);

  const audioBoard = new AudioBoard(audioContext);

  const fx = audioSheet.fx;
  const loadAudio = createAudioLoader(audioContext);

  Object.keys(fx).forEach(async (name) => {
    const url = fx[name].url;

    const buffer = await loadAudio(url);

    audioBoard.addAudio(name, buffer);
  });

  return audioBoard;
}

export function createAudioLoader(context) {
  return async function loadAudio(url) {
    const response = await fetch(url);

    const arrayBuffer = await response.arrayBuffer();

    return context.decodeAudioData(arrayBuffer);
  };
}
