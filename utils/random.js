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

const getRandomColor = (existingColors) => {
  const colors = [
    '#f701e4', // pink
    '#294efd', // blue
    'lime',
    '#d8ff00', // yellow
    '#ff1010', // red
    '#cac2c2', // white
    'cyan',
    'orange'
  ];

  let color = null;
  while(!color || existingColors.includes(color)){
    color = colors[Math.floor(Math.random()*colors.length)];
  }

  return color
}

module.exports = {
  generateRoomCode,
  shuffle,
  getRandomColor,
}