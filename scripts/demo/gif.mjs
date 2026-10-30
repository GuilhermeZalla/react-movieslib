// A small GIF89a writer for browser captures. Clearing the LZW dictionary before
// it reaches 512 entries keeps 9-bit codes valid without external encoders.
const word = (value) => [value & 255, (value >> 8) & 255];
// Preserve photographic posters with a shared adaptive palette instead of RGB332.
function photographPalette(frames) {
  const histogram = new Map();
  for (const pixels of frames) {
    for (let offset = 0; offset < pixels.length; offset += 16) {
      const r = pixels[offset],
        g = pixels[offset + 1],
        b = pixels[offset + 2];
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      const bin = histogram.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
      bin.count++;
      bin.r += r;
      bin.g += g;
      bin.b += b;
      histogram.set(key, bin);
    }
  }
  const box = (colors) => {
    const count = colors.reduce((total, color) => total + color.count, 0);
    const ranges = ['r', 'g', 'b'].map((channel) => {
      const values = colors.map((color) => color[channel] / color.count);
      return { channel, range: Math.max(...values) - Math.min(...values) };
    });
    const widest = ranges.sort((a, b) => b.range - a.range)[0];
    return {
      colors,
      count,
      channel: widest.channel,
      score: widest.range * Math.sqrt(count),
    };
  };
  const boxes = [box([...histogram.values()])];
  while (boxes.length < 256) {
    boxes.sort((a, b) => b.score - a.score);
    const index = boxes.findIndex((candidate) => candidate.colors.length > 1);
    if (index < 0) break;
    const [current] = boxes.splice(index, 1);
    const channel = current.channel;
    current.colors.sort((a, b) => a[channel] / a.count - b[channel] / b.count);
    let weight = 0,
      split = 1;
    for (; split < current.colors.length; split++) {
      weight += current.colors[split - 1].count;
      if (weight >= current.count / 2) break;
    }
    split = Math.min(split, current.colors.length - 1);
    boxes.push(
      box(current.colors.slice(0, split)),
      box(current.colors.slice(split)),
    );
  }
  const palette = boxes.flatMap((current) =>
    ['r', 'g', 'b'].map((channel) =>
      Math.round(
        current.colors.reduce((sum, color) => sum + color[channel], 0) /
          current.count,
      ),
    ),
  );
  while (palette.length < 768) palette.push(0);
  const lookup = new Uint8Array(32768);
  for (let key = 0; key < lookup.length; key++) {
    const r = ((key >> 10) & 31) * 8 + 4;
    const g = ((key >> 5) & 31) * 8 + 4;
    const b = (key & 31) * 8 + 4;
    let best = Infinity;
    for (let color = 0; color < boxes.length; color++) {
      const distance =
        3 * (r - palette[color * 3]) ** 2 +
        6 * (g - palette[color * 3 + 1]) ** 2 +
        (b - palette[color * 3 + 2]) ** 2;
      if (distance < best) {
        best = distance;
        lookup[key] = color;
      }
    }
  }
  return { palette, lookup };
}
function encode(pixels) {
  const bytes = [];
  let bits = 0,
    value = 0;
  const emit = (code) => {
    value |= code << bits;
    bits += 9;
    while (bits >= 8) {
      bytes.push(value & 255);
      value >>>= 8;
      bits -= 8;
    }
  };
  let dictionary = new Map(),
    next = 258,
    prefix = pixels[0];
  emit(256);
  for (let index = 1; index < pixels.length; index++) {
    const color = pixels[index],
      key = prefix * 256 + color,
      found = dictionary.get(key);
    if (found !== undefined) {
      prefix = found;
      continue;
    }
    emit(prefix);
    dictionary.set(key, next++);
    prefix = color;
    if (next === 510) {
      emit(256);
      dictionary = new Map();
      next = 258;
    }
  }
  emit(prefix);
  emit(257);
  if (bits) bytes.push(value & 255);
  const blocks = [];
  for (let index = 0; index < bytes.length; index += 255) {
    const part = bytes.slice(index, index + 255);
    blocks.push(part.length, ...part);
  }
  blocks.push(0);
  return blocks;
}
export function gif(width, height, frames, delay = 180) {
  if (
    !frames.length ||
    frames.some((frame) => frame.length !== width * height * 4)
  )
    throw new Error('GIF frames must be complete RGBA browser captures.');
  const { palette, lookup } = photographPalette(frames);
  const chunks = [
    Buffer.from('GIF89a'),
    Buffer.from([...word(width), ...word(height), 0xf7, 0, 0, ...palette]),
    Buffer.from([0x21, 0xff, 11, ...Buffer.from('NETSCAPE2.0'), 3, 1, 0, 0, 0]),
  ];
  for (const [frameIndex, frame] of frames.entries()) {
    const indexed = new Uint8Array(width * height);
    for (let pixel = 0; pixel < indexed.length; pixel++) {
      const offset = pixel * 4;
      indexed[pixel] =
        lookup[
          ((frame[offset] >> 3) << 10) |
            ((frame[offset + 1] >> 3) << 5) |
            (frame[offset + 2] >> 3)
        ];
    }
    chunks.push(
      Buffer.from([
        0x21,
        0xf9,
        4,
        4,
        ...word(Array.isArray(delay) ? delay[frameIndex] : delay),
        0,
        0,
        0x2c,
        0,
        0,
        0,
        0,
        ...word(width),
        ...word(height),
        0,
        8,
        ...encode(indexed),
      ]),
    );
  }
  chunks.push(Buffer.from([0x3b]));
  return Buffer.concat(chunks);
}
