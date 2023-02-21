export function createAnimation(frames, frameLength) {
  return function resolveFrame(distance) {
    const frameIndex = Math.floor(distance / frameLength) % frames.length;

    const frameName = frames[frameIndex];

    return frameName;
  };
}
