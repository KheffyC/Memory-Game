/*----- constants -----*/
const boardLevels = [
    {
        'easy': 4,
        'min-size': 25,
        'maxGuesses': 6
    },
    {
        'medium': 5,
        'min-size': 20,
        'maxGuesses': 10
    },
    {
        'hard': 6,
        'min-size': 16,
        'maxGuesses': 16
    }
]




/*----- app's state (variables) -----*/
let levelFinder, boardAdjuster, boardTiles


/*----- cached element references -----*/
const startButton = document.querySelector(".start-button");
const introScreen = document.querySelector(".intro-screen");
const mainScreen = document.querySelector(".main");
const board = document.querySelector(".board");
const dropdown = document.querySelector(".levels");
const guesses = document.querySelector(".guesses span")
const totalTiles = document.querySelector(".total-tiles")
const totalCorrect = document.querySelector(".correct-choice > span")
const countdownTimer = document.querySelector(".countdown-timer")

/*----- event listeners -----*/
startButton.addEventListener('click', handleStartButton)
dropdown.addEventListener('change', changeLevels)



/*----- functions -----*/
function handleStartButton(){
    introScreen.style.display = 'none'
    mainScreen.style.display = 'flex'
    document.querySelector('.header p').style.display = 'block'
    document.querySelector('.header-score').style.display = 'block'
    init()
}

function init(){
    createBoard()
    chosenTiles()
    guesses.innerText = boardAdjuster['maxGuesses'] 
    totalCorrect.innerText = 0
    countdown(3)
}

function changeLevels(){
     levelFinder = dropdown.value;
     startButton.style.visibility = "visible"
     if(dropdown.value === 'easy'){
        boardAdjuster = boardLevels[0]
     } else if (dropdown.value === 'medium'){
        boardAdjuster = boardLevels[1]
     } else if (dropdown.value === 'hard'){
        boardAdjuster = boardLevels[2]
     }
}

function createBoard(){
    // create board tiles
    let mulitplyTilesArr = new Array(boardAdjuster[`${levelFinder}`] * boardAdjuster[`${levelFinder}`])
    for (let i = 0; i < mulitplyTilesArr.length; i++){
        newTile = document.createElement('div');
        newTile.id = i;
        newTile.className = "board-tile";
        newTile.style.minHeight = `${boardAdjuster['min-size']}%`
        newTile.style.minWidth = `${boardAdjuster['min-size']}%`
        board.appendChild(newTile)
    }
    console.log(board, "board")
}

function chosenTiles(){
    let memoryTile = boardAdjuster['maxGuesses']
    let tileMax = boardAdjuster[`${dropdown.value}`] * boardAdjuster[`${dropdown.value}`]
    let chosenTileArr = []
    for (let i=0; i < memoryTile; i++){
        chosenTileArr.push(Math.floor(Math.random() * tileMax))
        i;
    }
    
    // remove all repeated random numbers
    let totalTilesChosen = [...new Set(chosenTileArr)]
    
    // update DOM with number of chosen tiles
    totalTiles.innerText = totalTilesChosen.length

    // add 'chosen' class to tile corresponding with number === id
    chosenTileArr.forEach(tile => document.getElementById(`${tile}`).classList.add('chosen'))
}

function countdown(seconds){
    countdownTimer.showModal();
    countdownTimer.innerText = "READY"
    let timerID = setInterval(function(){
        countdownTimer.innerText = seconds
        seconds--;
        if (seconds < 0){
            countdownTimer.innerText = "Go!"
            clearInterval(timerID);
            countdownTimer.close();
            addZTile(board);
            return
        }
    }, 1000)
}

function addZTile(element){
    for(let i=0; i < element.children.length; i++){
        element.children[i].classList.add("z-tile")
    }
}
