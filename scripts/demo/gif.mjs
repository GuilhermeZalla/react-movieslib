// A small GIF89a writer for browser captures. Clearing the LZW dictionary before
// it reaches 512 entries keeps 9-bit codes valid without external encoders.
const word = (value) => [value & 255, (value >> 8) & 255];
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
  const palette = [];
  for (let index = 0; index < 256; index++)
    palette.push(
      Math.round((((index >> 5) & 7) * 255) / 7),
      Math.round((((index >> 2) & 7) * 255) / 7),
      Math.round(((index & 3) * 255) / 3),
    );
  const chunks = [
    Buffer.from('GIF89a'),
    Buffer.from([...word(width), ...word(height), 0xf7, 0, 0, ...palette]),
    Buffer.from([0x21, 0xff, 11, ...Buffer.from('NETSCAPE2.0'), 3, 1, 0, 0, 0]),
  ];
  for (const frame of frames)
    chunks.push(
      Buffer.from([
        0x21,
        0xf9,
        4,
        4,
        ...word(delay),
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
        ...encode(frame),
      ]),
    );
  chunks.push(Buffer.from([0x3b]));
  return Buffer.concat(chunks);
}
