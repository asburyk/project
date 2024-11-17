let board=[]

let widthB=0
let heightB=0
let flagging=false
let minesPresent=0
let tilesRevealed=0
let mineShield=0

let acceptInput = true;

function revealBoard() {
    return board;
}

function createBoard(widthIn, heightIn, mineChanceIn=0.1, mineShieldIn=1){
    widthB=widthIn
    heightB=heightIn
    flagging=false
    minesPresent=0
    tilesRevealed=0
    mineShield=mineShieldIn

    board = []
    for (let r =0; r < heightB; r++){
    // for (r in arrayRange(0, heightIn)){
        let row=[]
        for (let c =0; c < widthB; c++){
        // for (c in arrayRange(0, widthIn)){
            let tile={
                mined:false,
                checked:false,
                flagged:false,
                //halfChecked:false,
                //tileText:"?"
            }
            row.push(tile)
        }
        board.push(row)
    }

    let placement = []

    for (let r =0; r < heightB; r++){
        for (let c =0; c < widthB; c++){
            //set tile text
            //changeTileText(c,r,"?")
            let tile=(board[r])[c];
            tile["tileText"]="?";
            //Randomly set tile as mine
            let mineRoll=Math.random()
            if(mineRoll < mineChanceIn){
                console.log("randomly setting tile("+c+","+r+") as mined")
                setTileMined(c,r,true)
                placement.push({"x": c, "y": r});
            }
        }
    }

    sessionStorage.setItem("currentMines", JSON.stringify(placement));
    console.log(boardAsString())
}

function createBoardWithPlacement(size, placement, mineShieldIn = 1) {
    widthB=size
    heightB=size
    flagging=false
    minesPresent=0
    tilesRevealed=0
    mineShield=mineShieldIn

    board = []
    for (let r =0; r < heightB; r++){
    // for (r in arrayRange(0, heightIn)){
        let row=[]
        for (let c =0; c < widthB; c++){
        // for (c in arrayRange(0, widthIn)){
            let tile={
                mined:false,
                checked:false,
                flagged:false,
                //halfChecked:false,
                //tileText:"?"
            }
            row.push(tile)
        }
        board.push(row)
    }
    for (let r =0; r < heightB; r++){
        for (let c =0; c < widthB; c++){
            //set tile text
            //changeTileText(c,r,"?");
            let tile=(board[r])[c];
            tile["tileText"]="?";
        }
    }
    for (let i = 0; i < placement.length; i++) {
        setTileMined(placement[i]["x"],placement[i]["y"],true);
    }
}

function cordsValid(xIn, yIn){
    //console.log("checking if cord("+xIn+","+yIn+") is valid")
    if (xIn<0) return false
    if (xIn>widthB-1) return false
    if (yIn<0) return false
    if (yIn>heightB-1) return false
    
    //console.log("cord("+xIn+","+yIn+") is valid")
    return true
}
function clickTile(xIn, yIn, appending){
    if (!acceptInput)
        return;
    if(flagging){
        flagTile(xIn, yIn, appending);
    }
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
                //mineShield-=1
                //console.log("mine shield consumed, "+mineShield+" charges remain")
            }
            mineShield-=1
            console.log("mine shield consumed, "+mineShield+" charges remain")
        }

        checkTile(xIn,yIn);
        console.log("\n\ncheckedtile\n\n");
    }
    console.log(boardAsString())
    //let tile=(board[yIn])[xIn]
    //console.log("text of cord("+xIn+","+yIn+"): "+tile["tileText"])

    console.log("tiles revealed: "+tilesRevealed+", tiles remaining: "+(widthB*heightB-tilesRevealed-minesPresent))
    if(checkWin()){
        win()
    }
}

function checkTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    if(tile["checked"]==true) return //return if tile already checked

    console.log("\n\nihfdsigfdsns\n\n");

    if(!isTileMined(xIn, yIn)) { //if the tile is not mined
        tile["checked"]=true
        tilesRevealed+=1
        //TODO: Insert code for visualy updating to show a blank space
        let mineCount=minesNearTile(xIn,yIn)
        //console.log("mines near cord("+xIn+","+yIn+"): "+mineCount)
        if(mineCount==0){
            //console.log("no mines near by, proceeding with propogation")
            changeTileText(xIn,yIn," ") //tile["tileText"]=" "
            // console.log("text of cord("+xIn+","+yIn+"): "+tile["tileText"])

            //Perform a propogating check on neighboring tiles
            for (let r of [-1,0,1]){
                for (let c of [-1,0,1]){
                    let x=parseInt(xIn)+parseInt(c)
                    let y=parseInt(yIn)+parseInt(r)
                    //console.log("preparing propogating check on cord("+x+","+y+")")
                    if(!(r==0 && c==0) && cordsValid(x,y)){
                        propogatingCheckTile(x,y)
                    }
                }
            }
        }
        else{
            changeTileText(xIn,yIn,mineCount)//tile["tileText"]=mineCount
            tile["checked"]=true
        }

        // tile["checked"]=true
        // //TODO: Insert code for visualy updating to show a blank space 
        // tile["tileText"]=" "

        // //Perform a propogating check on neighboring tiles
        // for (let r of [-1,0,1]){
        //     for (let c of [-1,0,1]){
        //         x=parseInt(xIn)+parseInt(c)
        //         y=parseInt(yIn)+parseInt(r)
        //         //console.log("preparing propogating check on cord("+x+","+y+")")
        //         if(!(r==0 && c==0) && cordsValid(x,y)){
        //             propogatingCheckTile(x,y)
        //         }
        //     }
        // }
    }
    
    else{
        //TODO: Insert code for what happens if you click on a mine and lose
        //changeTileText(xIn,yIn,"x")//tile["tileText"]="x"
        lose()
        changeTileText(xIn,yIn,"x")
    }
    //console.log("text of cord("+xIn+","+yIn+"): "+tile["tileText"])
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
/*
function halfCheckTile(xIn,yIn,mineCount){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    if(tile["checked"]==true) return //return if tile already checked
    if(tile["halfChecked"]==true) return //return if tile already half-checked

    tile["halfChecked"]=true

    //TODO: Insert code for setting the tile to show the number of mines near it
    tile["tileText"]=mineCount
}
*/
function propogatingCheckTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return 

    let tile=(board[yIn])[xIn]
    
    if(tile["checked"]==true) return //return if tile already checked
    //if(tile["halfChecked"]==true) return //return if tile already half-checked

    // mineCount=minesNearTile(xIn,yIn)
    // if(mineCount>0) { //if there are mines near the tile
    //     halfCheckTile(xIn,yIn,mineCount)
    // }

    // else{ //otherwise the tile is safe, so reveal it
    //     checkTile(xIn,yIn)
    // }

    checkTile(xIn,yIn)
}

function minesNearTile(xIn,yIn){
    if (!cordsValid(xIn,yIn)) return 0

    let mineCount=0
    for (let r of [-1,0,1]){
        for (let c of [-1,0,1]){
            //if(isTileMined(+xIn + +c, +yIn+ +r)) mineCount+=1
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
    //tile["tileText"]="m"

    if(!oldValue && minedIn){ //if the tile went from not mined to mined
        minesPresent+=1 //add to the number of mines present
    }
    else if(oldValue && !minedIn){ //if the tile went from mined to not mined
        minesPresent-=1 //subtract from the number of mines present
    }

    //console.log("tile mined status: "+tile["mined"])
    //console.log(boardAsString())
}

function changeTileText(xIn,yIn,textIn){
    if (!cordsValid(xIn,yIn)) return

    let tile=(board[yIn])[xIn]
    tile["tileText"]=textIn

    let uiElement = document.getElementById("x"+xIn+"y"+yIn)
    if(uiElement==null) {
        console.log("ui element at cord("+xIn+","+yIn+") does not exist")
        return
    }

    //TODO: change the ui element of the tile based on tileText
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

function boardAsString(){
    let strOut=""

    strOut+="   "
    for (let c =0; c < widthB; c++){
        strOut+= c+ " "
    }
    strOut+="\n"

    for (let r =0; r < heightB; r++){
    //for (r in Range(0, heightB)){
        let row=r+"| "
        for (let c =0; c < widthB; c++){
        //for (c in Range(0, widthB)){
            let tile=(board[r])[c]
            row=row+tile["tileText"]+" "
        }
        strOut=strOut+row+"|\n"
    }
    return strOut
}

function checkWin(){
    return tilesRevealed+minesPresent>=widthB*heightB
}

function win(){
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
}

function lose(){
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
}

//console.log("Starting Test")
//createBoard(10,10,0.05)
//setTileMined(1,4)
// setTileMined(6,8)
// setTileMined(4,2)
// setTileMined(5,1)
// setTileMined(6,3)

window.addEventListener("load", function() {
    let flagtool = document.getElementById("flagging");
    flagtool.addEventListener("change", function() {
        flagging = flagtool.checked;
    })
    window.revealBoard = revealBoard;
})

export {createBoard, createBoardWithPlacement, clickTile, flagTile, revealBoard}

