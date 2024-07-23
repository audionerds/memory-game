const gameContainer = document.getElementById("game");
const svgBackground = "url(cardback.svg)";
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

/* here is a helper function to shuffle an array
 it returns the same array with values shuffled
 it is based on an algorithm called Fisher Yates if you want ot research more */
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter); // Pick a random index
    counter--; // Decrease counter by 1

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

/* this function loops over the array of colors
 it creates a new div and gives it a class with the value of the color
 it also adds an event listener for a click for each card */
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    newDiv.classList.add(color); // give it a class attribute for the value we are looping over
    newDiv.addEventListener("click", handleCardClick); // call a function handleCardClick when a div is clicked on
    gameContainer.append(newDiv); // append the div to the element with an id of game
  }
}

let firstCard = null; // keeps track of the first card flipped
let lockBoard = false; // locks the board preventing clicks
let matchedCardsCount = 0;
let score = 0;
// TODO: Implement this function!
function handleCardClick(event) {
  if (lockBoard) return; //prevents action if the board is locked
  // if (currentCard === firstCard) return; // Prevent score increment if the same card is clicked
  startTimer();
  console.log("you just clicked", event.target);

  const currentCard = event.target;
  const color = currentCard.className;

  currentCard.style.backgroundColor = color;
  currentCard.style.backgroundImage = "none";
  currentCard.classList.add("flipped");

  if (firstCard && firstCard === currentCard) {
    console.log("Same Card Clicked Twice");
    return;
  }

  if (!firstCard) {
    //if no card has been flipped set the clicked card as the firstCard
    firstCard = currentCard;
  } else {
    //if this is the second card compare it with the first
    if (firstCard.className === currentCard.className) {
      matchedCardsCount += 2; //update matched card count
      console.log("Match Found!"); // log match found if classNames match
      firstCard.classList.add("matched"); // add the "matched" class
      currentCard.classList.add("matched"); // add the "matched" class
      firstCard = null; // reset the first card for next turn
      score++; // Increment score for each match attempt
      updateScoreDisplay();
      if (matchedCardsCount === COLORS.length) {
        stopTimer();
        setTimeout(function () {
          alert("Congratulations! You've Matched All Cards!");
        }, 250);
      }
    } else {
      // if no match removes flipped class after a small delay
      console.log("No Match!"); // if not match log no match
      lockBoard = true; // lock the game board to prevent clicking
      score++; // Increment score for each match attempt
      updateScoreDisplay();
      // resets backgroundColor and classLists. Unlocks the board and resets firstCard to no value
      setTimeout(() => {
        firstCard = null; //reset the first card for next turn
        currentCard = null;
        lockBoard = false; // unlocks the gameboard
      }, 1000);
    }
  }
}

document.getElementById("restartButton").addEventListener("click", restartGame);

// when the DOM loads
createDivsForColors(shuffledColors);

let timer = 0;
let timerInterval = null;
let gameStarted = false;

function startTimer() {
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(() => {
      timer++;
      document.getElementById("timerDisplay").innerText =
        `Time: ${timer} seconds`;
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  gameStarted = false;
}

function restartGame() {
  gameContainer.innerHTML = ""; //clear the game container

  //reset game variables
  firstCard = null;
  currentCard = null;
  lockBoard = false;
  matchedCardsCount = 0; //restarts matched pair count
  resetScore(); //resets the score display
  timer = 0; //reset the timer
  document.getElementById("timerDisplay").innerText = `Time: ${timer} seconds`; //reset the timer display
  gameStarted = false; //restart the gameStarted indicator.
  let shuffledColors = shuffle(COLORS); // shuffle the colors
  createDivsForColors(shuffledColors); //create the board
  stopTimer();
}

function updateScoreDisplay() {
  document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
}

function resetScore() {
  score = 0; //reset score to 0
  updateScoreDisplay(); // update the score display
}
