import { randomInt } from "node:crypto";

// Unambiguous alphabet (no 0/O, 1/I/L) so references are easy to read aloud.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function makeRef(prefix: string) {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${s}`;
}
