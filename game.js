const apiUrl = 'https://prog2700.onrender.com/threeinarow/random';
let puzzleData = [];

async function fetchPuzzleData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    puzzleData = await response.json();
  } catch (error) {
    console.error('Error fetching puzzle data:', error);
  }
}
function createGrid() {
  const gameDiv = document.getElementById('theGame');
  const table = document.createElement('table');
  console.log(puzzleData.rows.length)
  const gridSize = puzzleData.rows.length

  for (let i = 0; i < gridSize; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('td');
      const currentState = puzzleData.rows[i][j].currentState;
      const canToggle = puzzleData.rows[i][j].canToggle;
      cell.dataset.state = currentState;
      updateCellAppearance(cell, currentState);

      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      if (canToggle) {
        cell.addEventListener('click', handleCellClick);
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  gameDiv.appendChild(table);
}

function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  //check if the cell is togglable
  const canToggle = puzzleData.rows[row][col].canToggle;

  if (canToggle) {
    const currentState = parseInt(cell.dataset.state);
    const nextState = (currentState + 1) % 3; // Cycling through states

    cell.dataset.state = nextState;
    updateCellAppearance(cell, nextState); // Update cell appearance based on the new state
  }
}

function checkPuzzleStatus() {
  const cells = document.querySelectorAll('.cell');

  for (let i = 0; i < cells.length; i++) {
    const row = parseInt(cells[i].dataset.row);
    const col = parseInt(cells[i].dataset.col);
    const currentState = parseInt(cells[i].dataset.state);
    const correctState = puzzleData.rows[row][col].correctState;

    if (currentState !== correctState) {
      return 'Something is wrong” (one or more of the colored squares is incorrectly assigned)'
    }
  }

  return 'You did it!!” (all squares are correct and the puzzle has been completely filled in)';
}


async function startGame() {
  await fetchPuzzleData();
  createGrid();
  const gameDiv = document.getElementById('theGame'); // Obtener el contenedor del juego
  // Crear botón de verificación del rompecabezas
  const checkButton = document.createElement('button');
  checkButton.textContent = 'Check Puzzle';
  checkButton.addEventListener('click', () => {
    const status = checkPuzzleStatus();
    alert(status);
  });
  gameDiv.appendChild(checkButton);
  const showIncorrectCheckbox = document.createElement('input');
  showIncorrectCheckbox.type = 'checkbox';
  showIncorrectCheckbox.id = 'showIncorrect';
  showIncorrectCheckbox.addEventListener('change', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const currentState = parseInt(cell.dataset.state);
      const correctState = puzzleData.rows[row][col].correctState;

      if (currentState !== correctState) {
        if (showIncorrectCheckbox.checked) {
          // Mostrar el signo de exclamación en la celda incorrecta
          if (!cell.classList.contains('incorrect')) {
            cell.classList.add('incorrect');
            const exclamation = document.createElement('span');
            exclamation.textContent = '!';
            exclamation.classList.add('exclamation');
            cell.appendChild(exclamation);
          }
        } else {
          // Si se desactiva "Show Incorrect Squares", eliminar el signo de exclamación si existe
          cell.classList.remove('incorrect');
          const exclamation = cell.querySelector('.exclamation');
          if (exclamation) {
            cell.removeChild(exclamation);
          }
        }
      } else {
        // Si la celda es correcta y se desactiva "Show Incorrect Squares", eliminar el signo de exclamación si existe
        cell.classList.remove('incorrect');
        const exclamation = cell.querySelector('.exclamation');
        if (exclamation) {
          cell.removeChild(exclamation);
        }
      }
    });
  });

  const showIncorrectLabel = document.createElement('label');
  showIncorrectLabel.htmlFor = 'showIncorrect';
  showIncorrectLabel.textContent = 'Show Incorrect Squares';

  gameDiv.appendChild(showIncorrectCheckbox);
  gameDiv.appendChild(showIncorrectLabel);
}
function updateCellAppearance(cell, state) {
  if (state === 0) {
    cell.style.backgroundColor = 'gray'; // Empty state
  } else if (state === 1) {
    cell.style.backgroundColor = 'blue'; // State 1
  } else if (state === 2) {
    cell.style.backgroundColor = 'white'; // State 2
  }
}
startGame();