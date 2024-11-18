let board=[]

let widthB=0
let heightB=0
let flagging=false
let minesPresent=0
let tilesRevealed=0
let mineShield=0

let acceptInput = true;

function createBoardWithPlacement(size, placement, mineShieldIn = 1) {
    widthB=size
    heightB=size
    flagging=false
    minesPresent=0
    tilesRevealed=0
    mineShield=mineShieldIn

    board = []
    for (let r =0; r < heightB; r++){
        let row=[]
        for (let c =0; c < widthB; c++){
            let tile={
                mined:false,
                checked:false,
                flagged:false,
            }
            row.push(tile)
        }
        board.push(row)
    }
    for (let r =0; r < heightB; r++){
        for (let c =0; c < widthB; c++){
            //set tile text
            changeTileText(c,r,"?");
            let tile=(board[r])[c];
            tile["tileText"]="?";
        }
    }
    for (let i = 0; i < placement.length; i++) {
        setTileMined(placement[i]["x"],placement[i]["y"],true);
    }
}

function cordsValid(xIn, yIn){
    if (xIn<0) return false
    if (xIn>widthB-1) return false
    if (yIn<0) return false
    if (yIn>heightB-1) return false
    
    return true
}
function clickTile(xIn, yIn, appending){
    if (!acceptInput)
        return;
    if(flagging){
        flagTile(xIn, yIn, appending);
        return;
    }
    let tile=(board[yIn])[xIn]
    if(tile["checked"]==true) return
    else{
        if (appending) {
            let moves = JSON.parse(sessionStorage.getItem("currentMoves"));
            moves.push({"type": "reveal", "x": xIn, "y": yIn});
            sessionStorage.setItem("currentMoves", JSON.stringify(moves));
        }
        if(mineShield>0){
            if(!cordsValid(xIn,yIn)) return

            if(isTileMined(xIn, yIn)){
                setTileMined(xIn,yIn,false)
            }
            mineShield-=1
        }

        checkTile(xIn,yIn);
    }
    if(checkWin()){
        win()
    }
}

function checkTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    if(tile["checked"]==true) return //return if tile already checked


    if(!isTileMined(xIn, yIn)) { //if the tile is not mined
        tile["checked"]=true
        tilesRevealed+=1
        let mineCount=minesNearTile(xIn,yIn)
        if(mineCount==0){
            changeTileText(xIn,yIn," ")

            //Perform a propogating check on neighboring tiles
            for (let r of [-1,0,1]){
                for (let c of [-1,0,1]){
                    let x=parseInt(xIn)+parseInt(c)
                    let y=parseInt(yIn)+parseInt(r)
                    if(!(r==0 && c==0) && cordsValid(x,y)){
                        propogatingCheckTile(x,y)
                    }
                }
            }
        }
        else{
            changeTileText(xIn,yIn,mineCount)
            tile["checked"]=true
        }
    }
    
    else{
        lose()
        changeTileText(xIn,yIn,"x")
    }
}
function flagTile(xIn,yIn, appending){
    if (!cordsValid(xIn,yIn)) return
    if (!acceptInput) return;
    let tile=(board[yIn])[xIn]
    if(tile["checked"]==true) return //return if tile already checked
    if (appending) {
        let moves = JSON.parse(sessionStorage.getItem("currentMoves"));
        moves.push({"type": "flag", "x": xIn, "y": yIn});
        sessionStorage.setItem("currentMoves", JSON.stringify(moves));
    }

    if(tile["flagged"]) {
        tile["flagged"] = false;
        changeTileText(xIn,yIn,"?")
    } else {
        changeTileText(xIn,yIn,"f")
        tile["flagged"] = true;
    }
}
function propogatingCheckTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return 

    let tile=(board[yIn])[xIn]
    
    if(tile["checked"]==true) return //return if tile already checked

    checkTile(xIn,yIn)
}

function minesNearTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return 0

    let mineCount=0
    for (let r of [-1,0,1]){
        for (let c of [-1,0,1]){
            if(isTileMined(parseInt(xIn)+parseInt(c), parseInt(yIn)+parseInt(r))) mineCount+=1
        }
    }
    return mineCount
}

