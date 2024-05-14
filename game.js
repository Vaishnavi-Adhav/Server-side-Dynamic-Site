const header = require('./header')
const footer = require('./footer')

let totalGuesses = {};

function renderGamePage(username, gameState, errorMessage = '') {
    if (!gameState) {
        return `<p>Invalid game state. Please login again.</p>`;
    }

    let previousGuesses = "";
    for (let i = 0; i < gameState.guesses.length; i++) {
        previousGuesses = `<li class="previous-guess-entry"><span class="previous-guess">${gameState.guesses[i].word} - ${gameState.guesses[i].matchedLetters} letter(s) matched</span></li>` + previousGuesses;
    }

    let possibleWords = "";
    for (let i = 0; i < gameState.possibleWords.length; i++) {
        possibleWords += `<p class="possible-word">${gameState.possibleWords[i]}</p>`;
    }

    const guessResult = gameState.guessResult ? gameState.guessResult : '';

    const {mostRecentValidGuess = {}} = gameState;
    const [guessKey = '', guessValue = ''] = Object.entries(mostRecentValidGuess)?.[0] ?? [];


    return `
    ${header.renderHeader()}
    <main class="game-content">
        <div class="welcome-message-row">
            <span class="welcome-message">Welcome, ${username}</span>
            <form method="POST" action="/logout">
              <button type="submit" class="logout-button">Logout</button>
            </form>
        </div>
        <h1>Guess the Word</h1>
        <h2>Possible Words: </h2>
        <div class="possible-words">
            ${possibleWords}
        </div>
        <p class="guess-info">Guess the word by typing a word and clicking "Guess".</p>
        <form method="POST" action="/guess" class="guess-form">
          <label>
            Guess:
            <input type="text" name="guess" class="guess-input" ${gameState.guessResult?.includes("YOU WON") ? 'disabled' : ''}>
          </label>
          <button type="submit" class="guess-button" ${gameState.guessResult?.includes("YOU WON") ? 'disabled' : ''}>Guess</button>
          ${errorMessage ? '<p class="guess-error-message">' + errorMessage + '</p>' : ''}
        </form>
        <form method="POST" action="/new-game" class="new-game-form">
          <button type="submit" class="new-game-button">Start a new game</button>
        </form>
        <div class="game-report">
            <h2 class="game-report-title">Game Report</h2>
            <div class="game-report-content">
                    <h4 class="previous-guesses-title">Previous Guesses(recent to oldest):</h4>
                    <ul class="previous-words">
                      ${previousGuesses}
                    </ul>
                <h4 class="valid-guesses">Total Valid Guesses: <span class="report-data">${gameState.validGuessCount}</span></h4>
                <h4 class="current-guess-result">Current Guess Result: <span class="report-data ${guessResult?.includes("YOU WON") ? " win-message" : ""}">${guessResult}</span></h4>
                <h4 class="total-current-guesses">Total Correct Guesses So Far: <span class="report-data">${totalGuesses[username] ?? 0}</span></h4>
                <h4 class="most-recent-valid-guess">Most Recent Valid Guess: <span class="report-data">${guessKey ?? " "} - ${guessValue ?? " "} ${guessKey ? " letter(s) matched" : " "}</span></h4>
            </div>
        </div>
    </main>
    ${footer.renderFooter()}
  `;
}

function createNewGameState(words, username) {
    const secretWord = words[Math.floor(Math.random() * words.length)];

    // Printing secret word on console for grading purpose
    console.log("Secret Word: " + secretWord);
    const possibleWords = words.filter(word => word.length === secretWord.length);

    const previousTotalGuesses = totalGuesses[username]?.totalGuesses ?? 0;

    const gameState = {
        secretWord: secretWord,
        possibleWords,
        validGuessCount: 0,
        guesses: [],
        guessResult: null,
        mostRecentValidGuess: {},
        totalGuesses: previousTotalGuesses,
    };

    return gameState;
}

function makeGuess(guess, gameState, username) {
    const guessLowerCase = guess.toLowerCase();
    const secretWordLowerCase = gameState.secretWord.toLowerCase()
    const tempPossibleWords = [];

    for (let i = 0; i < gameState.possibleWords.length; i++) {
        tempPossibleWords[i] = gameState.possibleWords[i].toLowerCase();
    }

    const matchedLetters = matchedLetterCount(guessLowerCase, secretWordLowerCase);

    if (tempPossibleWords.includes(guessLowerCase) && !gameState.guesses.some(wordObj => wordObj.word.toLowerCase() === guess.toLowerCase())) {
        gameState.guessResult = 'Valid Guess';

        gameState.validGuessCount++;

        delete gameState.mostRecentValidGuess[Object.keys(gameState.mostRecentValidGuess)[0]];

        gameState.mostRecentValidGuess[guess] = matchedLetters;

        if (guessLowerCase === secretWordLowerCase) {
            gameState.guessResult = 'Correct Guess - ' + guess + ' --- YOU WON !!';

            totalGuesses[username] = (totalGuesses[username] ?? 0) + 1;
        } else {
            gameState.guessResult = 'Incorrect Guess - ' + guess;
        }
    }

    if (!tempPossibleWords.includes(guessLowerCase) || gameState.guesses.some(wordObj => wordObj.word.toLowerCase() === guess.toLowerCase())) {
        gameState.guessResult = 'Invalid Guess - ' + guess;
    }

    gameState.guesses.push({
        word: guess, matchedLetters
    });
    return gameState;
}

function matchedLetterCount(word, guess) {
    let commonLetters = 0;
    let letters = {};

    word = word.toLowerCase();
    guess = guess.toLowerCase();

    for (let i = 0; i < word.length; i++) {
        let currentLetter = word[i];
        if (letters[currentLetter]) {
            letters[currentLetter]++;
        } else {
            letters[currentLetter] = 1;
        }
    }

    for (let i = 0; i < guess.length; i++) {
        let currentLetter = guess[i];

        if (letters[currentLetter]) {
            commonLetters++;
            letters[currentLetter]--;
        }
    }

    return commonLetters;
}

module.exports = {renderGamePage, createNewGameState, makeGuess};
