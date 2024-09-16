const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = 30; // Tamanho da célula do grid
const rows = canvas.height / grid;
const cols = canvas.width / grid;

const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
];

const colors = [
    'cyan', // I
    'yellow', // O
    'green', // S
    'red', // Z
    'purple', // T
    'orange', // L
    'blue' // J
];

let board = Array.from({ length: rows }, () => Array(cols).fill(0));
let score = 0;
let level = 1;
let intervalTime = 1000; // Tempo de intervalo inicial (milissegundos)
let gameInterval;
let isPaused = false;

let currentPiece = null; // Inicialmente sem peça

function createPiece() {
    const index = Math.floor(Math.random() * tetrominoes.length);
    return {
        shape: tetrominoes[index],
        color: colors[index],
        x: Math.floor(cols / 2) - 1,
        y: 0
    };
}

function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * grid, y * grid, grid, grid);
    context.strokeStyle = 'black';
    context.strokeRect(x * grid, y * grid, grid, grid);
}

function drawBoard() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (board[y][x]) {
                drawSquare(x, y, 'gray');
            }
        }
    }
}

function drawPiece() {
    if (currentPiece) {
        const { shape, x, y, color } = currentPiece;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    drawSquare(x + col, y + row, color);
                }
            }
        }
    }
}

function drawScore() {
    document.getElementById('current-score').textContent = 'Pontuação: ' + score;
    document.getElementById('level').textContent = 'Nível: ' + level;
    updateTopScores();
}

function movePiece(dx, dy) {
    if (currentPiece) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        if (collides()) {
            currentPiece.x -= dx;
            currentPiece.y -= dy;
            if (dy > 0) {
                fixPiece();
            }
        }
        draw();
    }
}

function rotatePiece() {
    if (currentPiece) {
        const { shape } = currentPiece;
        const rotatedShape = shape[0].map((_, i) => shape.map(row => row[i])).reverse();
        const originalShape = currentPiece.shape; // Salva a forma original

        currentPiece.shape = rotatedShape;

        if (collides()) {
            currentPiece.shape = originalShape; // Reverte a rotação se colidir
        }

        draw(); // Atualiza o desenho imediatamente após a rotação
    }
}

function collides() {
    if (currentPiece) {
        const { shape, x, y } = currentPiece;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    let boardX = x + col;
                    let boardY = y + row;
                    if (boardX < 0 || boardX >= cols || boardY >= rows || board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function removeCompleteLines() {
    let linesRemoved = 0;
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row].every(cell => cell)) {
            board.splice(row, 1);
            board.unshift(Array(cols).fill(0));
            linesRemoved++;
            row++;
        }
    }
    if (linesRemoved > 0) {
        updateScore(linesRemoved * 100); // 100 pontos por linha
        increaseLevel(); // Atualiza o nível após remover linhas
    }
}

function updateScore(points) {
    score += points;
}

function increaseLevel() {
    if (score >= level * 1000) { // Aumenta o nível a cada 1000 pontos
        level++;
        intervalTime = Math.max(200, intervalTime - 100); // Aumenta a velocidade, minimizando o intervalo
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, intervalTime);
    }
}

function fixPiece() {
    if (currentPiece) {
        const { shape, x, y } = currentPiece;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    board[y + row][x + col] = 1;
                }
            }
        }
        removeCompleteLines();
        currentPiece = createPiece();
        if (collides()) {
            gameOver();
        }
    }
}

function gameOver() {
    saveScore();
    alert('Game Over!');
    resetGame();
}

function resetGame() {
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    score = 0;
    level = 1;
    intervalTime = 1000;
    clearInterval(gameInterval);
    gameInterval = null;
    currentPiece = null; // Remove a peça atual
    draw(); // Limpa o canvas
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas
    drawBoard();
    drawPiece();
    drawScore();
}

function gameLoop() {
    if (!isPaused) {
        movePiece(0, 1);
        draw();
    }
}

function startGame() {
    if (!gameInterval) {
        currentPiece = createPiece(); // Cria uma nova peça quando o jogo começa
        gameInterval = setInterval(gameLoop, intervalTime);
    }
}

function pauseGame() {
    clearInterval(gameInterval);
    gameInterval = null;
}

function restartGame() {
    resetGame();
    // Não inicia o jogo automaticamente, o jogador deve clicar no botão "Iniciar"
}

function updateTopScores() {
    const topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    topScores.sort((a, b) => b - a);
    const topScoresList = document.getElementById('top-scores');
    topScoresList.innerHTML = '';
    topScores.slice(0, 10).forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        topScoresList.appendChild(li);
    });
}

function saveScore() {
    const topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    topScores.push(score);
    topScores.sort((a, b) => b - a);
    localStorage.setItem('topScores', JSON.stringify(topScores));
    updateTopScores();
}

// Adicionar eventos aos botões
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('pause').addEventListener('click', pauseGame);
document.getElementById('restart').addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (isPaused) return;
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            movePiece(0, 1);
            break;
        case ' ':
            rotatePiece();
            break;
    }
});

// Carregar os 10 maiores scores ao iniciar
updateTopScores();