function isTileMined(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]

    return tile["mined"]
}

function setTileMined(xIn,yIn,minedIn=true){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    let oldValue=tile["mined"]

    tile["mined"]=minedIn

    if(!oldValue && minedIn){ //if the tile went from not mined to mined
        minesPresent+=1 //add to the number of mines present
    }
    else if(oldValue && !minedIn){ //if the tile went from mined to not mined
        minesPresent-=1 //subtract from the number of mines present
    }

}

function changeTileText(xIn,yIn,textIn){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    tile["tileText"]=textIn

    let uiElement = document.getElementById("x"+xIn+"y"+yIn)
    if(uiElement==null) {
        return
    }

    if(textIn=="?"){ //"?" = unrevealed tile
        uiElement.textContent=""
        uiElement.className="cellDiv notRevealed click"
    }
    else if(textIn==" "){ //" " = revealed tile
        uiElement.textContent=""
        uiElement.className="cellDiv revealed"
    }
    else if(textIn=="m"){ //"m" = mine
        uiElement.textContent="x"
        uiElement.className="cellDiv revealed"
    }
    else if(textIn=="x"){ //"x" = tripped mine
        uiElement.textContent="x"
        uiElement.className="cellDiv trippedMine"
    }
    else if(textIn=="f"){ //"f" = flagged
        uiElement.textContent="F"
        uiElement.className="cellDiv notRevealed flagged click"
    }
    else if(!isNaN(parseInt(textIn))){ //"*number*" = tile near mine
        uiElement.textContent=textIn
        uiElement.className="cellDiv revealed num"+textIn
    }
}


function checkWin(){
    return tilesRevealed+minesPresent>=widthB*heightB
}

function win(){
    if (document.getElementById("step") != null) {
        for (let r =0; r < heightB; r++){
            for (let c =0; c < widthB; c++){
                if(isTileMined(c,r)){
                    changeTileText(c,r,"f")
                }
                document.getElementById("x"+c+"y"+r).classList.remove("click");
            }
        }
        return;
    }
    sessionStorage.setItem("size", sessionStorage.getItem("currentSize"));
    sessionStorage.setItem("mines", sessionStorage.getItem("currentMines"));
    sessionStorage.setItem("moves", sessionStorage.getItem("currentMoves"));
    sessionStorage.removeItem("currentMoves");
    sessionStorage.removeItem("currentSize");
    sessionStorage.removeItem("currentMines");
    acceptInput = false;
    for (let r =0; r < heightB; r++){
        for (let c =0; c < widthB; c++){
            if(isTileMined(c,r)){
                changeTileText(c,r,"f")
            }
            document.getElementById("x"+c+"y"+r).classList.remove("click");
        }
    }
    document.getElementById("saveGame").classList.remove("hidden");
    let gt = document.getElementById("gameText");
    gt.textContent = "You Win!";
    gt.classList.add("winText");
    gt.classList.remove("hidden");
}

function lose(){
    if (document.getElementById("step") != null) { // this shouldn't happen because we don't save lost games
        for (let r =0; r < heightB; r++){
            for (let c =0; c < widthB; c++){
                if(isTileMined(c,r)){
                    changeTileText(c,r,"m")
                }
                document.getElementById("x"+c+"y"+r).classList.remove("click");
            }
        }
        return;
    }
    sessionStorage.removeItem("currentMoves");
    sessionStorage.removeItem("currentSize");
    sessionStorage.removeItem("currentMines");
    acceptInput = false;
    for (let r =0; r < heightB; r++){
        for (let c =0; c < widthB; c++){
            if(isTileMined(c,r)){
                changeTileText(c,r,"m")
            }
            document.getElementById("x"+c+"y"+r).classList.remove("click");
        }
    }
    let gt = document.getElementById("gameText");
    gt.textContent = "You Lose!";
    gt.classList.add("loseText");
    gt.classList.remove("hidden");
}

window.addEventListener("load", function() {
    let flagtool = document.getElementById("flagging");
    if (flagtool != null) {
        flagtool.addEventListener("change", function() {
            flagging = flagtool.checked;
        })
    }
})

export {createBoardWithPlacement, clickTile, flagTile, revealBoard}

