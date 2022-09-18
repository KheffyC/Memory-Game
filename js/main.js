/*----- constants -----*/
const startButton = document.querySelector(".start-button");
const introScreen = document.querySelector(".intro-screen");
const mainScreen = document.querySelector(".main");



/*----- app's state (variables) -----*/




/*----- cached element references -----*/





/*----- event listeners -----*/
startButton.addEventListener('click', handleStartButton)




/*----- functions -----*/
function handleStartButton(){
    introScreen.style.display = 'none'
    mainScreen.style.display = 'flex'
    document.querySelector('.header p').style.display = 'block'
    document.querySelector('.header-score').style.display = 'block'
}