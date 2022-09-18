/*----- constants -----*/
const boardObj = {
    "easy": 4,
    "medium": 5,
    "hard": 6
}



/*----- app's state (variables) -----*/




/*----- cached element references -----*/
const startButton = document.querySelector(".start-button");
const introScreen = document.querySelector(".intro-screen");
const mainScreen = document.querySelector(".main");
const board = document.querySelector(".board");




/*----- event listeners -----*/
startButton.addEventListener('click', handleStartButton)




/*----- functions -----*/
function handleStartButton(){
    introScreen.style.display = 'none'
    mainScreen.style.display = 'flex'
    document.querySelector('.header p').style.display = 'block'
    document.querySelector('.header-score').style.display = 'block'
    createBoard()
}

function createBoard(){
    // create board tiles
    let mulitplyTilesArr = new Array(boardObj['medium'] * boardObj['medium'])
    for (let i = 0; i < mulitplyTilesArr.length; i++){
        let newTile = document.createElement('div');
        newTile.id = i;
        newTile.className = "board-tile";
        console.log(i, newTile)
        board.appendChild(newTile)
    }
    console.log(board, "board")
}

createBoard()