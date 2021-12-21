const SCREEN_HEIGHT = window.screen.height - 130;
const SCREEN_WIDTH = window.screen.availWidth;
const SEA_HEIGHT = 200;
const SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
const STARTING_SHIP_LEVEL = 100;

const CATS_SPAWN_X = SCREEN_WIDTH * 2 / 3;
const CAT_IMAGE = "cat.gif";
const SECONDS_TO_SPAWN = [3, 1.5, 2];
const TIME_LIMIT = [32, 15, 10];
const IDEAL_WEIGHT = [20];
const MIN_POINTS = 0;

const MAX_POINTS = [100, 100, 100];
const LEVELS = [
    [2, 10, 3, 6, 5, 4, 6, 4],
    [2, 10, 3, 6, 5, 4, 6, 4]
];
const FRAMERATE = 24;
const USERNAME_TEXT_PART_ONE = "Once upon a time the ship, taking a family of Pusheen cats home, started to sink. " +
    "There were screams of terror, and prayers of forgiveness, and only, our brave captain ";
const USERNAME_TEXT_PART_TWO = " remained calm. Now, tell us the story of your heroism!";
const BUTTON_TEXT = "PUSH";

//menu settings
const EL_SIZE = 30
const AUTHORIZATION_TEXT = "Enter your name";
const LEVEL_TEXT = "Select level";
const END_GAME_TEXT = "Game over! Your points: ";
//initialization
let clicked = null;
let logs = [];
let cats = [];
let frame = 0;

document.body.addEventListener('mousemove', e => {
    if (clicked != null)
        clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
});
document.body.addEventListener('mouseup', e => {
    if (clicked != null) {
        clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
        clicked.clicked = false;
        clicked = null;

    }
});

function endGameDiv(points) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.classList.add("menuDiv");
    div.innerText = END_GAME_TEXT + " " + points + "\n";
    div.innerText += "Your records: \n";
    for (let i = 0; i < userLevels; i++) {
        div.innerText += "Level " + (i + 1) + ": " + userPoints[i] + " points \n";
    }

}

function endGame() {
    window.clearInterval(intervalId);
    let gamePoints = MAX_POINTS[level]
        - Math.abs(IDEAL_WEIGHT[level] - logs[0].sumWeight)
        - Math.abs(IDEAL_WEIGHT[level] - logs[1].sumWeight);
    userPoints[level] = Math.max(gamePoints, userPoints[level]);
    if (gamePoints > MIN_POINTS && userLevels < LEVELS.length - 1)
        userLevels++;
    localStorage.setItem(userName + "-levels", userLevels);
    localStorage.setItem(userName + "-points", userPoints);

    endGameDiv(gamePoints);
}

async function update() {

    frame++;
    if (frame / 24 >= TIME_LIMIT[level])
        endGame();
    if (cat_count < LEVELS[level].length && frame / 24 % SECONDS_TO_SPAWN[level] === 0) {
        addCat(level);
    }
    logs.forEach(x => x.processObject())
    cats.forEach(x => x.processObject());
}


function addLog(x, y, width, height, image) {
    let object = new Log(x, y, width, height, image);
    logs.push(object);
}

function addCat(level) {
    cats.push(new Cat(CATS_SPAWN_X, shipLevel, 60, 60, LEVELS[level][cat_count], CAT_IMAGE));
    cat_count++;

}

let
    cat_count = 0, shipLevel;

function addWater() {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.style.position = "absolute";
    div.style.top = SEA_LEVEL + "";
    div.style.width = "100%";
    div.classList.add("water");
    div.style.height = screen.height;
}


main();


async function time() {
    intervalId = setInterval(update, 1000 / FRAMERATE);
}

function startGame() {
    time();
    addLog(SCREEN_WIDTH / 10, SEA_LEVEL - 150, 300, 100, "wood3.png");
    addLog(SCREEN_WIDTH / 3, SEA_LEVEL - 150, 300, 100, "wood3.png");

}

function createUser() {
    userLevels = 1;
    userPoints = [];
    for (let i = 0; i < LEVELS.length; i++) {
        userPoints.push(0);
    }
}

function main() {
    getUserName();
    shipLevel = STARTING_SHIP_LEVEL;
    addWater();
    document.getElementById("boat").style.bottom = 0;
}

