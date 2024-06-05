// global variables
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let time = 0;
let intervalId;

// Initialize score display
document.querySelector(".score").textContent = score;

// Fetch card data from JSON, duplicate it, shuffle the cards, and generate them on the screen
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    console.log("Cards data:", cards); // Log cards data
    shuffleCards();
    generateCards();
  })
  .catch((error) => {
    console.error("Error loading cards data:", error);
  });

// Function to shuffle the cards
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

// Function to generate the cards on the screen
function generateCards() {
  for (let card of cards) {
    console.log("Generating card:", card); // Log each card being generated
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front"> 
        <img class="front-image" alt="image of fruit" src="${card.image}"/>
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

  score++;
  document.querySelector(".score").textContent = score;

  checkForMatch();
}

// check for card match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();

    //check if all cards have been matched
    let allCards = document.querySelectorAll(".card");
    let allCardsMatched = Array.from(allCards).every((card) =>
      card.classList.contains("disabled")
    );

    if (allCardsMatched) {
      alert("Congratulations! You've matched all of the cards!!!");
      clearInterval(intervalId);
      updateLowestScores(score);
      displayLowestScores();
    }
  } else {
    unflipCards();
  }
}

// disable cards
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  firstCard.classList.add("disabled");
  secondCard.classList.add("disabled");

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

// Starts the game, shuffles, resets the score, clears the grid, & generates new cards for the game.
function restart() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
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

// update the lowest score list
function updateLowestScores(score) {
  let lowestScores = JSON.parse(localStorage.getItem("lowestScores")) || [];
  console.log("Before update:", lowestScores);
  lowestScores.push(score);
  lowestScores = [...new Set(lowestScores)];
  lowestScores.sort((a, b) => a - b);
  if (lowestScores.length > 5) {
    lowestScores.length = 5;
  }
  console.log("After update:", lowestScores);
  localStorage.setItem("lowestScores", JSON.stringify(lowestScores));
}

// displays the scores in the list
function displayLowestScores() {
  let lowestScores = JSON.parse(localStorage.getItem("lowestScores")) || [];
  let scoreElements = document.querySelectorAll("#lowest-scores .score");

  for (let i = 0; i < 3; i++) {
    if (lowestScores[i] !== undefined) {
      scoreElements[i].textContent = `Score ${i + 1}: ${lowestScores[i]}`;
    } else {
      scoreElements[i].textContent = `Score ${i + 1}: -`;
    }
  }
}

// clear scores
function clearAllScores() {
  localStorage.removeItem("lowestScores");
  displayLowestScores();
  console.log(
    "Thats it boss, they're fineto. I took care of 'em; you don't have to worry anymore."
  );
}

//display scores when page loads
displayLowestScores();
