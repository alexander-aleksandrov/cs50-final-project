const button = document.getElementById("button");
const main = document.getElementsByTagName("main")[0];
const score = document.querySelector(".score");
const field = document.querySelector(".tiles");
const tiles = document.getElementsByClassName("tile");
tilesArr = Array.from(tiles);

let counter = 0;
let level = 3;
let running = false;
let round = 1;
let tilesLeft = 1;

const start = () => {
    createNewTable();
    score.innerHTML = `Level: ${level} Round: ${round} Tiles left: ${tilesLeft}`;
    button.textContent = "Finish";
    button.classList.add("started");
  };
  
const stop = () => {

};

function createNewTable() {
    field.innerHTML = "";
    let tileButtons = [];
    for (let i = 0; i < level*level; i++) {
      let btn = document.createElement("button");
      btn.classList.add("tile");
      btn.classList.add("lvl"+level);
      btn.innerHTML = " ";
      tileButtons.push(btn);
    }
    selectTiles(tileButtons, round);
    showButtons(shuffleButtons(tileButtons));
    showSelectedTiles();
  }

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

tilesArr.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("tile-selected")) {
        button.classList.remove("tile-selected");
        button.classList.add("tile-correct");
        checkEndofRound();
      } else {
        button.classList.add("tile-wrong");
        stop();
      }
    });
  });


function checkEndofRound(){
    let selected = document.getElementsByClassName("tile-selected");
    if (selected.length == 0){
        if (isLevelOwerflow()){
            level++;
            round = 1;
            createNewTable();
        }else{
            round++; 
            createNewTable();
        }
    }else{
        updateTilesLeft();
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