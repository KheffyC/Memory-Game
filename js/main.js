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
        'level': 'impossible'
    }
]


/*----- app's state (variables) -----*/
let levelFinder, nextLevel, boardAdjuster, guessCount, totalTileDenominator, countdownTimerID, timeoutID
let correctChoice = 0
let score = 0


/*----- cached element references -----*/
const board = document.querySelector(".board");
const guesses = document.querySelector(".guesses span");
const totalTiles = document.querySelector(".total-tiles");
const totalCorrect = document.querySelector(".correct-choice > span");
const countdownTimer = document.querySelector(".countdown-timer");
const gameTimer = document.querySelector(".timer > span");
const resultModal = document.querySelector(".win-lose"); 
const nextLevelButton = document.querySelector(".next-level");
const playerScore = document.querySelector(".header-score span");


/*----- event listeners -----*/
document.querySelector(".start-button").addEventListener('click', handleStartButton)
document.querySelector(".enter-name input").addEventListener('change', handleName)
document.querySelector(".levels").addEventListener('change', handleDropdown)
board.addEventListener('click', handlePlayerClick)
resultModal.addEventListener('click', handleModal)
document.querySelector(".try-again").addEventListener('click', handleTryAgain)
nextLevelButton.addEventListener('click', handleNextLevel)


/*----- functions -----*/

 // handle functions
function handleStartButton(){
    // hide intro screen and reveal main game page
    document.querySelector(".intro-screen").style.display = 'none'
    document.querySelector(".main").style.display = 'flex'
    document.querySelector('.header p').style.display = 'block'
    document.querySelector('.header-score').style.display = 'block'
    init()
}

function handleName(e){
    // update player name
    document.querySelector(".header > p span").innerHTML = `<strong>${e.target.value}</strong>`

    // lock in player name and reveal level selector
    document.querySelector(".enter-name input").disabled = true
    document.querySelector(".difficulty").style.visibility = "visible"
}

function handleDropdown(){
    document.querySelector(".start-button").style.visibility = "visible"
    switch(document.querySelector(".levels").value){
        case 'easy':
            num = 0;
            break;
        case 'medium':
            num = 1;
            break;
        case 'hard':
            num = 2;
            break;
        case 'hardest':
            num = 3;
            break;
        case 'impossible':
            num = 4;
            break;
    }
    boardAdjuster = boardLevels[num]
    document.querySelector(".levels").disabled = true
}

function handlePlayerClick(e){
    e.preventDefault()
    let list = e.target.classList;
    
    // return statements for when game is over
    if (guessCount === 0) return
    if(!list.contains("z-tile")) return

    // remove z-tile and update guesses/correct answers 
    if(list.contains("chosen") && list.contains("z-tile")){
        list.add("correct")
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
    // clear board and disable nextButton if enabled
    board.replaceChildren()
    clearInterval(timeoutID)
    correctChoice = 0
    disableNextButton()

    // run new game with same tile board
    init()
    render()
}

function handleNextLevel(){
    //clear board
    board.replaceChildren()
    clearInterval(timeoutID)
    correctChoice = 0
    
    // loop back to first board if at highest level, else move to next level
    num === 4 ? num = 0 : num += 1
    boardAdjuster = boardLevels[num]

    // return nextLevelButton to disabled
    disableNextButton()
    init()
    render()
}

 // functions for initialization
function init(){
    createBoard()
    chosenTiles()
    guessCount = boardAdjuster['maxGuesses']
    guesses.innerHTML = `${guessCount}`
    gameTimer.innerHTML = '00 : 15'
    totalCorrect.innerHTML = 0
    document.querySelector(".level").innerHTML = `<p>Level <br>${num} <br> (${boardAdjuster.level.toUpperCase()})</p>`
    playerScore.innerText = `${score}`
    countdown(3)
}

function createBoard(){
    // create board tiles
    let mulitplyTilesArr = new Array(boardAdjuster['boardSize'] * boardAdjuster['boardSize'])
    for (let i = 0; i < mulitplyTilesArr.length; i++){
        newTile = document.createElement('div')
        newTile.id = i
        newTile.className = "board-tile"
        newTile.style.minHeight = `${boardAdjuster['min-size']}%`
        newTile.style.minWidth = `${boardAdjuster['min-size']}%`
        board.appendChild(newTile)
    }
}

function chosenTiles(){
    // max amount of chosen tiles cannot be more than amount of maxGuesses
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
    countdownTimer.showModal()
    countdownTimer.innerText = "READY"
    countdownTimerID = setInterval(function(){
        countdownTimer.innerText = seconds
        seconds--
        if (seconds < 0){
            clearInterval(countdownTimerID)
            countdownTimer.close()
            addZTile(board)
            timer(14)
            return
        }
    }, 1000)
}

 // functions for updating state 
function timer(seconds){
    timeoutID = setInterval(function(){
        if (resultModal.hasAttribute("open")){
            clearInterval(timeoutID)
        } else {
            gameTimer.innerHTML = `00 : ${seconds >= 10  ? seconds : '0' + seconds}` 
            seconds--
            if (seconds < 0){
                clearInterval(timeoutID)
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

function render(){
    totalCorrect.innerHTML = `${correctChoice}`
    guesses.innerHTML = `${guessCount}`
    checkWin()
}

function checkWin(){
    // Wins
    if(correctChoice === totalTileDenominator){
        score += 1
        playerScore.innerText = `${score}`
        resultModal.showModal()
        resultModal.style.display = "flex"
        resultModal.innerHTML = `<h2>You WIN!</h2><h3>  Player Score : ${score}<br> Time remaining : ${gameTimer.innerHTML}</h3>`
        removeZTile(board)

        // activate nextLevelButton
        nextLevelButton.disabled = false
        nextLevelButton.style.opacity = "1"
        nextLevelButton.classList.add("flashing")
        return
    }
    // Losses 
    if((guessCount === 0 && correctChoice !== totalTileDenominator) || gameTimer.innerHTML === '00 : 00'){
        resultModal.showModal()
        resultModal.style.display = "flex"
        resultModal.innerHTML = `<h2>You Lose!</h2>`

        // remove remaining hidden tiles and highlight the leftover tiles needed
        removeZTile(board)
        showRemainderTiles()
        return
    }
}

function removeZTile(element){
    // remove all zTiles for end of game analysis
    for(let i=0; i < element.children.length; i++){
        element.children[i].classList.remove("z-tile")
    }
}

function showRemainderTiles(){
    // add class to remaining tiles for added animation effect
    for(let child of board.children){
        if(child.classList.contains("chosen") && !child.classList.contains("correct")){
            child.classList.add("remaining-tiles")
        }
    }
}

function disableNextButton(){
    nextLevelButton.disabled = true
    nextLevelButton.style.opacity = "0.5"
    nextLevelButton.classList.remove("flashing")
}