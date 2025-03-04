// Flashcard System
const flashcards = document.getElementById('flashcards');
const vocabulary = vocabularyData.citizenship.basic; // Example category
let currentCardIndex = 0;

function loadFlashcard() {
    const card = vocabulary[currentCardIndex];
    flashcards.innerHTML = `
        <div classflashcard">
            <p classword">${card.word}</p>
           <button="showTranslation()">Show Translation</button            <p classtranslation" style="display: none;">${card.translation}</p>
           <audio idaudio" src="${card.audio}"></audio            <button="playAudio()">Play Pronunciation</button        </div>
 `;
}

function showTranslation() {
    document.querySelector('.translation').style.display = 'block';
}

function playAudio() {
    document.getElementById('audio').play();
}

function nextFlashcard() {
    currentCardIndex = (currentCardIndex + 1) % vocabulary.length;
    loadFlashcard();
}

// Initialize Flashcards
loadFlashcard();

// Quiz System
const quizContainer = document.getElementById('quiz');
const quizData = a2TestPrep.listening[0].questions; // Example quiz
let currentQuestionIndex = 0;
let score = 0;

function loadQuiz() {
    const question = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <div classquiz-question">
            <p>${question}</p>
           question.options.map((option, index) => `
                <button="checkAnswer(${index})">${option}</button            `).join('')}
        </div>
 `;
}

function checkAnswer(selectedIndex) {
    const question = quizData[currentQuestionIndex];
    if (selectedIndex === question.correct) {
        score++;
        alert('Correct!');
    } else {
        alert('Wrong answer.');
    }
    document.getElementById('score').innerText = score;
    currentQuestionIndex = (currentQuestionIndex + 1) % quizData.length;
    loadQuiz();
}

// Initialize Quiz
loadQuiz();

// Progress Tracking
let progress = 0;

function updateProgress() {
    progress += 10; // Increment progress
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Example: Call updateProgress() after completing a flashcard or quiz question
