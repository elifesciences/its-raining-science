const gameContainer = document.getElementById('game-container');
const paddle = document.getElementById('paddle');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const gamepads = navigator.gamepads ? navigator.gamepads : null;

let paddleWidth = 100;
let paddleHeight = 20;
let gameContainerWidth = 500;
let gameContainerHeight = 600;
let squareSize = 30;
let squareFallSpeed = 3; // Medium speed
let score = 0;
let isGameOver = false;
let isInputEnabled = false; // Track input state
let controller;

document.addEventListener('mousemove', (e) => {
    if (!isInputEnabled) return; // Disable input when the game is over

    const mouseX = e.clientX - gameContainer.offsetLeft;
    const newPaddleX = Math.max(0, Math.min(gameContainerWidth - paddleWidth, mouseX - paddleWidth / 2));
    paddle.style.left = `${newPaddleX}px`;
});

document.addEventListener('keydown', (e) => {
    if (!isInputEnabled) return; // Disable input when the game is over

    const paddleLeft = parseFloat(paddle.style.left);
    const paddleSpeed = 20; // Speed of paddle movement

    if (e.key === 'a') { // Move left
        const newPaddleX = Math.max(0, paddleLeft - paddleSpeed);
        paddle.style.left = `${newPaddleX}px`;
    } else if (e.key === 'd') { // Move right
        const newPaddleX = Math.min(gameContainerWidth - paddleWidth, paddleLeft + paddleSpeed);
        paddle.style.left = `${newPaddleX}px`;
    }
});

window.addEventListener('gamepadconnected', (event) => {
    console.log('Gamepad connected:', event.gamepad);
    update();
});

window.addEventListener('gamepaddisconnected', (event) => {
    console.log('Gamepad disconnected:', event.gamepad);
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
    isInputEnabled = false; // Disable input
    finalScoreDisplay.textContent = score;
    gameOverDisplay.style.display = 'block';
    restartButton.style.display = 'block'; // Show the restart button
}

// Add event listener for the restart button
restartButton.addEventListener('click', resetGame);

function gameLoop() {
    if (isGameOver) return;
    
    isInputEnabled = true; // Ensable input
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
    isInputEnabled = true; // Enable input
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
