const COLORS = [
  { name: 'ROJO', value: '#ef4444' },
  { name: 'AZUL', value: '#3b82f6' },
  { name: 'VERDE', value: '#22c55e' },
  { name: 'AMARILLO', value: '#facc15' },
  { name: 'MORADO', value: '#a855f7' },
  { name: 'NARANJA', value: '#f97316' }
];

const board1 = document.getElementById('board1');
const board2 = document.getElementById('board2');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const timeEl = document.getElementById('time');
const targetColorEl = document.getElementById('targetColor');
const resultEl = document.getElementById('result');
const startBtn = document.getElementById('startBtn');
const modeSelect = document.getElementById('mode');

const state = {
  score1: 0,
  score2: 0,
  target: COLORS[0],
  seconds: 45,
  running: false,
  roundTimer: null,
  colorTimer: null,
  freeze1: false,
  freeze2: false
};

function createBoard(boardEl, playerNumber) {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i += 1) {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.dataset.player = String(playerNumber);
    tile.addEventListener('click', () => tapTile(tile, playerNumber));
    boardEl.appendChild(tile);
  }
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function paintBoard(boardEl) {
  [...boardEl.children].forEach((tile) => {
    tile.dataset.color = randomColor().name;
    tile.style.background = COLORS.find((c) => c.name === tile.dataset.color).value;
  });
}

function refreshBoards() {
  paintBoard(board1);
  paintBoard(board2);
}

function updateScore() {
  score1El.textContent = state.score1;
  score2El.textContent = state.score2;
}

function setTargetColor() {
  state.target = randomColor();
  targetColorEl.textContent = state.target.name;
  targetColorEl.style.color = state.target.value;
}

function freezePlayer(playerNumber) {
  if (playerNumber === 1) state.freeze1 = true;
  if (playerNumber === 2) state.freeze2 = true;
  setTimeout(() => {
    if (playerNumber === 1) state.freeze1 = false;
    if (playerNumber === 2) state.freeze2 = false;
  }, 1000);
}

function tapTile(tile, playerNumber) {
  if (!state.running) return;
  if (playerNumber === 1 && state.freeze1) return;
  if (playerNumber === 2 && state.freeze2) return;

  const selectedColor = tile.dataset.color;
  const isCorrect = selectedColor === state.target.name;
  const mode = modeSelect.value;

  if (playerNumber === 1) {
    if (isCorrect) state.score1 += 1;
    else {
      if (mode === 'kids') state.score1 = Math.max(0, state.score1 - 0);
      else state.score1 -= 1;
      if (mode !== 'kids') freezePlayer(1);
    }
  }

  if (playerNumber === 2) {
    if (isCorrect) state.score2 += 1;
    else {
      if (mode === 'kids') state.score2 = Math.max(0, state.score2 - 0);
      else state.score2 -= 1;
      if (mode !== 'kids') freezePlayer(2);
    }
  }

  updateScore();
  refreshBoards();
}

function applyModeStyle() {
  document.body.classList.toggle('mode-senior', modeSelect.value === 'senior');
}

function stopGame() {
  state.running = false;
  clearInterval(state.roundTimer);
  clearInterval(state.colorTimer);

  let message = '¡Empate!';
  if (state.score1 > state.score2) message = '🏆 Gana Jugador 1';
  if (state.score2 > state.score1) message = '🏆 Gana Jugador 2';

  resultEl.hidden = false;
  resultEl.className = 'panel result';
  resultEl.textContent = `${message} • ${state.score1} - ${state.score2}`;
  startBtn.disabled = false;
}

function startGame() {
  applyModeStyle();
  state.score1 = 0;
  state.score2 = 0;
  state.seconds = 45;
  state.running = true;
  state.freeze1 = false;
  state.freeze2 = false;
  resultEl.hidden = true;
  startBtn.disabled = true;

  updateScore();
  timeEl.textContent = String(state.seconds);
  refreshBoards();
  setTargetColor();

  const speed = modeSelect.value === 'kids' ? 1500 : 900;

  state.colorTimer = setInterval(() => {
    setTargetColor();
    refreshBoards();
  }, speed);

  state.roundTimer = setInterval(() => {
    state.seconds -= 1;
    timeEl.textContent = String(state.seconds);
    if (state.seconds <= 0) stopGame();
  }, 1000);
}

createBoard(board1, 1);
createBoard(board2, 2);
refreshBoards();
modeSelect.addEventListener('change', applyModeStyle);
startBtn.addEventListener('click', startGame);
