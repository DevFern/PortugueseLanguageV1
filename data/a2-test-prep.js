const a2TestPrep = {
    listening: [
        {
            type: 'dialogue',
            audio: 'dialogue1.mp3',
            transcript: 'Na loja de cidadania...',
            questions: [
                {
                    question: 'O que a pessoa quer fazer?',
                    options: [
                        'Obter cidadania',
                        'Comprar comida',
                        'Encontrar um hotel',
                        'Aprender português'
                    ],
                    correct: 0
                }
                // Add more questions
            ]
        }
    ],
    reading: [
        {
            text: 'Text about Portuguese citizenship requirements',
            questions: [
                // Add reading comprehension questions
            ]
        }
    ],
    speaking: [
        {
            scenario: 'Citizenship Interview',
            prompts: [
                'Introduce yourself',
                'Explain why you want citizenship',
                'Describe your connection to Portugal'
            ],
            expectedResponses: [
                // Add model responses
            ]
        }
    ]
};
