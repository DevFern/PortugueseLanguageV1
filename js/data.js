/**
 * Data management for the Portuguese A2 Learning App
 * Centralizes all data access and manipulation
 */

class DataManager {
  constructor() {
    // Initialize with default data or load from external sources
    this.vocabularyData = window.vocabularyData || {};
    this.a2TestData = window.a2TestPrep || {};
    this.grammarRules = this.initializeGrammarRules();
    this.userPreferences = this.loadUserPreferences();
  }
  
  init() {
    console.log('Initializing DataManager');
    // Additional initialization if needed
  }
  
  loadUserPreferences() {
    try {
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        return JSON.parse(savedPrefs);
      }
    } catch (e) {
      console.error('Error loading user preferences:', e);
    }
    
    // Default preferences
    return {
      level: 'beginner',
      theme: 'light',
      showPhonetics: true,
      audioEnabled: true
    };
  }
  
  saveUserPreferences(preferences) {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return true;
    } catch (e) {
      console.error('Error saving user preferences:', e);
      return false;
    }
  }
  
  getVocabularyByCategory(category, level) {
    if (!this.vocabularyData || !this.vocabularyData[category]) {
      return [];
    }
    
    let levelData;
    if (level === 'beginner' && this.vocabularyData[category].basic) {
      levelData = this.vocabularyData[category].basic;
    } else if (level === 'intermediate' && this.vocabularyData[category].intermediate) {
      levelData = this.vocabularyData[category].intermediate;
    } else if (level === 'advanced' && this.vocabularyData[category].advanced) {
      levelData = this.vocabularyData[category].advanced;
    }
    
    return levelData || [];
  }
  
  getAllVocabulary(level) {
    let allWords = [];
    
    if (!this.vocabularyData) {
      return allWords;
    }
    
    Object.keys(this.vocabularyData).forEach(category => {
      const categoryWords = this.getVocabularyByCategory(category, level);
      if (categoryWords && categoryWords.length > 0) {
        allWords = [...allWords, ...categoryWords];
      }
    });
    
    return allWords;
  }
  
  getA2TestData(section) {
    if (!this.a2TestData || !this.a2TestData[section]) {
      return [];
    }
    
    return this.a2TestData[section];
  }
  
  initializeGrammarRules() {
    // Basic grammar rules for Portuguese
    return {
      verbConjugation: {
        regular: {
          ar: {
            present: {
              eu: 'o',
              tu: 'as',
              ele_ela_você: 'a',
              nós: 'amos',
              vós: 'ais',
              eles_elas_vocês: 'am'
            },
            past: {
              eu: 'ei',
              tu: 'aste',
              ele_ela_você: 'ou',
              nós: 'ámos',
              vós: 'astes',
              eles_elas_vocês: 'aram'
            }
          },
          er: {
            present: {
              eu: 'o',
              tu: 'es',
              ele_ela_você: 'e',
              nós: 'emos',
              vós: 'eis',
              eles_elas_vocês: 'em'
            },
            past: {
              eu: 'i',
              tu: 'este',
              ele_ela_você: 'eu',
              nós: 'emos',
              vós: 'estes',
              eles_elas_vocês: 'eram'
            }
          },
          ir: {
            present: {
              eu: 'o',
              tu: 'es',
              ele_ela_você: 'e',
              nós: 'imos',
              vós: 'is',
              eles_elas_vocês: 'em'
            },
            past: {
              eu: 'i',
              tu: 'iste',
              ele_ela_você: 'iu',
              nós: 'imos',
              vós: 'istes',
              eles_elas_vocês: 'iram'
            }
          }
        },
        irregular: {
          ser: {
            present: {
              eu: 'sou',
              tu: 'és',
              ele_ela_você: 'é',
              nós: 'somos',
              vós: 'sois',
              eles_elas_vocês: 'são'
            },
            past: {
              eu: 'fui',
              tu: 'foste',
              ele_ela_você: 'foi',
              nós: 'fomos',
              vós: 'fostes',
              eles_elas_vocês: 'foram'
            }
          },
          estar: {
            present: {
              eu: 'estou',
              tu: 'estás',
              ele_ela_você: 'está',
              nós: 'estamos',
              vós: 'estais',
              eles_elas_vocês: 'estão'
            },
            past: {
              eu: 'estive',
              tu: 'estiveste',
              ele_ela_você: 'esteve',
              nós: 'estivemos',
              vós: 'estivestes',
              eles_elas_vocês: 'estiveram'
            }
          },
          ir: {
            present: {
              eu: 'vou',
              tu: 'vais',
              ele_ela_você: 'vai',
              nós: 'vamos',
              vós: 'ides',
              eles_elas_vocês: 'vão'
            },
            past: {
              eu: 'fui',
              tu: 'foste',
              ele_ela_você: 'foi',
              nós: 'fomos',
              vós: 'fostes',
              eles_elas_vocês: 'foram'
            }
          }
        }
      },
      articles: {
        definite: {
          masculine: {
            singular: 'o',
            plural: 'os'
          },
          feminine: {
            singular: 'a',
            plural: 'as'
          }
        },
        indefinite: {
          masculine: {
            singular: 'um',
            plural: 'uns'
          },
          feminine: {
            singular: 'uma',
            plural: 'umas'
          }
        }
      },
      prepositions: {
        common: ['a', 'de', 'em', 'para', 'por', 'com', 'sem'],
        contractions: {
          'a + o': 'ao',
          'a + a': 'à',
          'a + os': 'aos',
          'a + as': 'às',
          'de + o': 'do',
          'de + a': 'da',
          'de + os': 'dos',
          'de + as': 'das',
          'em + o': 'no',
          'em + a': 'na',
          'em + os': 'nos',
          'em + as': 'nas',
          'por + o': 'pelo',
          'por + a': 'pela',
          'por + os': 'pelos',
          'por + as': 'pelas'
        }
      },
      pronouns: {
        subject: ['eu', 'tu', 'ele/ela/você', 'nós', 'vós', 'eles/elas/vocês'],
        object: ['me', 'te', 'o/a/lhe', 'nos', 'vos', 'os/as/lhes'],
        reflexive: ['me', 'te', 'se', 'nos', 'vos', 'se'],
        possessive: {
          masculine: {
            singular: ['meu', 'teu', 'seu', 'nosso', 'vosso', 'seu'],
            plural: ['meus', 'teus', 'seus', 'nossos', 'vossos', 'seus']
          },
          feminine: {
            singular: ['minha', 'tua', 'sua', 'nossa', 'vossa', 'sua'],
            plural: ['minhas', 'tuas', 'suas', 'nossas', 'vossas', 'suas']
          }
        }
      }
    };
  }
  
  getGrammarRules(category) {
    if (!category) {
      return this.grammarRules;
    }
    
    return this.grammarRules[category] || null;
  }
  
  getVerbConjugation(verb, tense) {
    // Check if it's a known irregular verb
    if (this.grammarRules.verbConjugation.irregular[verb]) {
      return this.grammarRules.verbConjugation.irregular[verb][tense] || null;
    }
    
    // Try to conjugate as a regular verb
    const ending = verb.slice(-2);
    if (['ar', 'er', 'ir'].includes(ending)) {
      const stem = verb.slice(0, -2);
      const conjugation = this.grammarRules.verbConjugation.regular[ending][tense];
      
      if (conjugation) {
        const result = {};
        Object.keys(conjugation).forEach(person => {
          result[person] = stem + conjugation[person];
        });
        return result;
      }
    }
    
    return null;
  }
  
  // Helper method to generate phonetic representation
  generatePhonetic(word) {
    if (!word) return '';
    
    // This is a very simplified phonetic generator
    // In a real app, you would use a more sophisticated algorithm or API
    
    // Replace common Portuguese sounds with phonetic equivalents
    let phonetic = word.toLowerCase()
      .replace(/nh/g, 'ɲ')
      .replace(/lh/g, 'ʎ')
      .replace(/ch/g, 'ʃ')
      .replace(/rr/g, 'ʁ')
      .replace(/ç/g, 's')
      .replace(/ã/g, 'ɐ̃')
      .replace(/õ/g, 'õ')
      .replace(/á/g, 'á')
      .replace(/é/g, 'é')
      .replace(/í/g, 'í')
      .replace(/ó/g, 'ó')
      .replace(/ú/g, 'ú')
      .replace(/â/g, 'â')
      .replace(/ê/g, 'ê')
      .replace(/ô/g, 'ô');
    
    return phonetic;
  }
  
  // Method to get fallback data when needed
  getFallbackVocabulary() {
    return [
      {
        word: 'cidadania',
        translation: 'citizenship',
        phonetic: 'si-da-da-ni-a',
        usage: 'Preciso de obter a cidadania portuguesa.',
        englishUsage: 'I need to obtain Portuguese citizenship.',
        audio: 'audio/cidadania.mp3'
      },
      {
        word: 'passaporte',
        translation: 'passport',
        phonetic: 'pa-sa-por-te',
        usage: 'O meu passaporte está válido por mais cinco anos.',
        englishUsage: 'My passport is valid for five more years.',
        audio: 'audio/passaporte.mp3'
      },
      {
        word: 'residência',
        translation: 'residence',
        phonetic: 're-zi-den-si-a',
        usage: 'Tenho autorização de residência em Portugal.',
        englishUsage: 'I have residence authorization in Portugal.',
        audio: 'audio/residencia.mp3'
      },
      {
        word: 'obrigado',
        translation: 'thank you',
        phonetic: 'o-bri-ga-do',
        usage: 'Obrigado pela sua ajuda.',
        englishUsage: 'Thank you for your help.',
        audio: 'audio/obrigado.mp3'
      },
      {
        word: 'por favor',
        translation: 'please',
        phonetic: 'por fa-vor',
        usage: 'Por favor, pode repetir?',
        englishUsage: 'Please, can you repeat?',
        audio: 'audio/por-favor.mp3'
      }
    ];
  }
  
  // Method to get fallback test data
  getFallbackTestData() {
    return {
      listening: [
        {
          question: 'Listen and select what the person is asking for:',
          options: ['Directions to the citizenship office', 'A restaurant recommendation', 'The time of day', 'A taxi'],
          correct: 0,
          audio: 'audio/listening1.mp3',
          transcript: 'Pode dizer-me onde fica o departamento de cidadania, por favor?'
        },
        {
          question: 'Listen and select the correct translation:',
          options: ['I need to renew my residence permit', 'I need to apply for citizenship', 'I need to get a new passport', 'I need to register my address'],
          correct: 0,
          audio: 'audio/listening2.mp3',
          transcript: 'Preciso de renovar a minha autorização de residência.'
        }
      ],
      reading: [
        {
          text: 'Portugal é um país localizado no sudoeste da Europa, na Península Ibérica. A sua capital é Lisboa, uma das cidades mais antigas do mundo. Portugal tem uma população de aproximadamente 10 milhões de habitantes e o português é a língua oficial.',
          question: 'What is the capital of Portugal?',
          options: ['Madrid', 'Lisbon', 'Porto', 'Faro'],
          correct: 1
        }
      ],
      grammar: [
        {
          question: 'Complete the sentence: "Eu ____ português todos os dias."',
          options: ['estudo', 'estudar', 'estudando', 'estudei'],
          correct: 0,
          explanation: 'Present tense for "eu" with regular -ar verb "estudar" is "estudo"'
        }
      ]
    };
  }
}
