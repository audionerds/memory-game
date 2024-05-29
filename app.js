// global variables
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let time = 0;
let intervalId;

document.querySelector(".score").textContent = score;

// fetch gets the card information from the JSON, duplicates it and shuffles the cards and generates it on the screen
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

// shuffle function
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// create cards
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front"> 
        <img class="front-image" src="${card.image}"/>
        </div>
        <div class="back"></div>
        `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// flips the card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");

  //start stopwatch when cards clicked
  if (!firstCard && !secondCard) {
    startStopwatch();
  }

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

// check for card match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    score++;
    document.querySelector(".score").textContent = score;

    //check if all cards have been matched
    if (score === cards.length / 2) {
      alert("Congratulations! You've matched all of the cards!!!");
      clearInterval(intervalId);
    }
  } else {
    unflipCards();
  }
}

// diable cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

//unflip cards
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// reset the board to default state
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// The restart function starts the game using the resetBoard function, shuffles the cards, resets the score, clears the grid & generates new cards for the game.
function restart() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();

  // reset the stopwatch
  time = 0;
  document.getElementById("stopwatch").textContent = time;
}

// start the stopwatch
function startStopwatch() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      time++;
      document.getElementById("stopwatch").textContent = time;
    }, 1000);
  }
}
