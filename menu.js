function addElement(parent, type, text, className) {
    let element = document.createElement(type);
    element.classList.add(className);
    parent.appendChild(element);
    if (text !== null)
        element.textContent = text;
    return element;
}

function createDiv(TEXT, openLevels) {
    let menu = addElement(document.body, "div", null, "cloud");
    let menuDiv = addElement(menu, "div", null, "menuDiv");

    if (openLevels != null) {
        let chooseLevelText = addElement(menuDiv, "div", "Choose level: ", "text");

        for (let i = 0; i < openLevels; i++) {
            let elementDiv = addElement(menuDiv, "button", i + 1, "selectionElement");
            let levelDescriptionDiv = addElement(menuDiv, "p",
                "Family size: " + LEVELS[i].length + ", Level time: " + TIME_LIMIT[i],
                "menuText");
            elementDiv.onclick = function () {
                level = elementDiv.textContent - 1;
                document.body.removeChild(menu);
                startGame();
            };
        }
    } else {
        let userNamePartOne = addElement(menuDiv, "p", USERNAME_TEXT_PART_ONE, "menuText");
        let elementInput = addElement(menuDiv, "input", null, "inputElement");
        let userNamePartTwo = addElement(menuDiv, "p", USERNAME_TEXT_PART_TWO, "menuText");
        let button = addElement(menu, "div", BUTTON_TEXT, "buttonElement");
        button.onclick = function () {
            userName = elementInput.value;
            console.log(userName);
            document.body.removeChild(menu);
            getLevel();
        };
    }
    return menuDiv;
}

function showMenu() {
    let menuDiv = addElement(document.body, "div", null, "startMenuDiv");
    // addElement(menuDiv, "div", MENU_TEXT, "menuText");
    menuDiv.onclick = function () {
        document.body.removeChild(menuDiv);
        document.getElementById("boat").classList.add("trans");
        let audio = new Audio('ost.mp3');
        audio.play();
        setTimeout(getUserName, 9000);
    };
}

function gameMenu(){
    let menuDiv = addElement(document.body, "div", null, "gameMenuDiv");
    addElement(menuDiv, "div",null,"timeDiv");

}
function getUserName() {
    let div = createDiv(AUTHORIZATION_TEXT, null);


}

let userName;
let userLevels, userPoints;

function getLevel() {

    userPoints = localStorage.getItem(userName + "-points");
    userLevels = localStorage.getItem(userName + "-levels");
    if (userPoints == null) {
        console.log("user is null");
        createUser();
    } else userPoints = userPoints.split(',');

    createDiv(LEVEL_TEXT, userLevels);
    return undefined;
}
