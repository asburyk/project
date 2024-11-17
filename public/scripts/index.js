
let is9 = document.getElementById("r9");
let is15 = document.getElementById("r15");
let button = document.getElementById("startButton");
button.addEventListener("click", async function() {
    if (is9.checked) {
        let response = await fetch(`/puzzle?size=9`);
        let serverData = await response.json()
        sessionStorage.setItem("currentSize", "9");
        sessionStorage.setItem("currentMines", JSON.stringify(serverData["placement"]));
        sessionStorage.setItem("currentMoves", JSON.stringify([]));
        window.location = "/game.html";
        
        
        
    } else if (is15.checked) {
        let response = await fetch(`/puzzle?size=15`);
        let serverData = await response.json()
        sessionStorage.setItem("currentSize", "15");
        sessionStorage.setItem("currentMines", JSON.stringify(serverData["placement"]));
        sessionStorage.setItem("currentMoves", JSON.stringify([]));
        window.location = "/game.html";
        
    }
})

if (sessionStorage.getItem("currentSize") > 0) {
    window.location = "/game.html"; // I kindof unrelatedly found this was a thing from here: https://stackoverflow.com/questions/14867558/including-both-href-and-onclick-to-html-a-tag
}
