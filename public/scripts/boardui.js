import {clickTile, flagTile, createBoardWithPlacement} from "./board.js";

function Board(props) {
    let grid = []
    for (let i = 0; i < props.size * props.size; i++) {
        grid.push(React.createElement("div", {id: `x${i % props.size}y${Math.floor(i / props.size)}`,className: "cellDiv notRevealed click", onClick: function() {clickTile(Math.floor(i % props.size), Math.floor(i / props.size), true)}, onAuxClick: function(e) {flagTile(i % props.size, Math.floor(i / props.size), true); e.preventDefault()}, onContextMenu: function(e) {e.preventDefault()}}));
    }
    let container = React.createElement("div", {className: "gamegrid", style: {width: `calc(${props.size} * var(--cellsize))`, height:`calc(${props.size} * var(--cellsize))`, gridTemplateColumns: `repeat(${props.size}, var(--cellsize))`, gridTemplateRows: `repeat(${props.size}, var(--cellsize))`}}, grid.map(v => v)); // figured out how to do inline style with https://www.pluralsight.com/resources/blog/guides/inline-styling-with-react, I'm not sure if there is a better way to do this
    createBoardWithPlacement(props.size, props.placement);
    React.useEffect(function () { // these were helpful: https://legacy.reactjs.org/docs/components-and-props.html https://stackoverflow.com/questions/50497599/incorrect-casing-error-with-dynamically-rendered-component-in-react https://react.dev/reference/react/useEffect
        let moves = JSON.parse(sessionStorage.getItem("currentMoves"));
        for(let i = 0; i < moves.length; i++) {
            if (moves[i]["type"] == "reveal") {
                clickTile(moves[i]["x"], moves[i]["y"], false);
            } else {
                flagTile(moves[i]["x"], moves[i]["y"], false);
            }
        }
    }, []);
    return container;
}





window.addEventListener("load", async function () {
    let root = ReactDOM.createRoot(document.getElementById("reactRoot"));
    let saved = false;
    if (sessionStorage.getItem("currentSize") > 0) {
        root.render(React.createElement(Board, {size: sessionStorage.getItem("currentSize"), placement:JSON.parse(sessionStorage.getItem("currentMines"))}));
        document.getElementById("newGame").addEventListener("click", function() {
            sessionStorage.removeItem("currentMoves");
            sessionStorage.removeItem("currentSize");
            sessionStorage.removeItem("currentMines");
            document.location = "/index.html";
        });
        document.getElementById("saveGame").addEventListener("click", async function() {
            if (saved) {
                return;
            }
            let obj = {};
            obj["username"] = localStorage.getItem("user");
            obj["password"] = localStorage.getItem("pass");
            obj["currentSize"] = sessionStorage.getItem("size");
            obj["currentMines"] = sessionStorage.getItem("mines");
            obj["currentMoves"] = sessionStorage.getItem("moves");
            let response = await fetch(`/users/${obj["username"]}/puzzle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(obj)
            })
            let message = await response.json()
            if (message["success"] == 0) {
                alert("Save unsuccessful");
            } else {
                alert("Save successful");
                saved = true;
            }
        })
    } else {
        window.location = "/index.html";
    }
});

