/*----- constants -----*/
const boardLevels = [
    {
        'boardSize': 4,
        'min-size': 25,
        'maxGuesses': 6,
        'level': 'easy'
    },
    {
        'boardSize': 5,
        'min-size': 20,
        'maxGuesses': 10,
        'level': 'medium'
    },
    {
        'boardSize': 6,
        'min-size': 16,
        'maxGuesses': 16,
        'level': 'hard'
    },
    {
        'boardSize': 7,
        'min-size': 14.2,
        'maxGuesses': 24,
        'level': 'hardest'
    },
    {
        'boardSize': 8,
        'min-size': 12.5,
        'maxGuesses': 30,
        'level': 'hardest'
    }
]




/*----- app's state (variables) -----*/
let levelFinder, nextLevel, boardAdjuster, guessCount, totalTileDenominator, countdownTimerID, timeoutID
let correctChoice = 0
let score = 0;


/*----- cached element references -----*/
const startButton = document.querySelector(".start-button");
const introScreen = document.querySelector(".intro-screen");
const enterName = document.querySelector(".enter-name input");
const difficulty = document.querySelector(".difficulty");
const mainScreen = document.querySelector(".main");
const board = document.querySelector(".board");
const dropdown = document.querySelector(".levels");
const selectedDropdown = document.querySelector(".levels:checked");
const guesses = document.querySelector(".guesses span");
const totalTiles = document.querySelector(".total-tiles");
const totalCorrect = document.querySelector(".correct-choice > span");
const countdownTimer = document.querySelector(".countdown-timer");
const gameTimer = document.querySelector(".timer > span");
const resultModal = document.querySelector(".win-lose"); 
const tryAgainButton = document.querySelector(".try-again");
const nextLevelButton = document.querySelector(".next-level");
const playerScore = document.querySelector(".header-score span");
const playerName = document.querySelector(".header > p span")



/*----- event listeners -----*/
startButton.addEventListener('click', handleStartButton)
enterName.addEventListener('change', handleName)
dropdown.addEventListener('change', handleDropdown)
board.addEventListener('click', handlePlayerClick)
resultModal.addEventListener('click', handleModal)
tryAgainButton.addEventListener('click', handleTryAgain)
nextLevelButton.addEventListener('click', handleNextLevel)


/*----- functions -----*/
function handleName(e){
    playerName.innerText = e.target.value
    enterName.disabled = true
    difficulty.style.visibility = "visible"
}

function handleStartButton(){
    introScreen.style.display = 'none'
    mainScreen.style.display = 'flex'
    document.querySelector('.header p').style.display = 'block'
    document.querySelector('.header-score').style.display = 'block'
    init()
}

function handlePlayerClick(e){
    e.preventDefault();
    let list = e.target.classList;
    
    // return statements
    if (guessCount === 0 || gameTimer.innerHTML === '00 : 00'){
        showRemainderTiles()
    }
    if(!list.contains("z-tile")) return

    // remove z-tile and update guesses/correct answers 

    if(list.contains("chosen") && list.contains("z-tile")){
        // e.target.style.backgroundColor = "purple"
        list.remove("z-tile")
        correctChoice += 1
        guessCount -= 1
        render()
    } else {
        list.remove("z-tile");
        guessCount -= 1
        render()
    }
}

function handleModal(e){
    if(e.target != document.querySelector("dialog")){
        resultModal.style.display = "none"
        resultModal.close()
        clearInterval(timeoutID)
    }
}

function handleTryAgain(){
    board.replaceChildren()
    clearInterval(timeoutID)
    correctChoice = 0
    init()
    render()
}

function handleNextLevel(){
    num === 4 ? num = 0 : num += 1;
    board.replaceChildren()
    clearInterval(timeoutID)
    correctChoice = 0
    boardAdjuster = boardLevels[num]
    init()
    render()
}

function init(){
    createBoard()
    chosenTiles()
    guessCount = boardAdjuster['maxGuesses']
    guesses.innerHTML = `${guessCount}`
    gameTimer.innerHTML = '00 : 15'
    totalCorrect.innerHTML = 0
    playerScore.innerText = `${score}`
    countdown(3)
}


