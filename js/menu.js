function addElement(parent, type, text, className, id) {
    let element = document.createElement(type);
    element.classList.add(className);
    parent.appendChild(element);
    if (text !== null)
        element.textContent = text;
    if(id !== null)
        element.id = "boat";
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
    let chooseLevelText = addElement(menuDiv, "div", "Введи свое имя в поле сверху и выбери уровень: ", "text");
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
            "Размер семьи: " + LEVELS[i].length + ", время уровня: " + TIME_LIMIT[i] + ". Условия: " + ADD_CONDITIONS[i],
            "menuText");
        levelsDivs[i].onclick = function () {
            level = levelsDivs[i].textContent - 1;

        };
    }
}

function showStartButton() {
    let menuDiv = addElement(document.body, "div", null, "startMenuDiv");
    // addElement(menuDiv, "div", MENU_TEXT, "menuText");
    menuDiv.onclick = function () {
        document.body.removeChild(menuDiv);
        document.getElementById("boat").classList.add("trans");
        audio = new Audio('ost.mp3');
        audio.play();
        // audio.muted =
        setTimeout(showMenu, 9000);
    };
}

function showMenu(userName) {
    document.body.removeChild(document.getElementById("boat"));

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
    let boat = addElement(document.body, "div", null, "boat", "boat");
    boat.classList.add("trans");
    createDiv(AUTHORIZATION_TEXT, userName);

}

