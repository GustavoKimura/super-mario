import { loadJSON } from '../loaders.js';
import MusicPlayer from '../MusicPlayer.js';

export async function loadMusicSheet(name) {
  const musicSheet = await loadJSON(`./music/${name}.json`);

  const musicPlayer = new MusicPlayer();

  for (const [name, track] of Object.entries(musicSheet)) {
    musicPlayer.addTrack(name, track.url);
  }

  return musicPlayer;
}