function render(){
    totalCorrect.innerHTML = `${correctChoice}`
    guesses.innerHTML = `${guessCount}`
    checkWin()
}

function handleDropdown(){
     startButton.style.visibility = "visible"
     if(dropdown.value === 'easy'){
        num = 0
     } else if (dropdown.value === 'medium'){
        num = 1
     } else if (dropdown.value === 'hard'){
        num = 2
     } else if (dropdown.value === 'hardest'){
        num = 3
     } else if (dropdown.value === 'impossible'){
        num = 4
     }
     boardAdjuster = boardLevels[num]
     dropdown.disabled = true
}

function createBoard(){
    // create board tiles
    let mulitplyTilesArr = new Array(boardAdjuster['boardSize'] * boardAdjuster['boardSize'])
    for (let i = 0; i < mulitplyTilesArr.length; i++){
        newTile = document.createElement('div');
        newTile.id = i;
        newTile.className = "board-tile";
        newTile.style.minHeight = `${boardAdjuster['min-size']}%`
        newTile.style.minWidth = `${boardAdjuster['min-size']}%`
        board.appendChild(newTile)
    }
}

function chosenTiles(){
    let memoryTile = boardAdjuster['maxGuesses']
    let tileMax = boardAdjuster['boardSize'] * boardAdjuster['boardSize']
    let chosenTileArr = []
    for (let i=0; i < memoryTile; i++){
        chosenTileArr.push(Math.floor(Math.random() * tileMax))
        i;
    }
    
    // remove all repeated random numbers
    let totalTilesChosen = [...new Set(chosenTileArr)]
    totalTileDenominator = totalTilesChosen.length
    // update DOM with number of chosen tiles
    totalTiles.innerHTML = `${totalTileDenominator}`

    // add 'chosen' class to tile corresponding with number === id
    chosenTileArr.forEach(tile => document.getElementById(`${tile}`).classList.add('chosen'))
}

function countdown(seconds){
    countdownTimer.showModal();
    countdownTimer.innerText = "READY"
    countdownTimerID = setInterval(function(){
        countdownTimer.innerText = seconds
        seconds--;
        if (seconds < 0){
            clearInterval(countdownTimerID);
            countdownTimer.close();
            addZTile(board);
            timer(14);
            return
        }
    }, 1000)
}

function timer(seconds){
    timeoutID = setInterval(function(){
        if (resultModal.hasAttribute("open")){
            clearInterval(timeoutID)
        } else {
            gameTimer.innerHTML = `00 : ${seconds >= 10  ? seconds : '0' + seconds}` 
            seconds--;
            if (seconds < 0){
                clearInterval(timeoutID);
                gameTimer.innerHTML = '00 : 00'

                // only checkWin() if player hasnt lost yet
                if(!resultModal.hasAttribute("open")) checkWin();
            }
        }
    }, 1000)
}

function addZTile(element){
    for(let i=0; i < element.children.length; i++){
        element.children[i].classList.add("z-tile")
    }
}

function removeZTile(element){
    for(let i=0; i < element.children.length; i++){
        element.children[i].classList.remove("z-tile")
    }
}

function showRemainderTiles(){
    for (child of board.children){
        console.log(child)
    }
}

function checkWin(){
    // Wins
    if(correctChoice === totalTileDenominator){
        score += 1
        playerScore.innerText = `${score}`
        resultModal.showModal()
        resultModal.style.display = "flex"
        resultModal.innerHTML = `<h2>You WIN! You had ${guessCount === 1 ?  guessCount + ' guess ' : guessCount + ' guesses ' }left too! </h2><h3> Time remaining : ${gameTimer.innerHTML}</h3>`
        removeZTile(board)
        return
    }
    // Losses 
    if((guessCount === 0 && correctChoice !== totalTileDenominator) || gameTimer.innerHTML === '00 : 00'){
        resultModal.showModal()
        resultModal.style.display = "flex"
        resultModal.innerHTML = `<h2>You Lose!</h2>`;
        removeZTile(board)
        return
    }
}

