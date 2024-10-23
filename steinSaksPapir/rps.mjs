//#region 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion
import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import GAME_DICTIONARY from './dictionary.mjs';

const CHOICES = { rock: 1, paper: 2, scissors: 3 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors];

let language = 'en'; // Default language

async function getLanguageChoice() {
    print("Choose language (en/no): ");
    const lang = (await rl.question("")).trim();
    if (GAME_DICTIONARY[lang]) {
        language = lang;
    } else {
        print("Invalid choice. Defaulting to English.");
    }
    startMenu();
}

async function startMenu() {
    print(ANSI.CLEAR_SCREEN);
    print(GAME_DICTIONARY[language].title, ANSI.COLOR.RED);
    print(`${GAME_DICTIONARY[language].startoption}\n ${GAME_DICTIONARY[language].exitoption}`);
    const option = (await rl.question("Choose an option: ")).trim();
    if (option === '1') {
        await startGame();
    } else {
        exitGame();
    }
}

async function startGame() {
    let player = await askForPlayerChoice();
    let npc = makeAIChoice();
    print(`${GAME_DICTIONARY[language].youPicked} ${getDesc(player)} ${GAME_DICTIONARY[language].aiPicked} ${getDesc(npc)}`);
    print(GAME_DICTIONARY[language].winner + evaluateWinner(player, npc));
    await playAgain();
}

async function playAgain() {
    const playAgainChoice = (await rl.question(GAME_DICTIONARY[language].playAgain + GAME_DICTIONARY[language].yesorno)).trim().toLowerCase();
    if (playAgainChoice === 'yes' || playAgainChoice === 'ja') {
        await startGame();
    } else {
        exitGame();
    }
}

function exitGame() {
    print(GAME_DICTIONARY[language].exit);
    rl.close();
}

function evaluateWinner(p1Ch, p2Ch) {
    let result = GAME_DICTIONARY[language].player2;
    if (p1Ch == p2Ch) {
        result = GAME_DICTIONARY[language].draw;
    } else if (p1Ch == CHOICES.rock && p2Ch == CHOICES.scissors || p1Ch == CHOICES.paper && p2Ch == CHOICES.rock || p1Ch == CHOICES.scissors && p2Ch == CHOICES.paper) {
        result = GAME_DICTIONARY[language].player1;
    }
    return result;
}

function makeAIChoice() {
    return getRandomItemFromArray(LIST_OF_CHOICES);
}

function getDesc(choice) {
    return GAME_DICTIONARY[language].choices[choice - 1];
}

async function askForPlayerChoice() {
    let choice = null;
    do {
        print(GAME_DICTIONARY[language].selectionQuestion);
        let rawChoice = (await rl.question("")).toUpperCase();
        choice = evaluatePlayerChoice(rawChoice);
    } while (choice == null);
    return choice;
}

function evaluatePlayerChoice(rawChoice) {
    if (rawChoice == GAME_DICTIONARY[language].rock) {
        return CHOICES.rock;
    } else if (rawChoice == GAME_DICTIONARY[language].paper) {
        return CHOICES.paper;
    } else if (rawChoice == GAME_DICTIONARY[language].scissors) {
        return CHOICES.scissors;
    } else {
        return null;
    }
}

getLanguageChoice();
