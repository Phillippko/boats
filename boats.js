const SCREEN_HEIGHT = window.screen.height - 130;
const SCREEN_WIDTH = window.screen.availWidth;

const CAT_IMAGE = "cat.gif";

const SEA_HEIGHT = 300;
const SEA_LEVEL = SCREEN_HEIGHT - SEA_HEIGHT;
const TIME_SPEED = 100;
const LEVEL_CATS_COUNT = 10;
const STARTING_SHIP_LEVEL = 10
;
interactableObjects = [];
let clicked = null;

document.body.addEventListener('mousemove', e => {
    if (clicked == null) {
        return;
    }
    clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
});


class Interactable {
    constructor(x, y, width, height, weight, fixed, image) {
        this.image = image;
        this.speed = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fixed = fixed;
        this.sumWeight = weight;
        this.weight = weight;
        this.offsetX = 0;
        this.offsetY = 0;
        this.contactWith = null;
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
        }
        this.header = document.createElement("div");
        this.header.style.position = 'relative';
        this.div.appendChild(this.header);
        this.header.top = -10;
    }

    addMouseMovable() {
        this.div.addEventListener('mousedown', e => {
            clicked = this;
            this.clicked = true;
            this.contactWith = null;
        });
        this.div.addEventListener('mouseup', e => {
            clicked = null;
            this.clicked = false;
        });
    }

    processObject() {
        this.header.textContent = this.sumWeight;
        if(this.contactWith != null){
            this.updatePosition(this.x, this.contactWith.y - this.height);
            return;
        }
        if (!this.clicked && this.contactWith == null) {
            this.changeSpeed();
            this.updatePosition(this.x, this.y + this.speed);
        }
        let flag = false;
        interactableObjects.forEach(other => {
            if (other.checkBorders(this) && this.y < other.y) {
                this.speed = other.speed;
                this.updatePosition(this.x, other.y - this.height);
                other.addInteraction(this);
                flag = true;
            }
        });
        if (!flag) {
            this.contactWith = null;
            this.deleteInteractions();
        }
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.div.style.top = this.y;
        this.div.style.left = this.x;
    }


    addInteraction(interacted) {
        interacted.contactWith = this;
        this.sumWeight += interacted.sumWeight;
        interacted.y = this.y - interacted.height;
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

    deleteInteractions() {
        this.sumWeight = this.weight;
    }
}

async function update() {
    timer++;
    if (cat_count < LEVEL_CATS_COUNT && timer % TIME_SPEED === 0)
        addInteractableCat();
    interactableObjects.forEach(x => x.processObject());
}

function addInteractable(x, y, width, height, weight, fixed, image) {
    object = new Interactable(x, y, width, height, weight, fixed, image);
    interactableObjects.push(object);
}

function addInteractableCat() {
    cat_count++;
    addInteractable(SCREEN_WIDTH / 2, shipLevel, 60, 60, 10, false, CAT_IMAGE);
}

let timer = 0;
let cat_count = 0;

async function time() {
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

main();

function main() {
    shipLevel = STARTING_SHIP_LEVEL;
    addInteractable(SCREEN_WIDTH / 4, SEA_LEVEL - 20, 300, 100, 1000, true, "woodFin.jpg");
    addWater();
    time();

}

