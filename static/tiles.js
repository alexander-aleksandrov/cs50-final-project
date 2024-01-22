const button = document.getElementById("button");
const main = document.getElementsByTagName("main")[0];
const score = document.querySelector(".score");
const field = document.querySelector(".tiles");
const tiles = document.getElementsByClassName("tile");
tilesArr = Array.from(tiles);
const tilesContainer = document.getElementById("tiles");
const rules = document.querySelector(".rules");

let counter = 0;
let level = 3;
let running = false;
let round = 1;
let tilesLeft = 1;
let maxLevel = 3;
let maxRound = 1;

const start = async () => {
    await setupLevel(); 
    createNewTable();
    rules.style.display = "none";
    updateScoreUI();
    button.textContent = "Finish";
    button.classList.add("started");
};
  
const stop = () => {
    field.innerHTML = "";
    rules.style.display = "flex";
    button.textContent = "Begin";
    button.classList.remove("started");

    const data = {maxLevel: maxLevel, maxRound: maxRound};

    fetch('/record-tiles-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
};

async function setupLevel(){
    try{
        const response = await fetch('/get-tiles-level');
        const data = await response.json();
        if(data.lastLevel == 0 || data.lastRound == 0){
            level = 3;
            round = 1;
        }else{
        level = data.lastLevel;
        round = data.lastRound;
        }
    }
    catch(error){
        console.log(error);
    }
}

function updateScoreUI() {
    score.innerHTML = `Level: ${level} Round: ${round} Tiles left: ${tilesLeft}`;
    if (maxLevel < level) {
        maxLevel = level;
    }
    if (maxRound < round) {
        maxRound = round;
    }
}

function createNewTable() {
    isEventHandlingEnabled = true;
    field.innerHTML = "";
    let tileButtons = [];
    for (let i = 0; i < level*level; i++) {
      let btn = document.createElement("button");
      btn.classList.add("tile");
      btn.classList.add("lvl"+level);
      btn.innerHTML = " ";
      tileButtons.push(btn);
    }
    tilesLeft = round;
    selectTiles(tileButtons, round);
    showButtons(shuffleButtons(tileButtons));
    showSelectedTiles();
  }

// Shows selected tiles for 200ms then hides them back  
function showSelectedTiles(){
    setTimeout(() => {
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].classList.contains("tile-selected")) {
                tiles[i].classList.add("tile-shown");
            }
        }
        setTimeout(() => {
            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i].classList.contains("tile-selected")) {
                    tiles[i].classList.remove("tile-shown");
                }
            }
        }, 200);
    }, 500);
}

let isEventHandlingEnabled = true;
// Adds event listener to the container with tiles to check if the click was on the tile. if yes - checks if it was selected tile and if yes - checks if it was the last selected tile. If no - changes class to "tile-wrong" and stops the game.
tilesContainer.addEventListener("click", (e) => {
    if (!isEventHandlingEnabled){
        return;
    }else{
        const x = e.clientX;
        const y = e.clientY;
        const tile = document.elementFromPoint(x, y);
        if (tile && tile.classList.contains("tile")) {
                const button = tile;
                if (button.classList.contains("tile-selected")) {
                    button.classList.remove("tile-selected");
                    button.classList.add("tile-correct");
                    tilesLeft--;
                    updateScoreUI();
                    setTimeout(() => {
                        checkEndofRound();
                    }, 200);
                } else {
                isEventHandlingEnabled = false;
                button.classList.add("tile-wrong");
                if (round > 1) {
                    round--;
                    updateScoreUI();
                }
                setTimeout(() => {
                    button.classList.remove("tile-wrong");
                    createNewTable();
                }, 2000);
                }
            }   
    }
  
});

// Checks if there are any selected tiles left. If yes - increases to a new level and resets round to 1. If no - increases round by 1.
function checkEndofRound(){
    let selected = document.getElementsByClassName("tile-selected");
    if (selected.length == 0){
        if (isLevelOwerflow()){
            level++;
            round = 1;
        }else{
            round++; 
        }
        createNewTable();
        updateScoreUI();
    }
}

function isLevelOwerflow(){
    return round > level*level/2;
}

function selectTiles(arr, round){
    for (let i = 0; i < round; i++) {
        arr[i].classList.add("tile-selected");
    }
}

function shuffleButtons(arr) {
    for (let i = 0; i < arr.length; i++) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

function showButtons(arr) {
    for (let i =0; i < level; i++ ){
        let row = document.createElement("div");
        for (let j = 0; j < level; j++) {
            row.appendChild(arr[i*level+j]);
        }
        field.appendChild(row);
    }
  }

button.addEventListener("click", () => {
    running ? stop() : start();
    running = !running;
  });