const INNER_VALUE = 5;
const MIDDLE_VALUE = 2;
const OUTER_VALUE = 1;

const main = document.querySelector("#main");
const tiles = document.querySelectorAll(".tile");
const mainCounter = document.querySelector("#mainCounter");
mainCounter.value = 0;
const remove = document.querySelector("#remove");
const toggleProp = document.querySelector("#toggleProp");
const toggleDir = document.querySelector("#toggleDir");
const reset = document.querySelector("#reset");
const textarea = document.querySelector("#textarea");

const tilesNumber = tiles.length;
let fullPropagation = true;
let removeToolEnabled = false;
let reversePropagation = false;
let counters;
let textId = 1;

//WRITE TEXT IN THE TEXTAREA
const writeConsole = (text) => {
    textarea.innerHTML += textId + ") " + text + "\r\n";
    textarea.scrollTop = textarea.scrollHeight;
    textId++;
}

//STOP THE EVENT PROPAGATION
const stopBubble = (e) => {
    if (!e) {let e = window.event;}
    e.cancelBubble = true;
    if (e.stopPropagation) {e.stopPropagation();}
}

//REMOVE THE SELECTED TILE FROM THE INTERFACE
const removeTile = (id) => {
    tiles[id-1].innerHTML = "ADD A NEW TILE";
    tiles[id-1].classList.add("no-tile");
    tiles[id-1].addEventListener("click", () => {addTile(id)}, {once: true});
}

//TOGGLE THE POSSIBILITY TO REMOVE TILES
const toggleRemove = () => {
    removeToolEnabled = !removeToolEnabled;
    if (removeToolEnabled) {
        remove.classList.add("enabled");
        writeConsole("REMOVE TOOL ON");
    }
    else {
        remove.classList.remove("enabled");
        writeConsole ("REMOVE TOOL OFF");
    }
    
    for (let tile of tiles)
        tile.classList.contains("removable") ?
        tile.classList.remove("removable") :
        tile.classList.add("removable");
}

//ADD POINTS TO THE SCORE: TO MAIN- AND SUB-COUNTERS
const addPoints = (event, id, div) => {
    if (!fullPropagation) stopBubble(event);
    const counter = document.querySelector("#counter" + id);
    let toBeAdded;
    if (div.classList.contains("inner")) toBeAdded = INNER_VALUE;
    else if (div.classList.contains("middle")) toBeAdded = MIDDLE_VALUE;
    else if (div.classList.contains("outer")) toBeAdded = OUTER_VALUE;

    const text = "Tile no " + id + ": +" + toBeAdded;
    writeConsole(text);

    counter.value += toBeAdded;
    mainCounter.value += toBeAdded;
    counter.textContent = counter.value;
    mainCounter.textContent = mainCounter.value;
}

//HANDLE CLICKING ON A TILE
const clickHandler = (event, id, div) => {
    if (removeToolEnabled) {
        stopBubble(event);
        removeTile(id);
        toggleRemove();
    }
    else addPoints(event, id, div);
}

//ADD TILE NO "ID" TO THE WEBSITE
const addTile = (id) => {
    tiles[id-1].innerHTML = "";
    tiles[id-1].classList.remove("no-tile");

    const divOuter = document.createElement("div");
    divOuter.classList.add("outer");
    divOuter.id = "outerTile" + id;
    divOuter.addEventListener("click", (event) => clickHandler(event, id, divOuter), reversePropagation);
    tiles[id-1].appendChild(divOuter);
    tiles[id-1].addEventListener("click", (event) => {
        if (removeToolEnabled) {
            stopBubble(event);
            removeTile(id);
            toggleRemove();
        }
    })

    const divMiddle = document.createElement("div");
    divMiddle.classList.add("middle");
    divMiddle.id = "middleTile" + id;
    divMiddle.addEventListener("click", (event) => clickHandler(event, id, divMiddle), reversePropagation);
    divOuter.appendChild(divMiddle);

    const divInner = document.createElement("div");
    divInner.classList.add("inner");
    divInner.id = "innerTile" + id;
    divInner.innerHTML = "T" + id;
    divInner.addEventListener("click", (event) => clickHandler(event, id, divInner), reversePropagation);
    divMiddle.appendChild(divInner);

    const counter = document.createElement("div");
    counter.classList.add("counter");
    counter.id = "counter" + id;
    counter.value = 0;
    counter.textContent = "0";
    tiles[id-1].appendChild(counter);
    counters = document.querySelectorAll(".counter");
}

//ADD EVENT LISTENER FOR "REMOVE OPTION"
remove.addEventListener("click", () => toggleRemove());

//ADD EVENT LISTENER FOR "TOGGLE PROPAGATION OPTION"
toggleProp.addEventListener("click", () => {
    fullPropagation = !fullPropagation;
    if (!fullPropagation) {
        toggleProp.classList.add("enabled");
        writeConsole("EVENT PROPAGATION: STOPPED");
    }
    else {
        toggleProp.classList.remove("enabled");
        writeConsole("EVENT PROPAGATION: RESTARTED");
    }
});

//ADD EVENT LISTENER FOR "TOGGLE DIRECTION OPTION"
toggleDir.addEventListener("click", () => {
    reversePropagation = !reversePropagation;
    if (reversePropagation) {
        toggleDir.classList.add("enabled");
        writeConsole("PROPAGATON DIRECTION: REVERSE");
    }
    else {
        toggleDir.classList.remove("enabled");
        writeConsole("PROPAGATION DIRECTON: NORMAL")
    }

    let counter, tempValue;
    for (let tile of tiles) {
        if (tile.hasChildNodes()) {
            counter = document.querySelector("#counter" + tile.id.substring(4));
            tempValue = counter.value;
            tile.innerHTML = "";

            addTile(parseInt(tile.id.substring(4)));
            counter = document.querySelector("#counter" + tile.id.substring(4));
            counter.value = tempValue;
            counter.textContent = counter.value;
        }
    }

    counters = document.querySelectorAll(".counter");
});

//ADD EVENT LISTENER FOR "RESET OPTION"
reset.addEventListener("click", () => {
    mainCounter.value = 0;
    mainCounter.textContent = mainCounter.value;

    counters.forEach(counter => {
        counter.value = 0;
        counter.textContent = counter.value;
    })

    writeConsole("RESET");
})

//*** INITIATE THE TILES ***//
for (let tile of tiles) addTile(parseInt(tile.id.substring(4)));