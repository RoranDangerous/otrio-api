const generateRoomCode = () => {
  let code = '';

  for(let i = 0; i < 4; i++) {
    code += String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }

  return code
};

const shuffle = (arr) => {
  let currentIndex = arr.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }

  return arr;
}

module.exports = {
  generateRoomCode,
  shuffle,
}