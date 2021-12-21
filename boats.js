const SCREEN_HEIGHT = window.screen.height - 130;
const SCREEN_WIDTH = window.screen.availWidth;
const SEA_HEIGHT = 100;
const SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
const STARTING_SHIP_LEVEL = SCREEN_HEIGHT / 2;

const CATS_SPAWN_X = SCREEN_WIDTH - 100;
const CAT_IMAGE = "cat.gif";

const TIME_SPEED = [100];
const LEVELS = [[2, 10, 3, 6, 5, 4, 6, 4]];

//menu settings
const EL_SIZE = 30
const LEVELS_LIST = [1, 2, 3, 4, 5];
const DIFFICULTY_LIST = ["EASY", "MEDIUM", "HARD"];
const AUTHORIZATION_TEXT = "Enter your name";
const DIFFICULTY_TEXT = "Select difficulty";
const LEVEL_TEXT = "Select level";


interactableObjects = [];
let clicked = null;

document.body.addEventListener('mousemove', e => {
    if (clicked == null) {
        return;
    }
    clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
});

class Cat{
    constructor(x, y, width, height, weight, fixed, image) {
        this.image = image;
        this.speed = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fixed = fixed;
        this.weight = weight;
        this.interactedWith = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.createDivs();
    }

    createDivs() {
        this.div = document.createElement('div');
        console.log(this.image);
        if (this.image != null)
            this.div.style.backgroundImage = "url('" + this.image + "')";
        else
            this.div.style.backgroundColor = 'red';

        this.div.style.backgroundSize = "100% 100%";
        this.div.style.position = 'absolute';
        document.body.appendChild(this.div);
        this.div.style.height = this.height;
        this.div.style.width = this.width;
        this.div.style.left = this.x;
        this.div.style.top = this.y;
        if (!this.fixed) {
            this.addMouseMovable();
            this.header = document.createElement("div");
            this.header.style.position = 'relative';
            this.div.appendChild(this.header);
            this.header.style.top = "-10px";
            this.header.style.left = "-10px";
        }
    }

    addMouseMovable() {
        this.div.addEventListener('mousedown', e => {
            clicked = this;
            this.clicked = true;
            this.interactedWith = [];
            interactableObjects.forEach(x => {
                    let index = x.interactedWith.indexOf(this);
                    if (index !== -1)
                        x.interactedWith.splice(index, 1);
                }
            );
        });
        this.div.addEventListener('mouseup', e => {
            clicked = null;
            this.clicked = false;
        });
    }

    processObject() {
        if (this.clicked)
            return;
        let flag = false;
        this.sumWeight = this.weight;
        this.interactedWith.forEach(x => this.sumWeight += x.sumWeight);
        if (!this.fixed)
            this.header.textContent = this.weight;
        interactableObjects.forEach(other => {
            if (other.interactedWith.includes(this)) {
                flag = true;
            }
        });
        if (flag)
            return;
        interactableObjects.forEach(other => {
            if (other.clicked)
                return;
            if (other.checkBorders(this) && this.y < other.y) {
                this.updatePosition(this.x, other.y - this.height);
                other.interactedWith.push(this)
                flag = true;
            }
        });
        if (flag)
            return;
        if (!this.clicked && !flag) {
            this.changeSpeed();
            this.updatePosition(this.x, this.y + this.speed);
        }
    }

    updatePosition(x, y) {
        let oldX = this.x;
        let oldY = this.y;
        this.x = x;
        this.y = y;
        this.div.style.top = this.y;
        this.div.style.left = this.x;
        let offsetX;
        let offsetY;
        this.interactedWith.forEach(interacted => {
            offsetX = this.x - oldX;
            offsetY = this.y - oldY;
            interacted.updatePosition(interacted.x + offsetX, interacted.y + offsetY);
        });
    }

