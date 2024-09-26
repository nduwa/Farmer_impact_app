function generateUUID() {
  function getRandomHexDigit() {
    return Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
  }

  function getRandomHexString(length) {
    return Array.from({ length }, getRandomHexDigit).join("");
  }

  const part1 = getRandomHexString(8);
  const part2 = getRandomHexString(4);
  const part3 = getRandomHexString(4);
  const part4 = getRandomHexString(4);
  const part5 = getRandomHexString(12);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}
export default generateUUID;
