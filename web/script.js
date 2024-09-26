const gameContainer = document.getElementById('game-container');
const paddle = document.getElementById('paddle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let paddleWidth = 100;
let paddleHeight = 20;
let gameContainerWidth = 500;
let gameContainerHeight = 600;
let squareSize = 30;
let squareFallSpeed = 3; // Medium speed
let score = 0;
let isGameOver = false;

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX - gameContainer.offsetLeft;
    const newPaddleX = Math.max(0, Math.min(gameContainerWidth - paddleWidth, mouseX - paddleWidth / 2));
    paddle.style.left = `${newPaddleX}px`;
});

function createFallingSquare() {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.left = `${Math.random() * (gameContainerWidth - squareSize)}px`;
    square.style.top = `0px`;
    gameContainer.appendChild(square);
    return square;
}

function updateSquarePosition(square) {
    let squareTop = parseFloat(square.style.top);
    squareTop += squareFallSpeed;
    square.style.top = `${squareTop}px`;

    const squareLeft = parseFloat(square.style.left);
    const paddleLeft = parseFloat(paddle.style.left);
    const paddleTop = gameContainerHeight - paddleHeight - 10; // Paddle's Y position

    if (squareTop + squareSize >= paddleTop) {
        if (squareLeft + squareSize > paddleLeft && squareLeft < paddleLeft + paddleWidth) {
            // Square hit the paddle
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            square.remove();
        } else if (squareTop + squareSize >= gameContainerHeight) {
            // Game over condition
            gameOver();
        }
    }
}

function gameOver() {
    isGameOver = true;
    finalScoreDisplay.textContent = score;
    gameOverDisplay.style.display = 'block';
    restartButton.style.display = 'block'; // Show the restart button
}

// Add event listener for the restart button
restartButton.addEventListener('click', resetGame);

function gameLoop() {
    if (isGameOver) return;

    // Create new square every 1.5 seconds
    if (Math.random() < 0.01) {
        createFallingSquare();
    }

    // Update all existing squares
    const squares = document.querySelectorAll('.square');
    squares.forEach(updateSquarePosition);

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
    restartButton.style.display = 'none';

    // Remove all squares
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.remove());

    // Restart the game loop
    gameLoop();
}

gameLoop();
