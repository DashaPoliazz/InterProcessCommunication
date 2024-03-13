function generateRandomArray(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 101));
}

function generateArrayOfArrays(numArrays, arrayLength) {
  return Array.from({ length: numArrays }, () =>
    generateRandomArray(arrayLength)
  );
}

module.exports = {
  generateRandomArray,
  generateArrayOfArrays,
};
