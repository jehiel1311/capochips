const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('continueButton');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');

let player, obstacles, frameCount, gameOver, jumpCount, score;
let speed = 3;
const playerImage = new Image();
playerImage.src = 'player.png'; // Asegúrate de tener un archivo player.png en el mismo directorio

const player2Image = new Image();
player2Image.src = 'player2.png'; // Asegúrate de tener un archivo player2.png en el mismo directorio

const obstacleImage = new Image();
obstacleImage.src = 'objeto1.png'; // Asegúrate de tener un archivo objeto1.png en el mismo directorio

const obstacle2Image = new Image();
obstacle2Image.src = 'obstaculo1.png'; // Asegúrate de tener un archivo obstaculo1.png en el mismo directorio

const obstacle3Image = new Image();
obstacle3Image.src = 'obstaculo2.png'; // Asegúrate de tener un archivo obstaculo2.png en el mismo directorio

const backgroundImage = new Image();
backgroundImage.src = 'holdem_table.png'; // Asegúrate de tener el archivo con este nombre en el mismo directorio

backgroundImage.onload = () => {
    drawBackground();
    startButton.style.display = 'block';
    resizeCanvas();
};

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    const aspectRatio = 2; // Ancho/Alto del canvas (800/400)
    const width = window.innerWidth > 800 ? 800 : window.innerWidth;
    const height = width / aspectRatio;
    canvas.width = width;
    canvas.height = height;
    if (!gameOver) {
        drawBackground();
        drawPlayer();
    }
}

// Initialize game variables
function initGame() {
    player = {
        x: 50,
        y: canvas.height - 150,
        width: 100,
        height: 100,
        dy: 0,
        gravity: 0.5,
        jumpPower: -15,
        grounded: false,
        currentImage: playerImage
    };

    obstacles = [];
    frameCount = 0;
    gameOver = false;
    jumpCount = 0;
    score = 0;
    speed = 3;
    scoreDisplay.textContent = `Chips: ${score}`;

    startButton.style.display = 'none';
    gameOverScreen.style.display = 'none';

    gameLoop();
}

// Key press and touch events
let keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && jumpCount < 2) {
        player.dy = player.jumpPower;
        player.grounded = false;
        jumpCount++;
    }
    if (e.code === 'ArrowRight') {
        speed = 5; // Incrementa la velocidad al presionar la flecha derecha
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if (e.code === 'ArrowRight') {
        speed = 3; // Vuelve a la velocidad normal al soltar la flecha derecha
    }
});

canvas.addEventListener('touchstart', () => {
    if (jumpCount < 2) {
        player.dy = player.jumpPower;
        player.grounded = false;
        jumpCount++;
    }
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
    ctx.drawImage(player.currentImage, player.x, player.y, player.width, player.height);
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
        let obstacleHeight = 75 ; // Altura del obstáculo
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight, // Ajusta la posición del obstáculo
            width: 75,
            height: 75,
            dx: -speed,
            image: obstacleImage,
            type: 'normal'
        });
    }

    // Add a second type of obstacle every 300 frames
    if (frameCount % 300 === 0) {
        let obstacleHeight = 125; // Altura del obstáculo
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight, // Ajusta la posición del obstáculo
            width: 125, // Mismo tamaño que obstáculo original
            height: 125, // Mismo tamaño que obstáculo original
            dx: -speed,
            image: obstacle2Image,
            type: 'bad'
        });
    }

    // Add a third type of obstacle every 500 frames
    if (frameCount % 500 === 0) {
        let obstacleHeight = 125; // Altura del obstáculo
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight, // Ajusta la posición del obstáculo
            width: 125, // Mismo tamaño que obstáculo original
            height: 125, // Mismo tamaño que obstáculo original
            dx: -speed,
            image: obstacle3Image,
            type: 'good'
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
            if (obstacle.type === 'normal') {
                score++;
            } else if (obstacle.type === 'bad') {
                score -= 10;
                player.currentImage = playerImage;
                if (score < 0) {
                    score = 0;
                    gameOver = true;
                    gameOverScreen.style.display = 'flex';
                }
            } else if (obstacle.type === 'good') {
                score += 10;
                player.currentImage = player2Image;
            }
            scoreDisplay.textContent = `Chips: ${score}`;
            obstacles.splice(index, 1);
        }
    });
}

// Start game
startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);
