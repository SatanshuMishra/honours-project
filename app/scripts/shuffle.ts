export default function shuffle(array: any[]) {
  let idx = array.length,
    randomIndex;
  while (idx > 0) {
    randomIndex = Math.floor(Math.random() * idx);
    idx--;

    [array[idx], array[randomIndex]] = [array[randomIndex], array[idx]];
  }
  return array;
}
