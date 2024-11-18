function PastGame(props) {
    if (props.size > 9) {
        return React.createElement("div", {className: "pastgame click mobileRemove", onClick: function(e) {sessionStorage.setItem("rewatchId", props.id); document.location = "/rewatchGame.html"}}, 
        React.createElement("span", {className: "gameSize"}, "Game Size: " + props.size),
        React.createElement("span", {className: "gameTS"}, "Time finished: " + props.timestamp)
    )
    }
    return React.createElement("div", {className: "pastgame click", onClick: function(e) {sessionStorage.setItem("rewatchId", props.id); document.location = "/rewatchGame.html"}}, 
        React.createElement("span", {className: "gameSize"}, "Game Size: " + props.size),
        React.createElement("span", {className: "gameTS"}, "Time finished: " + props.timestamp)
    )
}

async function SavedGames() {
    let obj = {};
    obj["username"] = localStorage.getItem("user");
    obj["password"] = localStorage.getItem("pass");
    let response = await fetch(`/users/${obj["username"]}/puzzles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(obj)
    })
    let message = await response.json()
    if (!message["success"]) {
        alert("There was an error while retrieving your past games")
        document.location = "/index.html"
        return null
    }

    let games = []
    for (let i = 0; i < message["games"].length; i++) {
        games.push(React.createElement(PastGame, {id: message["games"][i]["id"], size: message["games"][i]["size"], timestamp: message["games"][i]["timestamp"]}))
    }

    return React.createElement("div", {className: "savedGamesContainer"}, games.map(v => v));
}

window.addEventListener("load", async function() {
    let root = ReactDOM.createRoot(document.getElementById("root"));
    let e = await SavedGames()
    root.render(e);
})