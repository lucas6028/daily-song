export default function shuffleArray<T>(array: T[]): T[] {
  return array.slice().sort(() => Math.random() - 0.5);
}
