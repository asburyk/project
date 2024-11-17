import {createBoard, clickTile, flagTile, createBoardWithPlacement} from "./board.js";
// let createHidden = function() { // state 0
//     return React.createElement("div", {className: "notRevealed"});
// }

// let createText = function(text) {  // text is either a number or M for a mine // state 1
//     return React.createElement("div", {className: "revealed hidden"}, React.createElement("p", {className: "cellText"}, text));
// }

// let createFlag = function() { // state 2
//     return React.createElement("div", {className: "notRevealed hidden"}, React.createElement("p", {className: "flag"}, "F"));
// }

let createUIBoard = function(size) {
    let grid = []
    for (let i = 0; i < size * size; i++) {
        grid.push(React.createElement("div", {id: `x${i % size}y${Math.floor(i / size)}`,className: "cellDiv notRevealed", onClick: function() {clickTile(Math.floor(i % size), Math.floor(i / size))}, onAuxClick: function(e) {flagTile(i % size, Math.floor(i / size)); e.preventDefault()}, onContextMenu: function(e) {e.preventDefault()}}));
    }
    let container = React.createElement("div", {className: "gamegrid", style: {width: `calc(${size} * var(--cellsize))`, height:`calc(${size} * var(--cellsize))`, gridTemplateColumns: `repeat(${size}, var(--cellsize))`, gridTemplateRows: `repeat(${size}, var(--cellsize))`}}, grid.map(v => v)); // figured out how to do inline style with https://www.pluralsight.com/resources/blog/guides/inline-styling-with-react, I'm not sure if there is a better way to do this


    createBoard(size, size, 0.05, 0);
    return container;
}

let createUIBoardWithPlacement = function(size, placement) {
    let grid = []
    for (let i = 0; i < size * size; i++) {
        grid.push(React.createElement("div", {id: `x${i % size}y${Math.floor(i / size)}`,className: "cellDiv notRevealed", onClick: function() {clickTile(Math.floor(i % size), Math.floor(i / size))}, onAuxClick: function(e) {flagTile(i % size, Math.floor(i / size)); e.preventDefault()}, onContextMenu: function(e) {e.preventDefault()}}));
    }
    let container = React.createElement("div", {className: "gamegrid", style: {width: `calc(${size} * var(--cellsize))`, height:`calc(${size} * var(--cellsize))`, gridTemplateColumns: `repeat(${size}, var(--cellsize))`, gridTemplateRows: `repeat(${size}, var(--cellsize))`}}, grid.map(v => v)); // figured out how to do inline style with https://www.pluralsight.com/resources/blog/guides/inline-styling-with-react, I'm not sure if there is a better way to do this
    createBoardWithPlacement(size, placement);
    return container;
}



// let size = 9;


// root.render(createUIBoard(size));




window.addEventListener("load", async function () {
    let root = ReactDOM.createRoot(document.getElementById("reactRoot"));
    if (sessionStorage.getItem("currentSize") > 0) {
        root.render(createUIBoardWithPlacement(sessionStorage.getItem("currentSize"), JSON.parse(sessionStorage.getItem("currentMines"))));
        await new Promise(r => setTimeout(r, 10)); // I can't find a better way to get the code to run in order
                                                   // I do not like the fact that I am struggling to find how to make code run in order
        let moves = JSON.parse(sessionStorage.getItem("currentMoves"));
        for(let i = 0; i < moves.length; i++) {
            if (moves[i]["type"] == "reveal") {
                clickTile(moves[i]["x"], moves[i]["y"]);
            } else {
                flagTile(moves[i]["x"], moves[i]["y"]);
            }
        }
    } else {
        root.render(createUIBoard(9));
    }
});

