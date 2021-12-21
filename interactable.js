class Interactable {
    constructor(x, y, width, height, image, headerOffsetX, headerOffsetY) {
        this.image = image;
        this.speed = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offsetX = 0;
        this.offsetY = 0;
        this.createDivs();
        this.addHeader(headerOffsetX, headerOffsetY);
        this.maxFloatingSpeed = -1;
        this.weight = 0;
        this.sumWeight = 0;
    }

    createDivs() {
        this.div = document.createElement('div');
        console.log(this.image);
        this.div.style.background = 0;
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
    }

    processObject(){}

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.div.style.top = this.y;
        this.div.style.left = this.x;
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
        else if (this.speed > this.maxFloatingSpeed)
            this.speed -= 0.7;
    }

    addHeader(offsetX, offsetY) {
        this.header = document.createElement("div");
        this.header.style.position = 'absolute';
        this.header.classList.add("header");
        this.header.style.left = offsetX;
        this.header.style.top = offsetY;
        this.div.appendChild(this.header);
        this.header.textContent = "";

    }
}
