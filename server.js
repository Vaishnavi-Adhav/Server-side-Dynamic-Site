const express = require('express');
const cookieParser = require('cookie-parser');
const words = require('./words');
const login = require('./login');
const game = require('./game');
const {
    v4: uuidv4
} = require('uuid');

const validCharacters = /^[a-zA-Z0-9]+$/;
const disallowedUsernames = ['dog'];

const app = express();
const PORT = 3000;

const users = {};
const gameStates = {};

app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    const sid = req.cookies.sid;
    const username = users[sid];

    if (!username) {
        res.send(login.renderLoginPage());
    } else {
        if (!gameStates[username]) {
            const gameState = game.createNewGameState(words);
            gameStates[username] = gameState;
            res.send(game.renderGamePage(username, gameState));
        } else {
            res.send(game.renderGamePage(username, gameStates[username]));
        }
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username.trim();

    // Printing username for grading purpose
    console.log("UserName: " + username)

    if (!username || !username.match(validCharacters) || disallowedUsernames.includes(username)) {
        res.status(401).send(login.renderLoginPage(true, "Invalid username."));
        return;
    }

    const sid = uuidv4();
    users[sid] = username;
    res.cookie('sid', sid);
    res.redirect('/');
});

app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;
    delete users[sid];
    res.clearCookie('sid');
    res.redirect('/');
});

app.post('/guess', (req, res) => {
    const sid = req.cookies.sid;
    const username = users[sid];
    if (!username) {
        res.status(401).send(login.renderLoginPage(true, "Session expired. Please login again."));
        return;
    }
    const guess = req.body.guess.trim();
    if (!guess) {
        const errorMessage = 'Guess is required';
        const gameState = gameStates[username];
        res.status(400).send(game.renderGamePage(username, gameState, errorMessage));
    } else {
        const gameState = gameStates[username];
        const result = game.makeGuess(guess, gameState, username);
        res.send(game.renderGamePage(username, result));

    }
});

app.post('/new-game', (req, res) => {
    const sid = req.cookies.sid;
    const username = users[sid];
    if (!username) {
        res.status(401).send(login.renderLoginPage(true, "Session expired. Please login again."));
        return;
    }

    gameStates[username] = game.createNewGameState(words, username);
    res.redirect('/')
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});