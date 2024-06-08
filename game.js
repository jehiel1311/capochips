const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('continueButton');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');

let player, obstacles, frameCount, gameOver, jumpCount, score;
const playerImage = new Image();
playerImage.src = 'player.png'; // Asegúrate de tener un archivo player.png en el mismo directorio

const obstacleImage = new Image();
obstacleImage.src = 'objeto1.png'; // Asegúrate de tener un archivo objeto1.png en el mismo directorio

const obstacle2Image = new Image();
obstacle2Image.src = 'obstaculo1.png'; // Asegúrate de tener un archivo obstaculo1.png en el mismo directorio

const backgroundImage = new Image();
backgroundImage.src = 'holdem_table.png'; // Asegúrate de tener el archivo con este nombre en el mismo directorio

backgroundImage.onload = () => {
    drawBackground();
    startButton.style.display = 'block';
};

// Initialize game variables
function initGame() {
    player = {
        x: 50,
        y: 300,
        width: 100, // Doble del tamaño original
        height: 100, // Doble del tamaño original
        dy: 0,
        gravity: 0.5,
        jumpPower: -15, // Aumenta la potencia del salto
        grounded: false
    };

    obstacles = [];
    frameCount = 0;
    gameOver = false;
    jumpCount = 0;
    score = 0;
    scoreDisplay.textContent = `Chips: ${score}`;

    startButton.style.display = 'none';
    gameOverScreen.style.display = 'none';

    gameLoop();
}

// Key press events
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && jumpCount < 2) {
        player.dy = player.jumpPower;
        player.grounded = false;
        jumpCount++;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game loop
function gameLoop() {
    if (gameOver) return;

    frameCount++;
    clearCanvas();
    drawBackground();
    drawPlayer();
    updatePlayer();
    handleObstacles();
    requestAnimationFrame(gameLoop);
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw player
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Update player
function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
        jumpCount = 0;
    }
}

// Handle obstacles
function handleObstacles() {
    if (frameCount % 120 === 0) {
        let obstacleHeight = 75; // Altura del obstáculo
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight, // Ajusta la posición del obstáculo
            width: 75, // 50% más grande que el tamaño original
            height: 75, // 50% más grande que el tamaño original
            dx: -3,
            image: obstacleImage
        });
    }

    // Add a second type of obstacle every 300 frames
    if (frameCount % 300 === 0) {
        let obstacleHeight = 100; // Altura del obstáculo
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight, // Ajusta la posición del obstáculo
            width: 100, // Doble del tamaño original
            height: 100, // Doble del tamaño original
            dx: -3,
            image: obstacle2Image
        });
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x += obstacle.dx;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Collision detection and score increment/decrement
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            if (obstacle.image === obstacleImage) {
                score++;
            } else if (obstacle.image === obstacle2Image) {
                score -= 10;
                if (score < 0) {
                    score = 0;
                    gameOver = true;
                    gameOverScreen.style.display = 'flex';
                }
            }
            scoreDisplay.textContent = `Chips: ${score}`;
            obstacles.splice(index, 1);
        }
    });
}

// Start game
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);
