import { DURATIONS } from '../consts';

export function generateRandomTime(): number {
  const min = Math.ceil(DURATIONS.MIN);
  const max = Math.floor(DURATIONS.MAX) + 1;
  return Math.floor(Math.random() * (max - min) + min) * 1000;
}

export function generateRandomNumbers(): [number, number] {
  return [Math.random(), Math.floor(Math.random() * 6) + 1];
}
