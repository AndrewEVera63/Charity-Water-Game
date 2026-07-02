const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

/* PERFECTLY CENTERED LANES */
const gameWidth = gameArea.offsetWidth;
const laneWidth = gameWidth / 3;

const playerWidth = 120;
const objectWidth = 80;

const playerLanes = [
    laneWidth * 0 + (laneWidth - playerWidth) / 2,
    laneWidth * 1 + (laneWidth - playerWidth) / 2,
    laneWidth * 2 + (laneWidth - playerWidth) / 2
];

const objectLanes = [
    laneWidth * 0 + (laneWidth - objectWidth) / 2,
    laneWidth * 1 + (laneWidth - objectWidth) / 2,
    laneWidth * 2 + (laneWidth - objectWidth) / 2
];


const collectSound = document.getElementById("collectSound");
const hitSound = document.getElementById("hitSound");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let currentLane = 1;

let score = 0;
let lives = 3;

let objectSpeed = 6;
let spawnRate = 800;

let winScore = 500;

let gameRunning = false;

let objectSpawner;
let gameLoop;

player.style.left = playerLanes[currentLane] + "px";

/* PLAYER MOVEMENT */

document.addEventListener("keydown", (e) => {

    if (!gameRunning) return;

    if (e.key === "ArrowLeft" && currentLane > 0) {
        currentLane--;
    }

    if (e.key === "ArrowRight" && currentLane < 2) {
        currentLane++;
    }

    player.style.left = playerLanes[currentLane] + "px";
});

/* CREATE WATER OR POLLUTION */

function createObject() {

    const item = document.createElement("div");

    if (Math.random() < 0.6) {

        item.classList.add("water");
        item.dataset.type = "water";

    } else {

        item.classList.add("pollution");
        item.dataset.type = "pollution";
    }

    const lane = Math.floor(Math.random() * 3);

    item.style.left = objectLanes[lane] + "px";
    item.style.top = "-80px";

    gameArea.appendChild(item);
}

/* UPDATE GAME OBJECTS */

function updateObjects() {

    const objects =
        document.querySelectorAll(".water, .pollution");

    objects.forEach(obj => {

        let top = parseInt(obj.style.top);

        top += objectSpeed;

        obj.style.top = top + "px";

        const playerRect =
            player.getBoundingClientRect();

        const objRect =
            obj.getBoundingClientRect();

        if (
            playerRect.left < objRect.right &&
            playerRect.right > objRect.left &&
            playerRect.top < objRect.bottom &&
            playerRect.bottom > objRect.top
        ) {

            if (obj.dataset.type === "water") {

                score += 10;
                collectSound.currentTime = 0;
                collectSound.play();

                scoreDisplay.textContent = score;

                increaseDifficulty();
                checkMilestones();

                if (score >= winScore) {
                    gameWon();
                    return;
                }

            } else {

                lives--;
                hitSound.currentTime = 0;
                hitSound.play();

                livesDisplay.textContent = lives;

                message.textContent =
                    "⚠ Pollution Hit!";

                if (lives <= 0) {
                    gameOver();
                }
            }

            obj.remove();
        }

        if (top > 650) {
            obj.remove();
        }

    });
}

/* DIFFICULTY */

function increaseDifficulty() {

    if (score >= 50) {
        objectSpeed = 7;
    }

    if (score >= 100) {
        objectSpeed = 9;
        changeSpawnRate(700);
    }

    if (score >= 150) {
        objectSpeed = 11;
    }

    if (score >= 200) {
        objectSpeed = 13;
        changeSpawnRate(600);
    }

    if (score >= 300) {
        objectSpeed = 15;
        changeSpawnRate(500);
    }

    if (score >= 400) {
        objectSpeed = 17;
        changeSpawnRate(400);
    }

    if (score >= 500) {
        objectSpeed = 20;
    }
}

/* CHANGE SPAWN RATE */

function changeSpawnRate(rate) {

    if (spawnRate === rate) return;

    spawnRate = rate;

    clearInterval(objectSpawner);

    objectSpawner =
        setInterval(createObject, spawnRate);
}

/* MILESTONES */

function checkMilestones() {

    if (score === 50) {
        message.textContent = "🎉 Great Start!";
    }

    if (score === 100) {
        message.textContent = "🚰 One Family Helped!";
    }

    if (score === 200) {
        message.textContent = "⭐ Water Hero!";
    }

    if (score === 300) {
        message.textContent = "⚡ Things Are Getting Fast!";
    }

    if (score === 400) {
        message.textContent = "🔥 Final Stretch!";
    }
}









/* START GAME */

function beginGame() {
    clickSound.currentTime = 0;
clickSound.play();

    clearInterval(objectSpawner);
clearInterval(gameLoop);

    overlay.classList.add("hidden");

    document
        .querySelectorAll(".water, .pollution")
        .forEach(item => item.remove());

    score = 0;
    lives = 3;

    objectSpeed = 6;
    spawnRate = 800;

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;

    currentLane = 1;

   player.style.left = playerLanes[currentLane] + "px";

    message.textContent =
        "Collect water drops and avoid pollution!";

    gameRunning = true;

   startBtn.innerHTML = "🔄 Restart Game";

    clearInterval(objectSpawner);
    clearInterval(gameLoop);

    objectSpawner =
        setInterval(createObject, spawnRate);

    gameLoop =
        setInterval(updateObjects, 20);
}

/* WIN */

function gameWon() {
    winSound.currentTime = 0;
winSound.play();

    gameRunning = false;

    clearInterval(objectSpawner);
    clearInterval(gameLoop);

    overlay.classList.remove("hidden");

    overlayContent.innerHTML = `
        <h2>🏆 Clean Water Champion!</h2>

        <p><strong>Final Score:</strong> ${score}</p>

        <p>
            You helped deliver clean water
            to a community.
        </p>

        <p>
            Reaching clean water takes persistence,
            just like this challenge.
        </p>
    `;

    startBtn.textContent = "Play Again";
}

/* GAME OVER */

function gameOver() {

    gameRunning = false;

    clearInterval(objectSpawner);
    clearInterval(gameLoop);

    overlay.classList.remove("hidden");

    overlayContent.innerHTML = `
        <h2>💀 Game Over</h2>

        <p><strong>Final Score:</strong> ${score}</p>

        <p>
            Pollution slowed your mission.
        </p>

        <p>
            Try again and help more communities.
        </p>
    `;

    startBtn.textContent = "Try Again";
}

/* START BUTTON */

startBtn.addEventListener("click", beginGame);


/* MOBILE SWIPE CONTROLS */

let startX = 0;

gameArea.addEventListener("touchstart", (e) => {

    e.preventDefault();

    if (!gameRunning) return;

    startX = e.touches[0].clientX;

}, { passive: false });

gameArea.addEventListener("touchend", (e) => {

    e.preventDefault();

    if (!gameRunning) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50 && currentLane < 2) {
        currentLane++;
    }
    else if (diff < -50 && currentLane > 0) {
        currentLane--;
    }

    player.style.left =
        playerLanes[currentLane] + "px";

}, { passive: false });

const instructionsModal = document.getElementById("instructionsModal");

// Pause the game when the modal opens
instructionsModal.addEventListener("show.bs.modal", () => {

    if (!gameRunning) return;

    clearInterval(objectSpawner);
    clearInterval(gameLoop);

});

// Resume the game when the modal closes
instructionsModal.addEventListener("hidden.bs.modal", () => {

    if (!gameRunning) return;

    objectSpawner = setInterval(createObject, spawnRate);
    gameLoop = setInterval(updateObjects, 20);

});