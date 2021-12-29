let SCREEN_HEIGHT = document.body.offsetHeight;
let SEA_HEIGHT = SCREEN_HEIGHT / 3;
let SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
const STARTING_SHIP_LEVEL = -60;

const SECONDS_TO_SPAWN = [3, 2, 2];
const TIME_LIMIT = [35, 20, 20];
const ADD_CONDITIONS = [
    "Вместимость: 3 кота на дополнительном бревнышке",
    "Вместимость: 2 кота на дополнительном бревнышке, сумма весов скрыта",
    "Вместимость: 1 кот на дополнительном бревнышке, 3 кота на бревне, сумма весов скрыта"];

const LOG_MAX_CATS = [8,8,3];
const TABLE_MAX_CATS = [3,2,1];
const MAX_POINTS = [40,40,58];
const LEVELS = [
    [2, 10, 3, 6, 5, 4, 6, 4],
    [2, 10, 3, 6, 5, 4, 6, 4],
    [14, 8, 12, 6, 9, 9]
];
const ADDITIONAL_CONDITIONS = [
    [],
    ["NO_HEADERS"],
    ["NO_HEADERS"]
]
const FRAMERATE = 24;
const USERNAME_TEXT_PART_ONE = "Корабль с семьей котов на борту начал тонуть. И только ты, бравый капитан по имени ";
const USERNAME_TEXT_PART_TWO = ", остался спокоен. Твоя задача - распределить бедных котиков по двум большим бревнам " +
    "так, чтобы веса были одинаковыми, а общая сумма была максимальной. Удерживай левую клавишу. чтобы " +
    "перетаскивать котов. В воде коты быстро тонут, поэтому важно пользоваться третьим бревном для временного размещения " +
    "котят. Место на нём ограничено, время тоже - корабль тонет быстро! ";
const BUTTON_TEXT = "Начать!";

//menu settings
const AUTHORIZATION_TEXT = "Введи свое имя: ";
const WIN_GAME_TEXT = "Ты справился! Твои очки: ";
const END_GAME_TEXT = "Ты проиграл! Веса на бревнах отличаются!";

let clicked = null;
let logs = [];
let cats = [];
let frame = 0;
let catSpawn;
let audio;
let intervalId;

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

    addElement(div, "div", "Твои рекорды: ", "endMenuText");
    for (let i = 0; i < LEVELS.length; i++) {
        let points = userPoints[i] == null ? 0 : userPoints[i]
        addElement(div, "div", "Уровень: " + (i + 1) + ": " + points + "/" + MAX_POINTS[i] + " очков. ", "endMenuText");
        console.log("i = " + i);
    }

    let button = addElement(div, "div", BUTTON_TEXT, "buttonElement");
    button.onclick = function () {
        showMenu();
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

window.addEventListener('resize', function(event) {
    SCREEN_HEIGHT = document.body.offsetHeight;
    SEA_HEIGHT = SCREEN_HEIGHT / 3;
    SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
}, true);


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


function addLog(x, y, width, height, maxCats, headersFlag) {
    let object = new Log(x, y, width, height, maxCats, headersFlag);
    logs.push(object);
    return object;
}

function addCat(level) {
    cats.push(new Cat(catSpawn, STARTING_SHIP_LEVEL, 60, 60, LEVELS[level][cat_count]));
    cat_count++;

}

let
    cat_count = 0, shipLevel;

let mainMenu = null;
main();


async function time() {
    intervalId = setInterval(update, 1000 / FRAMERATE);
}

function includeHeaders(level){
    return !ADDITIONAL_CONDITIONS[level].includes("NO_HEADERS");
}

function startGame(level) {
    document.getElementById("boat").style.transitionDuration = TIME_LIMIT[level] + "s";
    document.getElementById("boat").classList.add("sinking");
    time();
    let headersFlag = includeHeaders(level);
    let log = addLog(40, SEA_LEVEL - 125, 300, 100, LOG_MAX_CATS[level], headersFlag);
    let log2 = addLog(log.x + log.width + 50, SEA_LEVEL - 150, 300, 100,  LOG_MAX_CATS[level], headersFlag);
    addLog(log2.x + log2.width + 200, SEA_LEVEL - 100, 150, 100, TABLE_MAX_CATS[level], headersFlag);
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
    shipLevel = STARTING_SHIP_LEVEL;
    showStartButton();
}

function muteAudio() {
    audio.muted = !audio.muted;
    // if (audio.muted) {
    //     audio.style.backgroundImage = "url('unmuted.png')";
    // } else audio.style.backgroundImage = "url('muted.png')";
}