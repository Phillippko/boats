function addElement(parent, type, text, className) {
    let element = document.createElement(type);
    element.classList.add(className);
    parent.appendChild(element);
    if (text !== null)
        element.textContent = text;
    return element;
}

let userPoints, userName, level = 0;

function createDiv() {
    let userLevels = 1;
    let menu = addElement(document.body, "div", null, "cloud");
    let menuDiv = addElement(menu, "div", null, "menuDiv");

    let userNamePartOne = addElement(menuDiv, "p", USERNAME_TEXT_PART_ONE, "menuText");
    let elementInput = addElement(menuDiv, "input", null, "inputElement");
    let userNamePartTwo = addElement(menuDiv, "p", USERNAME_TEXT_PART_TWO, "menuText");
    let chooseLevelText = addElement(menuDiv, "div", "Enter your name and choose level: ", "text");
    if(userName != null)
        elementInput.value = userName;
    let levelsDivs = [];
    let levelContainerDivs = [];

    getUserLevels(elementInput, menuDiv, levelsDivs, levelContainerDivs);
    elementInput.oninput = function(){
        getUserLevels(elementInput, menuDiv, levelsDivs, levelContainerDivs);
    };


    let button = addElement(menu, "div", BUTTON_TEXT, "buttonElement");
    button.onclick = function () {
        document.body.removeChild(menu);
        if (userPoints == null) {
            createUser();
        } else userPoints = userPoints.split(',');
        startGame(level);
    };
    return menu;
}
function getUserLevels(elementInput, menuDiv, levelsDivs,levelContainerDivs) {

    userName = elementInput.value;
    userPoints = localStorage.getItem(userName + "-points");
    userLevels = localStorage.getItem(userName + "-levels");
    while (levelContainerDivs.length > 0) {
        menuDiv.removeChild(levelContainerDivs[levelContainerDivs.length - 1]);
        levelContainerDivs.pop();
        levelsDivs.pop();
    }
    if (userLevels == null)
        userLevels = 1;
    for (let i = 0; i < userLevels; i++) {
        levelContainerDivs.push(addElement(menuDiv, "div", null, "meiv"));
        levelsDivs.push(addElement(levelContainerDivs[i], "button", i + 1, "selectionElement"));
        addElement(levelContainerDivs[i], "p",
            "Family size: " + LEVELS[i].length + ", Level time: " + TIME_LIMIT[i],
            "menuText");
        levelsDivs[i].onclick = function () {
            level = levelsDivs[i].textContent - 1;

        };
    }
}

function showMenu() {
    let menuDiv = addElement(document.body, "div", null, "startMenuDiv");
    // addElement(menuDiv, "div", MENU_TEXT, "menuText");
    menuDiv.onclick = function () {
        document.body.removeChild(menuDiv);
        document.getElementById("boat").classList.add("trans");
        audio = new Audio('ost.mp3');
        audio.play();
        // audio.muted =
        setTimeout(getUserName, 9000);
    };
}

function gameMenu() {
    let menuDiv = addElement(document.body, "div", null, "gameMenuDiv");
    addElement(menuDiv, "div", null, "timeDiv");

}

function getUserName(userName) {
    if (mainMenu !== null){
        document.body.removeChild(mainMenu);
        mainMenu = null;
    }
    shipLevel = STARTING_SHIP_LEVEL;
    clicked = null;
    logs.forEach(x => document.body.removeChild(x.div));
    cats.forEach(x => document.body.removeChild(x.div));
    cat_count = 0;
    logs = [];
    cats = [];
    frame = 0;

    createDiv(AUTHORIZATION_TEXT, userName);

}

