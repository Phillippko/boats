class Log extends Interactable {
    constructor(x, y, width, height, maxCats, headerFlag) {
        super(x, y, width, height, -40, -40, "img/circle.png", headerFlag);
        this.interactedWith = [];
        this.div.classList.add("log");
        this.maxCats = maxCats;
    }

    processObject(){
        this.sumWeight = 0;
        this.interactedWith.forEach(x => this.sumWeight += x.weight);
        if(this.header != null)
            this.header.textContent = this.sumWeight;
        this.changeSpeed();
        this.updatePosition(this.x, this.y + this.speed);

    }

    updatePosition(x, y) {
        let oldX = this.x;
        let oldY = this.y;
        super.updatePosition(x, y);
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
}