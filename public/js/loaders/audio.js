export function createAudioLoader(context) {
  return async function loadAudio(url) {
    const response = await fetch(url);

    const arrayBuffer = await response.arrayBuffer();

    return context.decodeAudioData(arrayBuffer);
  };
}
