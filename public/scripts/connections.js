
    let loggedIn = false;
    if (sessionStorage.getItem("loggedIn") == 1) {
        loggedIn = true;
    } else {
        localStorage.clear();
    }
    let gameText = document.getElementById("titleGame");
    let savedGames = document.getElementById("titleSavedGames");
    let rewatch = document.getElementById("titleRewatchGame");
    let loginText = document.getElementById("titleLogin");

    gameText.addEventListener("click", function() {
        document.location = "/index.html";
    })
    gameText.classList.add("click");
    if (loggedIn) {
        savedGames.classList.remove("titleDisabled");
        savedGames.addEventListener("click", function() {
            document.location = "/savedGames.html";
        });
        savedGames.classList.add("click");
        rewatch.classList.remove("titleDisabled");
        rewatch.addEventListener("click", function() {
            document.location = "/rewatchGame.html";
        })
        rewatch.classList.add("click");
        if (localStorage.getItem("user").length > 8) {
            loginText.textContent = localStorage.getItem("user").slice(0, 8);
        } else {
            loginText.textContent = localStorage.getItem("user");
        }
        let saveGame = document.getElementById("saveGame");
        if (saveGame != null) {
            saveGame.classList.remove("loginRequire");
        }
        loginText.addEventListener("click", function() {
            document.getElementById("logout").classList.toggle("hidden");
        });
        document.getElementById("logout").addEventListener("click", function() {
            sessionStorage.setItem("loggedIn", 0);
            localStorage.clear();
            document.location = "/login.html"
        })
        loginText.classList.add("click");
    } else {
        savedGames.classList.add("titleDisabled");
        rewatch.classList.add("titleDisabled");
        loginText.addEventListener("click", function() {
            document.location = "/login.html";
        });
        loginText.classList.add("click");
    }
