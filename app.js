const WORD_LIST = [
  "CHRIS",
  "CLOCK",
  "ABOUT",
  "HANDS",
  "TRAIN",
  "BRETT",
  "STOPS",
  "GREAT",
  "SUPER",
  "ABBEY",
  "ALLOY",
  "BURST",
  "CHOIR",
  "DEBIT",
  "EAGER",
  "FALSE",
  "FIERY",
  "GHOST",
  "GLASS",
  "HAPPY",
  "IRONY",
  "JAPAN",
  "JUICE",
  "KNOWN",
  "MASON",
];
class PastGuess {
  constructor(letters, classes) {
    this.letters = letters;
    this.classes = classes;
  }
}

function getRandomWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

function render() {
  const gameBoard = document.getElementById("wordle-board");
  gameBoard.textContent = "";

  for (let guess of gameState.pastGuesses) {
    gameBoard.insertAdjacentHTML("beforeend", `
    <div class="word-attempt">
      <div class="word-attempt-letter ${guess.classes[0]}">${guess.letters[0]}</div>
      <div class="word-attempt-letter ${guess.classes[1]}">${guess.letters[1]}</div>
      <div class="word-attempt-letter ${guess.classes[2]}">${guess.letters[2]}</div>
      <div class="word-attempt-letter ${guess.classes[3]}">${guess.letters[3]}</div>
      <div class="word-attempt-letter ${guess.classes[4]}">${guess.letters[4]}</div>
    </div>
    `);
  }

  if (!gameState.gameOver) {
    gameBoard.insertAdjacentHTML("beforeend", `
    <div class="word-attempt input">
      <div class="word-attempt-letter">${gameState.currentGuessLetters[0] ?? "_"}</div>
      <div class="word-attempt-letter">${gameState.currentGuessLetters[1] ?? "_"}</div>
      <div class="word-attempt-letter">${gameState.currentGuessLetters[2] ?? "_"}</div>
      <div class="word-attempt-letter">${gameState.currentGuessLetters[3] ?? "_"}</div>
      <div class="word-attempt-letter">${gameState.currentGuessLetters[4] ?? "_"}</div>
    </div>
    `);
  } else {
    gameBoard.insertAdjacentHTML("afterbegin", `
      <button class="reset-game" type="button">Reset</button>
    `);
  }
}
// new PastGuess("XYZAB", ["letter-correct", "letter-partial-correct", "", "", ""]);

const gameState = {
  secretWord: "",
  pastGuesses: [
  ],
  currentGuessLetters: [],
  gameOver: false,
};

function submitGuess() {
  const guessWord = gameState.currentGuessLetters.join("");
  const comparisonResult = compareWords(guessWord, gameState.secretWord);
  gameState.pastGuesses.push(
    new PastGuess(gameState.currentGuessLetters, comparisonResult)
    );

  if (guessWord == gameState.secretWord) {
    gameState.gameOver = true;
  }

  gameState.currentGuessLetters = [];
}

function compareWords(testWord, answerWord) {
  const testLettersUsed = [false, false, false, false, false];
  const answerLettersUsed = [false, false, false, false, false];
  const result = ["", "", "", "", ""];

  // first pass: correct letters
  // O(n) time
  for (let i = 0; i < 5; i++) {
    if (testWord[i] == answerWord[i]) {
      testLettersUsed[i] = true;
      answerLettersUsed[i] = true;
      result[i] = "letter-correct";
    }
  }

  // second pass: misplaced correct letters
  // O(n^2) time
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (testWord[i] == answerWord[j]
        && !testLettersUsed[i]
        && !answerLettersUsed[j]) {
        testLettersUsed[i] = true;
        answerLettersUsed[j] = true;
        result [i] = "letter-partial-correct";
      }
    }
  }

  return result;
}

function handleInput(letter) {
  if (gameState.gameOver) {
    return;
  }

  if (gameState.currentGuessLetters.length < 5) {
    gameState.currentGuessLetters.push(letter);
  }

  if (gameState.currentGuessLetters.length == 5) {
    submitGuess();
  }
}

function resetGame() {
  gameState.secretWord = getRandomWord();
  gameState.pastGuesses = [];
  gameState.gameOver = false;
  gameState.currentGuessLetters = [];
  // console.log("The new secret word is: " + gameState.secretWord);
}

document.addEventListener("keydown", (event) => {
  if (event.key >= 'a' && event.key <= 'z') {
    handleInput(event.key.toUpperCase());
    render();
  }
  if (event.key == "Enter") {
    // do something
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("reset-game")) {
    resetGame();
    render();
  }
});

setInterval(() => {
  const focusElem = document.getElementById("focus-caller");
  focusElem.textContent = "";
  if (!document.hasFocus()) {
    focusElem.insertAdjacentHTML("afterbegin", `
      <h1 class="focus-message">Please click here to resume play</h1>
    `);
  }
}, 300);

gameState.secretWord = getRandomWord();
// console.log("The secret word is: " + gameState.secretWord);
render();