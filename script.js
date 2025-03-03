document.addEventListener('DOMContentLoaded', function() {
    // App state
    const state = {
        level: 'beginner',
        lessonIndex: 0,
        score: 0,
        showTranslation: false
    };

    // DOM elements
    const portugueseText = document.querySelector('.portuguese-text');
    const translation = document.querySelector('.translation');
    const usageContext = document.querySelector('.usage-context');
    const audioPlayer = document.querySelector('.audio-player');
    const extraContent = document.querySelector('.extra-content');
    const toggleTranslationBtn = document.getElementById('toggle-translation');
    const nextLessonBtn = document.getElementById('next-lesson');
    const levelBtns = document.querySelectorAll('.level-btn');
    const scoreElement = document.getElementById('score');
    const progressBar = document.querySelector('.progress');

    // A2-level content structured by difficulty
    const lessonContent = {
        beginner: [
            {
                type: 'vocab',
                word: 'restaurante',
                portuguese: 'restaurante',
                translation: 'restaurant',
                usage: 'Vamos ao restaurante?',
                englishUsage: 'Shall we go to the restaurant?',
                category: 'daily life'
            },
            {
                type: 'phrase',
                portuguese: 'Quanto custa isto?',
                translation: 'How much is this?',
                usage: 'Shopping and prices',
                audioUrl: ''
            },
            {
                type: 'vocab',
                portuguese: 'comboio',
                translation: 'train',
                usage: 'European Portuguese uses "comboio" instead of "trem"',
                category: 'transportation'
            },
            {
                type: 'phrase',
                portuguese: 'Bom dia, tudo bem?',
                translation: 'Good morning, how are you?',
                usage: 'Common morning greeting',
                audioUrl: ''
            }
        ],
        intermediate: [
            {
                type: 'dialogue',
                portuguese: 'Poderia me dizer onde fica a estação de comboio?',
                translation: 'Could you tell me where the train station is?',
                usage: 'Asking for directions',
                alternatives: ['Como chego à estação?', 'Onde é a estação?']
            },
            {
                type: 'grammar',
                portuguese: 'Estou a aprender português',
                translation: 'I am learning Portuguese',
                usage: 'Present Continuous - Use "estar a + infinitive" for ongoing actions'
            },
            {
                type: 'dialogue',
                portuguese: 'Gostaria de reservar uma mesa para dois, por favor.',
                translation: 'I would like to book a table for two, please.',
                usage: 'At a restaurant',
                alternatives: ['Tem mesa para dois?', 'Podemos sentar-nos?']
            }
        ],
        advanced: [
            {
                type: 'situation',
                portuguese: 'Tenho dores de cabeça há três dias',
                translation: 'I've had headaches for three days',
                usage: 'At the doctor's office',
                vocabulary: ['dores', 'sintomas', 'medicação']
            },
            {
                type: 'expression',
                portuguese: 'Dar com a língua nos dentes',
                translation: 'To let the cat out of the bag (to reveal a secret)',
                usage: 'Common idiomatic expression',
                vocabulary: ['expressão', 'segredo', 'revelar']
            },
            {
                type: 'formal',
                portuguese: 'Venho por este meio solicitar a vossa colaboração',
                translation: 'I hereby request your collaboration',
                usage: 'Formal letter or email',
                vocabulary: ['formal', 'solicitar', 'colaboração']
            }
        ]
    };

    // Initialize the app
    function init() {
        updateLesson();
        attachEventListeners();
    }

    // Update lesson content based on current state
    function updateLesson() {
        const currentLessons = lessonContent[state.level];
        const lesson = currentLessons[state.lessonIndex];
        
        // Update text content
        portugueseText.textContent = lesson.portuguese;
        translation.textContent = lesson.translation;
        usageContext.textContent = lesson.usage;
        
        // Handle translation visibility
        if (state.showTranslation) {
            translation.classList.remove('hidden');
            toggleTranslationBtn.textContent = 'Hide Translation';
        } else {
            translation.classList.add('hidden');
            toggleTranslationBtn.textContent = 'Show Translation';
        }
        
        // Update progress bar
        const progress = ((state.lessonIndex + 1) / currentLessons.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Clear extra content
        extraContent.innerHTML = '';
        
        // Add level-specific content
        if (state.level === 'intermediate' && lesson.alternatives) {
            const alternativesHtml = `
                <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Alternative Expressions:</h3>
                <ul style="list-style-type: disc; padding-left: 1.5rem;">
                    ${lesson.alternatives.map(alt => `<li>${alt}</li>`).join('')}
                </ul>
            `;
            extraContent.innerHTML = alternativesHtml;
        }
        
        if (state.level === 'advanced' && lesson.vocabulary) {
            const vocabHtml = `
                <h3 style="font-weight: 600; margin-bottom: 0.5rem;">Related Vocabulary:</h3>
                <div class="vocabulary-list">
                    ${lesson.vocabulary.map(word => `<span class="vocabulary-item">${word}</span>`).join('')}
                </div>
            `;
            extraContent.innerHTML = vocabHtml;
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        // Toggle translation
        toggleTranslationBtn.addEventListener('click', function() {
            state.showTranslation = !state.showTranslation;
            updateLesson();
        });
        
        // Next lesson
        nextLessonBtn.addEventListener('click', function() {
            const currentLessons = lessonContent[state.level];
            state.lessonIndex = (state.lessonIndex + 1) % currentLessons.length;
            state.showTranslation = false;
            state.score += 1;
            scoreElement.textContent = state.score;
            updateLesson();
        });
        
        // Level selection
        levelBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedLevel = this.getAttribute('data-level');
                state.level = selectedLevel;
                state.lessonIndex = 0;
                state.showTranslation = false;
                
                // Update active button
                levelBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                updateLesson();
            });
        });
    }

    // Start the app
    init();
});