    checkBorders(other) {
        if (this === other) {
            return false;
        }
        let aRect = this.div.getBoundingClientRect();
        let bRect = other.div.getBoundingClientRect();

        return !(
            ((aRect.top + aRect.height) < (bRect.top)) ||
            (aRect.top > (bRect.top + bRect.height)) ||
            ((aRect.left + aRect.width) < bRect.left) ||
            (aRect.left > (bRect.left + bRect.width))
        );
    }

    changeSpeed() {
        let rect = this.div.getBoundingClientRect();
        if (this.speed >= 0) {
            if (rect.bottom < SEA_LEVEL && this.speed < 5)
                this.speed += 0.5;
            else if (rect.top + rect.height / 3 < SEA_LEVEL)
                this.speed += 0.05;
            else this.speed -= 0.5;
        } else if (rect.bottom - rect.height / 2 < SEA_LEVEL)
            this.speed = 0.2;
        else if (this.speed > -1)
            this.speed -= 0.7;
    }

}
class Logs{

}
class Interactable {

function deleteCat() {
    cats.forEach(cat => {
        if (cat.div.getBoundingClientRect().bottom > SEA_LEVEL) {
            document.body.removeChild(cat.div);
            cats.splice(cats.indexOf(cat), 1);
        }

    })
}

async function update() {
    timer++;
    level = 0;
    if (cat_count < LEVELS[level].length && timer % TIME_SPEED[level] === 0) {
        addInteractableCat(level);
    }
    interactableObjects.forEach(x => x.processObject())
    cats.forEach(x => x.processObject());
}

cats = []

function

addInteractable(x, y, width, height, weight, fixed, image) {
    object = new Interactable(x, y, width, height, weight, fixed, image);
    if (fixed)
        interactableObjects.push(object);
    else cats.push(object);
}

function

addInteractableCat(level) {
    addInteractable(CATS_SPAWN_X, shipLevel, 60, 60, LEVELS[level][cat_count], false, CAT_IMAGE);
    cat_count++;
}

let
    timer = 0;
let
    cat_count = 0, shipLevel;

async function

time() {
    let i = 0;
    while (i < 10000) {
        i++;
        setTimeout(update, i * 41);
    }
}

function addWater() {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.style.position = "absolute";
    div.style.top = SEA_LEVEL + "";
    div.style.width = "100%";
    div.classList.add("water");
    div.style.height = screen.height;
}

function createDiv(TEXT, list) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    div.classList.add("menuDiv");

    function buttonOnClick() {
    }

    if (list != null) {
        for (let i = 0; i < list.length; i++) {
            let elementDiv = document.createElement("button");
            div.appendChild(elementDiv);
            elementDiv.classList.add("selectionElement");
            elementDiv.style.position = "absolute";
            elementDiv.style.top = 20 + i * EL_SIZE + "px";
            elementDiv.textContent = list[i];
            elementDiv.onclick = function () {
                level = elementDiv.textContent;
                console.log(level);
                document.body.removeChild(div);
                startGame();
            };
        }
    } else {
        let elementInput = document.createElement("input");
        div.appendChild(elementInput);
        elementInput.classList.add("inputElement");
        let elementButton = document.createElement("button");
        elementButton.classList.add("buttonElement");
        let userName = "";
        div.appendChild(elementButton);
        elementButton.onclick = function () {
            userName = elementInput.value;
            console.log(userName);
            document.body.removeChild(div);
            getLevel();
        };
    }
    return div;
}

// startGame();

function getUserName() {
    let div = createDiv(AUTHORIZATION_TEXT, null);
}

function getLevel() {
    createDiv(LEVEL_TEXT, LEVELS_LIST);
    return undefined;
}

main();

function startGame() {
    time();
}


function main() {
    getUserName();
    shipLevel = STARTING_SHIP_LEVEL;
    addInteractable(SCREEN_WIDTH / 8, SEA_LEVEL - 20, 300, 100, 0, true, "woodFin.jpg");
    addInteractable(SCREEN_WIDTH / 3, SEA_LEVEL - 20, 300, 100, 0, true, "woodFin.jpg");
    addWater();

}

