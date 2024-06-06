import { sha3_256 } from 'js-sha3';

export function stringToHash(str: string): string {
  return sha3_256(sha3_256(str));
}

export function cleanStr(str: string): string {
  try {
    return str.trim().toLowerCase();
  } catch {
    return str;
  }
}
