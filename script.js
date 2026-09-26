const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the English alphabet at least once.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Your time is limited, so don't waste it living someone else's life.",
    "Programming is the art of telling another human being what one wants the computer to do. Code is read much more often than it is written.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
    "In the world of technology, change is the only constant. Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish."
];

let timer;
let timeLeft = 60;
let isPlaying = false;
let currentText = "";
let charIndex = 0;
let mistakes = 0;

const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const startBtn = document.getElementById('start-btn');
const wpmVal = document.getElementById('wpm');
const accuracyVal = document.getElementById('accuracy');
const timerVal = document.getElementById('timer');

function loadText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
    textDisplay.innerHTML = "";
    
    currentText.split("").forEach(char => {
        let span = `<span>${char}</span>`;
        textDisplay.innerHTML += span;
    });
    
    textDisplay.querySelectorAll('span')[0].classList.add('current');
}

function startTest() {
    if (isPlaying) return;
    
    isPlaying = true;
    timeLeft = 60;
    charIndex = 0;
    mistakes = 0;
    
    loadText();
    
    inputField.disabled = false;
    inputField.value = "";
    inputField.focus();
    startBtn.innerText = "RESET TEST";
    
    wpmVal.innerText = "0";
    accuracyVal.innerText = "100%";
    timerVal.innerText = timeLeft + "s";
    
    clearInterval(timer);
    timer = setInterval(initTimer, 1000);
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerVal.innerText = timeLeft + "s";
        updateStats();
    } else {
        clearInterval(timer);
        endTest();
    }
}

function updateStats() {
    // WPM calculation: (correct chars / 5) / (minutes elapsed)
    let timeElapsed = (60 - timeLeft) / 60;
    if (timeElapsed === 0) timeElapsed = 1/60; // Prevent div by zero
    
    let wpm = Math.round(((charIndex - mistakes) / 5) / timeElapsed);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    wpmVal.innerText = wpm;

    // Accuracy calculation
    let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
    accuracy = accuracy < 0 || !accuracy || accuracy === Infinity ? 100 : accuracy;
    accuracyVal.innerText = accuracy + "%";
}

function initTyping() {
    const characters = textDisplay.querySelectorAll('span');
    let typedChar = inputField.value.split("")[charIndex];

    if (charIndex < characters.length && timeLeft > 0) {
        if (typedChar == null) { // Backspace
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains('incorrect')) {
                    mistakes--;
                }
                characters[charIndex].classList.remove('correct', 'incorrect', 'current');
                characters[charIndex].classList.add('current');
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add('correct');
            } else {
                mistakes++;
                characters[charIndex].classList.add('incorrect');
            }
            characters[charIndex].classList.remove('current');
            charIndex++;
            if (charIndex < characters.length) {
                characters[charIndex].classList.add('current');
            }
        }
        updateStats();
        
        // If finished all text
        if (charIndex === characters.length) {
            clearInterval(timer);
            endTest();
        }
    }
}

function endTest() {
    inputField.disabled = true;
    startBtn.innerText = "START TEST";
    isPlaying = false;
}

startBtn.addEventListener('click', () => {
    if (startBtn.innerText === "RESET TEST") {
        clearInterval(timer);
        endTest();
        startTest();
    } else {
        startTest();
    }
});

inputField.addEventListener('input', initTyping);
// Prevent pasting
inputField.addEventListener('paste', e => e.preventDefault());
