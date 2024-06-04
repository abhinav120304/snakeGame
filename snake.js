const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 20;
const ROWS = 20;
const COLS = 20;
const WINDOW_WIDTH = TILE_SIZE * ROWS;
const WINDOW_HEIGHT = TILE_SIZE * COLS;

class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let snake = new Tile(5 * TILE_SIZE, 5 * TILE_SIZE);  // Snake's head
let food = new Tile(10 * TILE_SIZE, 10 * TILE_SIZE);
let snakeBody = [];  // Snake's body
let velocityX = 0;
let velocityY = 0;
let gameOver = false;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (gameOver) return;

    if (event.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function move() {
    if (gameOver) return;

    // Check for wall collision
    if (snake.x < 0 || snake.x >= WINDOW_WIDTH || snake.y < 0 || snake.y >= WINDOW_HEIGHT) {
        gameOver = true;
        return;
    }

    // Check for self collision
    for (let tile of snakeBody) {
        if (snake.x === tile.x && snake.y === tile.y) {
            gameOver = true;
            return;
        }
    }

    // Check for food collision
    if (snake.x === food.x && snake.y === food.y) {
        snakeBody.push(new Tile(food.x, food.y));
        food.x = Math.floor(Math.random() * COLS) * TILE_SIZE;
        food.y = Math.floor(Math.random() * ROWS) * TILE_SIZE;
    }

    // Update snake body
    if (snakeBody.length) {
        snakeBody.unshift(new Tile(snake.x, snake.y));
        snakeBody.pop();
    }

    // Move snake head
    snake.x += velocityX * TILE_SIZE;
    snake.y += velocityY * TILE_SIZE;
}
const SPEED = 100;

function draw() {
    move();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);

    // Draw snake
    ctx.fillStyle = 'limegreen';
    ctx.fillRect(snake.x, snake.y, TILE_SIZE, TILE_SIZE);
    for (let tile of snakeBody) {
        ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
    }

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    } else {
        setTimeout(() => {
            requestAnimationFrame(draw);
        }, SPEED);
    }
}

// Start the game
draw();
