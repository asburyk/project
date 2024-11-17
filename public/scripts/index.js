
let is9 = document.getElementById("r9");
let is15 = document.getElementById("r15");
let button = document.getElementById("startButton");
button.addEventListener("click", async function(e) {
    if (is9.checked) {
        let response = await fetch(`/puzzle?size=9`);
        let serverData = await response.json();
        sessionStorage.setItem("currentSize", "9");
        sessionStorage.setItem("currentMines", JSON.stringify(serverData["placement"]));
        sessionStorage.setItem("currentMoves", JSON.stringify([]));
        
    } else if (is15.checked) {
        let response = await fetch(`/puzzle?size=15`);
        let serverData = await response.json();
        sessionStorage.setItem("currentSize", "15");
        sessionStorage.setItem("currentMines", JSON.stringify(serverData["placement"]));
        sessionStorage.setItem("currentMoves", JSON.stringify([]));
    } else {
        e.preventDefault();
    }
})
