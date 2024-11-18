import {clickTile, flagTile, createBoardWithPlacement} from "./board.js";


let moves=[]
let curMove=0

//Recreates the game board of a previous game
async function recreateBoard(usernameIn, passwordIn, gameIDIn){
    //get the saved game data
    let response = await fetch(`/users/${usernameIn}/puzzleId`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": gameIDIn,
            "username": usernameIn,
            "password": passwordIn
        })
    })

    let message = await response.json()
    if (!message["success"]) {
        alert("There was an error while retrieving your past game by id "+gameIDIn)
        document.location = "/index.html"
        return null
    }

    let size = JSON.parse(message["rewatchSize"])
    let placement=JSON.parse(message["rewatchMines"])
    moves = JSON.parse(message["rewatchMoves"])

    sessionStorage.setItem("rewatchSize", JSON.stringify(size));
    sessionStorage.setItem("rewatchMines", JSON.stringify(placement));
    sessionStorage.setItem("rewatchMoves", JSON.stringify(moves));
    curMove=0

    //Recreate the board
    let grid = []
    for (let i = 0; i < size * size; i++) {
        grid.push(React.createElement("div", {id: `x${i % size}y${Math.floor(i / size)}`,className: "cellDiv notRevealed", onContextMenu: function(e) {e.preventDefault()}}));
    }
    let container = React.createElement("div", {className: "gamegrid", style: {width: `calc(${size} * var(--cellsize))`, height:`calc(${size} * var(--cellsize))`, gridTemplateColumns: `repeat(${size}, var(--cellsize))`, gridTemplateRows: `repeat(${size}, var(--cellsize))`}}, grid.map(v => v));

    createBoardWithPlacement(size, placement, 1);
    return container;
}

function goStart() {
    createBoardWithPlacement(JSON.parse(sessionStorage.getItem("rewatchSize")), JSON.parse(sessionStorage.getItem("rewatchMines")), 1);
    curMove = 0;
}

function goBack() {
    let i = curMove;
    goStart();
    while (curMove < i - 1) {
        doNextMove();
    }
}

//Progresses by one move through the recorded moves
function doNextMove(){
    if(curMove>=moves.length) return;

    if (moves[curMove]["type"] == "reveal") {
        clickTile(moves[curMove]["x"], moves[curMove]["y"], false);
    } else {
        flagTile(moves[curMove]["x"], moves[curMove]["y"], false);
    }
    
    curMove++;
}

function goEnd() {
    while (curMove < moves.length) {
        doNextMove();
    }
}

async function recreateBoardFromStorage(){
    let root = ReactDOM.createRoot(document.getElementById("reactRoot"));
    let e = await recreateBoard(localStorage.getItem("user"),localStorage.getItem("pass"),JSON.parse(sessionStorage.getItem("rewatchId")));
    root.render(e);
    let start = document.getElementById("toStart");
    let back = document.getElementById("stepBack");
    let step = document.getElementById("step");
    let end = document.getElementById("toEnd");

    step.addEventListener("click", doNextMove)
    end.addEventListener("click", goEnd)
    start.addEventListener("click", goStart)
    back.addEventListener("click", goBack)
}

window.addEventListener("load",recreateBoardFromStorage)