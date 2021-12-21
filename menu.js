function createDiv(TEXT, list) {
    let cloud = document.createElement("div");
    cloud.classList.add("cloud");
    document.body.appendChild(cloud);
    let div = document.createElement("div");
    cloud.appendChild(div);
    div.classList.add("menuDiv");

    let textDiv = document.createElement("div");
    textDiv.textContent = TEXT;
    div.appendChild(textDiv);
    if (list != null) {
        for (let i = 0; i < list.length; i++) {
            let elementDiv = document.createElement("button");
            div.appendChild(elementDiv);
            elementDiv.classList.add("selectionElement");
            elementDiv.style.position = "absolute";
            elementDiv.style.top = 20 + i * EL_SIZE + "px";
            elementDiv.textContent = list[i];
            elementDiv.onclick = function () {
                level = elementDiv.textContent - 1;
                console.log(level);
                document.body.removeChild(cloud);
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
            document.body.removeChild(cloud);
            getLevel();
        };
    }
    return div;
}

function getUserName() {
    let div = createDiv(AUTHORIZATION_TEXT, null);
}

let userName;
let userLevels, userPoints;
function getLevel() {

    userPoints =  localStorage.getItem(userName + "-points");
    userLevels = localStorage.getItem(userName + "-levels");
    if (userPoints == null) {
        console.log("user is null");
        createUser();
    }
    else userPoints = userPoints.split(',');

    createDiv(LEVEL_TEXT, LEVELS_LIST);
    return undefined;
}
