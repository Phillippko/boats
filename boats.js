const SCREEN_HEIGHT = window.screen.height;
const SEA_LEVEL = SCREEN_HEIGHT - 100;
const Y_CHANGE = 2;
interactableObjects = [];
let clicked = null;

document.body.addEventListener('mousemove', e => {
    if (clicked == null) {
        return;
    }
    clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
});

class Interactable {
    constructor(x, y, width, height, weight, fixed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fixed = fixed;
        this.sumWeight = weight;
        this.offsetX = 0;
        this.offsetY = 0;
        this.createDiv();
    }

    createDiv() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        document.body.appendChild(this.div);
        this.div.style.height = this.height;
        this.div.style.width = this.width;
        this.div.style.left = this.x;
        this.div.style.top = this.y;
        this.div.style.backgroundColor = 'red';
        this.contact = false;
        if (!this.fixed) {
            this.addMouseMovable();
        }
    }

    addMouseMovable() {
        this.div.addEventListener('mousedown', e => {
            clicked = this;
            this.clicked = true;
        });
        this.div.addEventListener('mouseup', e => {
            clicked = null;
            this.clicked = false;
        });
    }

    processObject() {
        if (this.fixed) {
            return;
        }
        if (!this.clicked && this.y < SEA_LEVEL && !this.contact) {
            this.updatePosition(this.x, this.y + Y_CHANGE);
        }
        let flag = false;
        interactableObjects.forEach(other => {
            if (other.checkBorders(this)) {
                this.updatePosition(this.x, other.y - this.height);
                other.addInteraction(this);
                flag = true;
            }
        });
        if (!flag) {
            this.contact = false;
            // this.deleteInteraction();
        }
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.div.style.top = this.y;
        this.div.style.left = this.x;
    }


    addInteraction(interacted) {
        this.sumWeight += interacted.sumWeight;
        interacted.contact = true;
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
}

async function update() {
    interactableObjects.forEach(x => x.processObject());
}

function addInteractable(x, y, width, height, weight, fixed) {
    object = new Interactable(x, y, width, height, weight, fixed);
    interactableObjects.push(object);
}

async function time() {
    i = 0;
    while (i < 10000) {
        i++;
        setTimeout(update, i * 41);
    }
}

addInteractable(10, 10, 10, 10, 1, false);
addInteractable(10, 100, 100, 100, 1000, true);

time();