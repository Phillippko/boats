const SCREEN_HEIGHT = window.screen.height;
const SCREEN_WIDTH = window.screen.availWidth;
const SEA_HEIGHT = SCREEN_HEIGHT / 3;
const SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
const STARTING_SHIP_LEVEL = -60;

const CATS_SPAWN_X = SCREEN_WIDTH * 2 / 3;
const CAT_IMAGE = "cat.gif";
const SECONDS_TO_SPAWN = [3, 2, 2];
const TIME_LIMIT = [35, 20, 10];
const IDEAL_WEIGHT = [20];
const MIN_POINTS = 0;
const LOG_MAX_CATS = 10;
const TABLE_MAX_CATS = 2;
const MAX_POINTS = [100, 100, 100];
const LEVELS = [
    [2, 10, 3, 6, 5, 4, 6, 4],
    [2, 10, 3, 6, 5, 4, 6, 4]
];
const FRAMERATE = 24;
const USERNAME_TEXT_PART_ONE = "Once upon a time the ship, taking a family of cats home, started to sink. " +
    "There were screams of terror, and prayers of forgiveness, and only you, our brave captain ";
const USERNAME_TEXT_PART_TWO = " remained calm. Now, tell us the story of your heroism! " +
    "Your task is to balance cats on two logs of wood. Time is restricted, cats live in water too. Good luck! " +
    "Press and hold left mouse button to drag cats. Numbers near heads are their weights. Also you have a third log, just to temporarily place maximum of 2 cats ";
const BUTTON_TEXT = "PUSH";

//menu settings
const EL_SIZE = 30
const AUTHORIZATION_TEXT = "Enter your name";
const LEVEL_TEXT = "Select level";
const WIN_GAME_TEXT = "You win! Your points: ";
const END_GAME_TEXT = "Game over! Sums on big logs are different. Try again!";

let clicked = null;
let logs = [];
let cats = [];
let frame = 0;
let catSpawn;
let audio;

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

function endGameDiv(text) {
    let menu = addElement(document.body, "div", null, "cloud");
    let div = addElement(menu, "div", null, "menuDiv");

    let textOneDiv = addElement(div, "div", text, "endMenuText");

    addElement(div, "div", "Your records: ", "endMenuText");
    for (let i = 0; i < LEVELS.length; i++) {
        let points = userPoints[i] == null ? 0 : userPoints[i]
        addElement(div, "div", "Level " + (i + 1) + ": " + points + " points. ", "endMenuText");
        console.log("i = " + i);
    }

    let button = addElement(div, "div", BUTTON_TEXT, "buttonElement");
    button.onclick = function () {
        getUserName();
    };
    mainMenu = menu;
}

function endGame() {
    window.clearInterval(intervalId);
    if (logs[0].sumWeight === logs[1].sumWeight && logs[0].sumWeight > 0) {
        let gamePoints = logs[0].sumWeight + logs[1].sumWeight;
        if (userLevels < LEVELS.length)
            userLevels++;
        userPoints[level] = Math.max(gamePoints, userPoints[level])
        localStorage.setItem(userName + "-points", userPoints);
        localStorage.setItem(userName + "-levels", userLevels);
        text = WIN_GAME_TEXT + gamePoints
    } else text = END_GAME_TEXT;

    endGameDiv(text);

}

async function update() {
    shipLevel += SEA_LEVEL / (TIME_LIMIT[level] * FRAMERATE);
    frame++;
    if (frame / 24 >= TIME_LIMIT[level])
        endGame();
    if (cat_count < LEVELS[level].length && frame / 24 % SECONDS_TO_SPAWN[level] === 0) {
        addCat(level);
    }
    logs.forEach(x => x.processObject())
    cats.forEach(x => x.processObject());
}


function addLog(x, y, width, height, image, maxCats) {
    let object = new Log(x, y, width, height, image, maxCats);
    logs.push(object);
    return object;
}

function addCat(level) {
    cats.push(new Cat(catSpawn, STARTING_SHIP_LEVEL, 60, 60, LEVELS[level][cat_count], CAT_IMAGE));
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

let mainMenu = null;
main();


async function time() {
    intervalId = setInterval(update, 1000 / FRAMERATE);
}

function startGame(level) {
    document.getElementById("boat").style.transitionDuration = TIME_LIMIT[level] + "s";
    document.getElementById("boat").classList.add("sinking");
    time();
    let log = addLog(40, SEA_LEVEL - 125, 300, 100, "wood3.png", LOG_MAX_CATS);
    let log2 = addLog(log.x + log.width + 50, SEA_LEVEL - 150, 300, 100, "wood3.png", LOG_MAX_CATS);
    addLog(log2.x + log2.width + 200, SEA_LEVEL - 100, 150, 100, "wood3.png", TABLE_MAX_CATS);
    catSpawn = log2.x + log2.width + 200;
}

function createUser() {
    userLevels = 1;
    userPoints = [];
    for (let i = 0; i < LEVELS.length; i++) {
        userPoints.push(0);
    }
}

function main() {
    addWater();
    document.getElementById("boat").style.bottom = 100;
    shipLevel = STARTING_SHIP_LEVEL;
    showMenu();
}

function muteAudio() {
    audio.muted = !audio.muted;
    // if (audio.muted) {
    //     audio.style.backgroundImage = "url('unmuted.png')";
    // } else audio.style.backgroundImage = "url('muted.png')";
}