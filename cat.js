class Cat extends Interactable {
    constructor(x, y, width, height, weight, image) {
        super(x, y, width, height, image, -5, -5);
        this.weight = weight;
        this.addMouseMovable();
        this.health = 2;
        this.div.classList.add("cat");
        this.maxFloatingSpeed = -3;
        this.header.textContent = this.weight;
    }

    processObject() {
        if (this.clicked)
            return;

        if (this.y + this.height > SEA_LEVEL && frame / FRAMERATE % SECONDS_TO_SPAWN[level] === 0)
            this.health--;
        let flag = false;

        logs.forEach(other => {
            if (other.interactedWith.includes(this)) {
                flag = true;
            }
        });
        if (flag)
            return;
        logs.forEach(other => {
            if (other.clicked)
                return;
            if (other.checkBorders(this) && this.y < other.y) {
                this.updatePosition(this.x, other.y - this.height);
                other.interactedWith.push(this)
                flag = true;
            }
        });
        if (!this.clicked && !flag) {
            if (this.health <= 0) {
                this.speed = 3;
            } else this.changeSpeed();
            this.updatePosition(this.x, this.y + this.speed);
        }
    }


    addMouseMovable() {
        this.div.addEventListener('mousedown', e => {
            clicked = this;
            this.clicked = true;
            this.offsetX = e.clientX - this.x;
            this.offsetY = e.clientY - this.y;
            this.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
            logs.forEach(x => {
                    let index = x.interactedWith.indexOf(this);
                    if (index !== -1)
                        x.interactedWith.splice(index, 1);
                }
            );
        });
        this.div.addEventListener('mouseup', e => {
            clicked.updatePosition(e.clientX - clicked.offsetX, e.clientY - clicked.offsetY);
            clicked = null;
            this.clicked = false;
        });
    }

    removeCat() {
        cats.splice(cats.indexOf(this), 1);
        document.body.removeChild(this.div);
    }
}