// flashcards.js - Updated implementation
class FlashcardManager {
  constructor() {
    this.cards = [];
    this.currentIndex = 0;
    this.level = localStorage.getItem('userLevel') || 'beginner';
    this.category = 'citizenship';
    
    // DOM elements
    this.flashcardContainer = document.querySelector('.flashcard-container');
    this.flashcardElement = document.querySelector('.flashcard');
    this.wordElement = document.querySelector('.word');
    this.translationElement = document.querySelector('.translation');
    this.usageElement = document.querySelector('.usage');
    this.englishUsageElement = document.querySelector('.english-usage');
    this.currentCardElement = document.getElementById('current-card');
    this.totalCardsElement = document.getElementById('total-cards');
    
    // Buttons
    this.prevButton = document.getElementById('prev-card');
    this.nextButton = document.getElementById('next-card');
    this.flipButton = document.getElementById('flip-card');
    
    // Category and level selectors
    this.categoryButtons = document.querySelectorAll('.category-btn');
    this.levelButtons = document.querySelectorAll('.level-btn');
  }
  
  init() {
    console.log('Initializing FlashcardManager');
    
    if (!this.flashcardElement) {
      console.error('Flashcard element not found');
      return;
    }
    
    this.loadCards();
    this.renderCard();
    this.attachEventListeners();
  }
  
  loadCards() {
    // Reset cards array
    this.cards = [];
    
    // Check if vocabulary data exists
    if (typeof vocabularyData === 'undefined') {
      console.warn('Vocabulary data not found, using fallback data');
      
      // Use fallback data
      this.cards = [
        {
  citizenship: {
    beginner: [
      {
        word: "cidadania",
        translation: "citizenship",
        usage: "Preciso de obter a cidadania portuguesa.",
        englishUsage: "I need to obtain Portuguese citizenship.",
        audio: "audio/cidadania.mp3"
      },
      {
        word: "passaporte",
        translation: "passport",
        usage: "O meu passaporte está válido por mais cinco anos.",
        englishUsage: "My passport is valid for five more years.",
        audio: "audio/passaporte.mp3"
      },
      {
        word: "residência",
        translation: "residence",
        usage: "Tenho autorização de residência em Portugal.",
        englishUsage: "I have residence authorization in Portugal.",
        audio: "audio/residencia.mp3"
      },
      {
        word: "nacionalidade",
        translation: "nationality",
        usage: "Qual é a sua nacionalidade?",
        englishUsage: "What is your nationality?",
        audio: "audio/nacionalidade.mp3"
      },
      {
        word: "documento",
        translation: "document",
        usage: "Preciso de apresentar todos os documentos necessários.",
        englishUsage: "I need to present all the necessary documents.",
        audio: "audio/documento.mp3"
      },
      {
        word: "identidade",
        translation: "identity",
        usage: "O cartão de identidade é um documento importante.",
        englishUsage: "The identity card is an important document.",
        audio: "audio/identidade.mp3"
      },
      {
        word: "estrangeiro",
        translation: "foreigner",
        usage: "Sou estrangeiro e vivo em Portugal há três anos.",
        englishUsage: "I am a foreigner and have lived in Portugal for three years.",
        audio: "audio/estrangeiro.mp3"
      },
      {
        word: "requerimento",
        translation: "application form",
        usage: "Preenchi o requerimento para a cidadania.",
        englishUsage: "I filled out the application form for citizenship.",
        audio: "audio/requerimento.mp3"
      },
      {
        word: "certificado",
        translation: "certificate",
        usage: "Preciso do certificado de língua portuguesa.",
        englishUsage: "I need the Portuguese language certificate.",
        audio: "audio/certificado.mp3"
      },
      {
        word: "autorização",
        translation: "authorization",
        usage: "A autorização de residência é válida por dois anos.",
        englishUsage: "The residence authorization is valid for two years.",
        audio: "audio/autorizacao.mp3"
      },
      {
        word: "certidão",
        translation: "certificate",
        usage: "Preciso da certidão de nascimento para o processo.",
        englishUsage: "I need the birth certificate for the process.",
        audio: "audio/certidao.mp3"
      },
      {
        word: "cartão de cidadão",
        translation: "citizen card",
        usage: "O cartão de cidadão é o documento de identificação em Portugal.",
        englishUsage: "The citizen card is the identification document in Portugal.",
        audio: "audio/cartao-cidadao.mp3"
      },
      {
        word: "registo criminal",
        translation: "criminal record",
        usage: "É necessário apresentar o registo criminal do país de origem.",
        englishUsage: "It is necessary to present the criminal record from your country of origin.",
        audio: "audio/registo-criminal.mp3"
      },
      {
        word: "conservatória",
        translation: "registry office",
        usage: "Deve dirigir-se à conservatória para iniciar o processo.",
        englishUsage: "You should go to the registry office to start the process.",
        audio: "audio/conservatoria.mp3"
      }
    ],
    advanced: [
      {
        word: "naturalização",
        translation: "naturalization",
        usage: "O processo de naturalização pode demorar vários meses.",
        englishUsage: "The naturalization process can take several months.",
        audio: "audio/naturalizacao.mp3"
      },
      {
        word: "decreto-lei",
        translation: "decree-law",
        usage: "O decreto-lei estabelece os requisitos para a cidadania.",
        englishUsage: "The decree-law establishes the requirements for citizenship.",
        audio: "audio/decreto-lei.mp3"
      },
      {
        word: "jurídico",
        translation: "legal",
        usage: "Preciso de aconselhamento jurídico para o meu processo.",
        englishUsage: "I need legal advice for my process.",
        audio: "audio/juridico.mp3"
      },
      {
        word: "descendência",
        translation: "descent",
        usage: "Posso obter cidadania por descendência portuguesa.",
        englishUsage: "I can obtain citizenship through Portuguese descent.",
        audio: "audio/descendencia.mp3"
      },
      {
        word: "ascendência",
        translation: "ancestry",
        usage: "Tenho ascendência portuguesa pelo lado da minha mãe.",
        englishUsage: "I have Portuguese ancestry on my mother's side.",
        audio: "audio/ascendencia.mp3"
      },
      {
        word: "legislação",
        translation: "legislation",
        usage: "A legislação sobre cidadania mudou recentemente.",
        englishUsage: "The legislation on citizenship has changed recently.",
        audio: "audio/legislacao.mp3"
      },
      {
        word: "descendente",
        translation: "descendant",
        usage: "Sou descendente de portugueses.",
        englishUsage: "I am a descendant of Portuguese people.",
        audio: "audio/descendente.mp3"
      },
      {
        word: "repatriação",
        translation: "repatriation",
        usage: "A repatriação é o processo de retorno ao país de origem.",
        englishUsage: "Repatriation is the process of returning to one's country of origin.",
        audio: "audio/repatriacao.mp3"
      },
      {
        word: "procuração",
        translation: "power of attorney",
        usage: "Pode nomear um representante através de uma procuração.",
        englishUsage: "You can appoint a representative through a power of attorney.",
        audio: "audio/procuracao.mp3"
      },
      {
        word: "visto",
        translation: "visa",
        usage: "Preciso de um visto para entrar em Portugal.",
        englishUsage: "I need a visa to enter Portugal.",
        audio: "audio/visto.mp3"
      }
    ]
  },
  greetings: {
    beginner: [
      {
        word: "bom dia",
        translation: "good morning",
        usage: "Bom dia! Como está?",
        englishUsage: "Good morning! How are you?",
        audio: "audio/bom-dia.mp3"
      },
      {
        word: "boa tarde",
        translation: "good afternoon",
        usage: "Boa tarde! Tudo bem?",
        englishUsage: "Good afternoon! All good?",
        audio: "audio/boa-tarde.mp3"
      },
      {
        word: "boa noite",
        translation: "good evening/night",
        usage: "Boa noite! Até amanhã.",
        englishUsage: "Good night! See you tomorrow.",
        audio: "audio/boa-noite.mp3"
      },
      {
        word: "obrigado/obrigada",
        translation: "thank you",
        usage: "Muito obrigado pela sua ajuda.",
        englishUsage: "Thank you very much for your help.",
        audio: "audio/obrigado.mp3"
      },
      {
        word: "por favor",
        translation: "please",
        usage: "Pode repetir, por favor?",
        englishUsage: "Can you repeat, please?",
        audio: "audio/por-favor.mp3"
      },
      {
        word: "desculpe",
        translation: "excuse me/sorry",
        usage: "Desculpe, onde fica a estação de comboio?",
        englishUsage: "Excuse me, where is the train station?",
        audio: "audio/desculpe.mp3"
      },
      {
        word: "com licença",
        translation: "excuse me (to pass)",
        usage: "Com licença, preciso de passar.",
        englishUsage: "Excuse me, I need to pass.",
        audio: "audio/com-licenca.mp3"
      },
      {
        word: "ajuda",
        translation: "help",
        usage: "Preciso de ajuda, por favor.",
        englishUsage: "I need help, please.",
        audio: "audio/ajuda.mp3"
      },
      {
        word: "falar",
        translation: "to speak",
        usage: "Eu falo um pouco de português.",
        englishUsage: "I speak a little Portuguese.",
        audio: "audio/falar.mp3"
      },
      {
        word: "compreender",
        translation: "to understand",
        usage: "Não compreendo bem.",
        englishUsage: "I don't understand well.",
        audio: "audio/compreender.mp3"
      },
      {
        word: "supermercado",
        translation: "supermarket",
        usage: "Vou ao supermercado comprar pão.",
        englishUsage: "I'm going to the supermarket to buy bread.",
        audio: "audio/supermercado.mp3"
      },
      {
        word: "farmácia",
        translation: "pharmacy",
        usage: "Preciso de ir à farmácia comprar medicamentos.",
        englishUsage: "I need to go to the pharmacy to buy medicine.",
        audio: "audio/farmacia.mp3"
      },
      {
        word: "banco",
        translation: "bank",
        usage: "Vou ao banco levantar dinheiro.",
        englishUsage: "I'm going to the bank to withdraw money.",
        audio: "audio/banco.mp3"
      },
      {
        word: "correios",
        translation: "post office",
        usage: "Preciso de ir aos correios enviar uma carta.",
        englishUsage: "I need to go to the post office to send a letter.",
        audio: "audio/correios.mp3"
      }
    ],
    advanced: [
      {
        word: "atendimento",
        translation: "customer service",
        usage: "O atendimento nesta loja é excelente.",
        englishUsage: "The customer service in this store is excellent.",
        audio: "audio/atendimento.mp3"
      },
      {
        word: "agendamento",
        translation: "appointment",
        usage: "Preciso de fazer um agendamento para renovar o meu cartão.",
        englishUsage: "I need to make an appointment to renew my card.",
        audio: "audio/agendamento.mp3"
      },
      {
        word: "morada",
        translation: "address",
        usage: "Qual é a sua morada atual?",
        englishUsage: "What is your current address?",
        audio: "audio/morada.mp3"
      },
      {
        word: "código postal",
        translation: "postal code",
        usage: "Qual é o código postal da sua área?",
        englishUsage: "What is the postal code for your area?",
        audio: "audio/codigo-postal.mp3"
      },
      {
        word: "freguesia",
        translation: "parish/district",
        usage: "Em que freguesia mora?",
        englishUsage: "In which parish/district do you live?",
        audio: "audio/freguesia.mp3"
      },
      {
        word: "concelho",
        translation: "municipality",
        usage: "O concelho de Lisboa tem várias freguesias.",
        englishUsage: "The municipality of Lisbon has several parishes.",
        audio: "audio/concelho.mp3"
      },
      {
        word: "distrito",
        translation: "district",
        usage: "Portugal está dividido em 18 distritos.",
        englishUsage: "Portugal is divided into 18 districts.",
        audio: "audio/distrito.mp3"
      }
    ]
  },
  transportation: {
    beginner: [
      {
        word: "comboio",
        translation: "train",
        usage: "Vou apanhar o comboio para Lisboa.",
        englishUsage: "I'm going to catch the train to Lisbon.",
        audio: "audio/comboio.mp3"
      },
      {
        word: "autocarro",
        translation: "bus",
        usage: "O autocarro passa de 30 em 30 minutos.",
        englishUsage: "The bus comes every 30 minutes.",
        audio: "audio/autocarro.mp3"
      },
      {
        word: "metro",
        translation: "subway",
        usage: "O metro é a forma mais rápida de viajar na cidade.",
        englishUsage: "The subway is the fastest way to travel in the city.",
        audio: "audio/metro.mp3"
      },
      {
        word: "bilhete",
        translation: "ticket",
        usage: "Preciso de comprar um bilhete de ida e volta.",
        englishUsage: "I need to buy a round-trip ticket.",
        audio: "audio/bilhete.mp3"
      },
      {
        word: "estação",
        translation: "station",
        usage: "A estação de comboios fica perto do centro.",
        englishUsage: "The train station is near the center.",
        audio: "audio/estacao.mp3"
      },
      {
        word: "paragem",
        translation: "stop",
        usage: "A paragem de autocarro é ali.",
        englishUsage: "The bus stop is over there.",
        audio: "audio/paragem.mp3"
      },
      {
        word: "elétrico",
        translation: "tram",
        usage: "O elétrico 28 é muito popular entre os turistas.",
        englishUsage: "Tram 28 is very popular among tourists.",
        audio: "audio/eletrico.mp3"
      },
      {
        word: "táxi",
        translation: "taxi",
        usage: "Vou apanhar um táxi para o aeroporto.",
        englishUsage: "I'm going to take a taxi to the airport.",
        audio: "audio/taxi.mp3"
      },
      {
        word: "aeroporto",
        translation: "airport",
        usage: "O aeroporto de Lisboa chama-se Humberto Delgado.",
        englishUsage: "Lisbon's airport is called Humberto Delgado.",
        audio: "audio/aeroporto.mp3"
      },
      {
        word: "avião",
        translation: "airplane",
        usage: "O avião para o Porto parte às 15h00.",
        englishUsage: "The plane to Porto leaves at 3:00 PM.",
        audio: "audio/aviao.mp3"
      }
    ],
    advanced: [
      {
        word: "passe",
        translation: "pass (transport)",
        usage: "Tenho um passe mensal para os transportes públicos.",
        englishUsage: "I have a monthly pass for public transportation.",
        audio: "audio/passe.mp3"
      },
      {
        word: "carreira",
        translation: "bus route",
        usage: "Qual é a carreira que vai para o centro?",
        englishUsage: "Which bus route goes to the center?",
        audio: "audio/carreira.mp3"
      },
      {
        word: "horário",
        translation: "schedule",
        usage: "Pode mostrar-me o horário dos comboios?",
        englishUsage: "Can you show me the train schedule?",
        audio: "audio/horario.mp3"
      },
      {
        word: "atraso",
        translation: "delay",
        usage: "O comboio tem um atraso de 20 minutos.",
        englishUsage: "The train has a 20-minute delay.",
        audio: "audio/atraso.mp3"
      },
      {
        word: "transbordos",
        translation: "transfers",
        usage: "Quantos transbordos tenho de fazer?",
        englishUsage: "How many transfers do I have to make?",
        audio: "audio/transbordos.mp3"
      }
    ]
  },
  food: {
    beginner: [
      {
        word: "restaurante",
        translation: "restaurant",
        usage: "Vamos jantar naquele restaurante.",
        englishUsage: "Let's have dinner at that restaurant.",
        audio: "audio/restaurante.mp3"
      },
      {
        word: "café",
        translation: "coffee/café",
        usage: "Vamos tomar um café?",
        englishUsage: "Shall we have a coffee?",
        audio: "audio/cafe.mp3"
      },
      {
        word: "pão",
        translation: "bread",
        usage: "O pão português é muito bom.",
        englishUsage: "Portuguese bread is very good.",
        audio: "audio/pao.mp3"
      },
      {
        word: "água",
        translation: "water",
        usage: "Posso ter um copo de água, por favor?",
        englishUsage: "Can I have a glass of water, please?",
        audio: "audio/agua.mp3"
      },
      {
        word: "vinho",
        translation: "wine",
        usage: "Portugal é famoso pelo seu vinho.",
        englishUsage: "Portugal is famous for its wine.",
        audio: "audio/vinho.mp3"
      },
      {
        word: "pequeno-almoço",
        translation: "breakfast",
        usage: "O que costuma comer ao pequeno-almoço?",
        englishUsage: "What do you usually eat for breakfast?",
        audio: "audio/pequeno-almoco.mp3"
      },
      {
        word: "almoço",
        translation: "lunch",
        usage: "Vamos almoçar juntos?",
        englishUsage: "Shall we have lunch together?",
        audio: "audio/almoco.mp3"
      },
      {
        word: "jantar",
        translation: "dinner",
        usage: "O jantar é servido às 20h00.",
        englishUsage: "Dinner is served at 8:00 PM.",
        audio: "audio/jantar.mp3"
      },
      {
        word: "sobremesa",
        translation: "dessert",
        usage: "Que sobremesa recomenda?",
        englishUsage: "What dessert do you recommend?",
        audio: "audio/sobremesa.mp3"
      },
      {
        word: "conta",
        translation: "bill",
        usage: "Pode trazer a conta, por favor?",
        englishUsage: "Can you bring the bill, please?",
        audio: "audio/conta.mp3"
      }
    ],
    advanced: [
      {
        word: "bacalhau",
        translation: "codfish",
        usage: "O bacalhau é um prato tradicional português.",
        englishUsage: "Codfish is a traditional Portuguese dish.",
        audio: "audio/bacalhau.mp3"
      },
      {
        word: "pastel de nata",
        translation: "custard tart",
        usage: "O pastel de nata é uma sobremesa típica portuguesa.",
        englishUsage: "The custard tart is a typical Portuguese dessert.",
        audio: "audio/pastel-nata.mp3"
      },
      {
        word: "francesinha",
        translation: "francesinha (sandwich)",
        usage: "A francesinha é uma especialidade do Porto.",
        englishUsage: "Francesinha is a specialty from Porto.",
        audio: "audio/francesinha.mp3"
      },
      {
        word: "cozido à portuguesa",
        translation: "Portuguese stew",
        usage: "O cozido à portuguesa leva vários tipos de carne e legumes.",
        englishUsage: "Portuguese stew includes various types of meat and vegetables.",
        audio: "audio/cozido.mp3"
      },
      {
        word: "sardinha",
        translation: "sardine",
        usage: "No verão, as sardinhas assadas são muito populares.",
        englishUsage: "In summer, grilled sardines are very popular.",
        audio: "audio/sardinha.mp3"
      }
    ]
  },
  health: {
    beginner: [
      {
        word: "médico",
        translation: "doctor",
        usage: "Preciso de marcar uma consulta com o médico.",
        englishUsage: "I need to make an appointment with the doctor.",
        audio: "audio/medico.mp3"
      },
      {
        word: "hospital",
        translation: "hospital",
        usage: "O hospital fica perto da estação de metro.",
        englishUsage: "The hospital is near the metro station.",
        audio: "audio/hospital.mp3"
      },
      {
        word: "farmácia",
        translation: "pharmacy",
        usage: "Há uma farmácia aberta 24 horas?",
        englishUsage: "Is there a pharmacy open 24 hours?",
        audio: "audio/farmacia.mp3"
      },
      {
        word: "doente",
        translation: "sick",
        usage: "Estou doente há três dias.",
        englishUsage: "I have been sick for three days.",
        audio: "audio/doente.mp3"
      },
      {
        word: "dor",
        translation: "pain",
        usage: "Tenho dor de cabeça.",
        englishUsage: "I have a headache.",
        audio: "audio/dor.mp3"
      },
      {
        word: "febre",
        translation: "fever",
        usage: "Tenho febre alta.",
        englishUsage: "I have a high fever.",
        audio: "audio/febre.mp3"
      },
      {
        word: "medicamento",
        translation: "medicine",
        usage: "Preciso de tomar este medicamento três vezes por dia.",
        englishUsage: "I need to take this medicine three times a day.",
        audio: "audio/medicamento.mp3"
      },
      {
        word: "receita",
        translation: "prescription",
        usage: "O médico deu-me uma receita para antibióticos.",
        englishUsage: "The doctor gave me a prescription for antibiotics.",
        audio: "audio/receita.mp3"
      }
    ]
  }
};
      
      return;
    }
    
    // Get cards based on category and level
    const levelMap = {
      'beginner': 'basic',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    
    const dataLevel = levelMap[this.level] || 'basic';
    
    // Load cards from all categories if category is 'all'
    if (this.category === 'all') {
      Object.keys(vocabularyData).forEach(category => {
        if (vocabularyData[category] && vocabularyData[category][dataLevel]) {
          this.cards = [...this.cards, ...vocabularyData[category][dataLevel]];
        }
      });
    } else if (vocabularyData[this.category] && vocabularyData[this.category][dataLevel]) {
      // Load cards from specific category
      this.cards = vocabularyData[this.category][dataLevel];
    }
    
    // If no cards found, use fallback data
    if (this.cards.length === 0) {
      console.warn('No cards found for the selected category and level, using fallback data');
      this.cards = [
        {
  citizenship: {
    beginner: [
      {
        word: "cidadania",
        translation: "citizenship",
        usage: "Preciso de obter a cidadania portuguesa.",
        englishUsage: "I need to obtain Portuguese citizenship.",
        audio: "audio/cidadania.mp3"
      },
      {
        word: "passaporte",
        translation: "passport",
        usage: "O meu passaporte está válido por mais cinco anos.",
        englishUsage: "My passport is valid for five more years.",
        audio: "audio/passaporte.mp3"
      },
      {
        word: "residência",
        translation: "residence",
        usage: "Tenho autorização de residência em Portugal.",
        englishUsage: "I have residence authorization in Portugal.",
        audio: "audio/residencia.mp3"
      },
      {
        word: "nacionalidade",
        translation: "nationality",
        usage: "Qual é a sua nacionalidade?",
        englishUsage: "What is your nationality?",
        audio: "audio/nacionalidade.mp3"
      },
      {
        word: "documento",
        translation: "document",
        usage: "Preciso de apresentar todos os documentos necessários.",
        englishUsage: "I need to present all the necessary documents.",
        audio: "audio/documento.mp3"
      },
      {
        word: "identidade",
        translation: "identity",
        usage: "O cartão de identidade é um documento importante.",
        englishUsage: "The identity card is an important document.",
        audio: "audio/identidade.mp3"
      },
      {
        word: "estrangeiro",
        translation: "foreigner",
        usage: "Sou estrangeiro e vivo em Portugal há três anos.",
        englishUsage: "I am a foreigner and have lived in Portugal for three years.",
        audio: "audio/estrangeiro.mp3"
      },
      {
        word: "requerimento",
        translation: "application form",
        usage: "Preenchi o requerimento para a cidadania.",
        englishUsage: "I filled out the application form for citizenship.",
        audio: "audio/requerimento.mp3"
      },
      {
        word: "certificado",
        translation: "certificate",
        usage: "Preciso do certificado de língua portuguesa.",
        englishUsage: "I need the Portuguese language certificate.",
        audio: "audio/certificado.mp3"
      },
      {
        word: "autorização",
        translation: "authorization",
        usage: "A autorização de residência é válida por dois anos.",
        englishUsage: "The residence authorization is valid for two years.",
        audio: "audio/autorizacao.mp3"
      },
      {
        word: "certidão",
        translation: "certificate",
        usage: "Preciso da certidão de nascimento para o processo.",
        englishUsage: "I need the birth certificate for the process.",
        audio: "audio/certidao.mp3"
      },
      {
        word: "cartão de cidadão",
        translation: "citizen card",
        usage: "O cartão de cidadão é o documento de identificação em Portugal.",
        englishUsage: "The citizen card is the identification document in Portugal.",
        audio: "audio/cartao-cidadao.mp3"
      },
      {
        word: "registo criminal",
        translation: "criminal record",
        usage: "É necessário apresentar o registo criminal do país de origem.",
        englishUsage: "It is necessary to present the criminal record from your country of origin.",
        audio: "audio/registo-criminal.mp3"
      },
      {
        word: "conservatória",
        translation: "registry office",
        usage: "Deve dirigir-se à conservatória para iniciar o processo.",
        englishUsage: "You should go to the registry office to start the process.",
        audio: "audio/conservatoria.mp3"
      }
    ],
    advanced: [
      {
        word: "naturalização",
        translation: "naturalization",
        usage: "O processo de naturalização pode demorar vários meses.",
        englishUsage: "The naturalization process can take several months.",
        audio: "audio/naturalizacao.mp3"
      },
      {
        word: "decreto-lei",
        translation: "decree-law",
        usage: "O decreto-lei estabelece os requisitos para a cidadania.",
        englishUsage: "The decree-law establishes the requirements for citizenship.",
        audio: "audio/decreto-lei.mp3"
      },
      {
        word: "jurídico",
        translation: "legal",
        usage: "Preciso de aconselhamento jurídico para o meu processo.",
        englishUsage: "I need legal advice for my process.",
        audio: "audio/juridico.mp3"
      },
      {
        word: "descendência",
        translation: "descent",
        usage: "Posso obter cidadania por descendência portuguesa.",
        englishUsage: "I can obtain citizenship through Portuguese descent.",
        audio: "audio/descendencia.mp3"
      },
      {
        word: "ascendência",
        translation: "ancestry",
        usage: "Tenho ascendência portuguesa pelo lado da minha mãe.",
        englishUsage: "I have Portuguese ancestry on my mother's side.",
        audio: "audio/ascendencia.mp3"
      },
      {
        word: "legislação",
        translation: "legislation",
        usage: "A legislação sobre cidadania mudou recentemente.",
        englishUsage: "The legislation on citizenship has changed recently.",
        audio: "audio/legislacao.mp3"
      },
      {
        word: "descendente",
        translation: "descendant",
        usage: "Sou descendente de portugueses.",
        englishUsage: "I am a descendant of Portuguese people.",
        audio: "audio/descendente.mp3"
      },
      {
        word: "repatriação",
        translation: "repatriation",
        usage: "A repatriação é o processo de retorno ao país de origem.",
        englishUsage: "Repatriation is the process of returning to one's country of origin.",
        audio: "audio/repatriacao.mp3"
      },
      {
        word: "procuração",
        translation: "power of attorney",
        usage: "Pode nomear um representante através de uma procuração.",
        englishUsage: "You can appoint a representative through a power of attorney.",
        audio: "audio/procuracao.mp3"
      },
      {
        word: "visto",
        translation: "visa",
        usage: "Preciso de um visto para entrar em Portugal.",
        englishUsage: "I need a visa to enter Portugal.",
        audio: "audio/visto.mp3"
      }
    ]
  },
  greetings: {
    beginner: [
      {
        word: "bom dia",
        translation: "good morning",
        usage: "Bom dia! Como está?",
        englishUsage: "Good morning! How are you?",
        audio: "audio/bom-dia.mp3"
      },
      {
        word: "boa tarde",
        translation: "good afternoon",
        usage: "Boa tarde! Tudo bem?",
        englishUsage: "Good afternoon! All good?",
        audio: "audio/boa-tarde.mp3"
      },
      {
        word: "boa noite",
        translation: "good evening/night",
        usage: "Boa noite! Até amanhã.",
        englishUsage: "Good night! See you tomorrow.",
        audio: "audio/boa-noite.mp3"
      },
      {
        word: "obrigado/obrigada",
        translation: "thank you",
        usage: "Muito obrigado pela sua ajuda.",
        englishUsage: "Thank you very much for your help.",
        audio: "audio/obrigado.mp3"
      },
      {
        word: "por favor",
        translation: "please",
        usage: "Pode repetir, por favor?",
        englishUsage: "Can you repeat, please?",
        audio: "audio/por-favor.mp3"
      },
      {
        word: "desculpe",
        translation: "excuse me/sorry",
        usage: "Desculpe, onde fica a estação de comboio?",
        englishUsage: "Excuse me, where is the train station?",
        audio: "audio/desculpe.mp3"
      },
      {
        word: "com licença",
        translation: "excuse me (to pass)",
        usage: "Com licença, preciso de passar.",
        englishUsage: "Excuse me, I need to pass.",
        audio: "audio/com-licenca.mp3"
      },
      {
        word: "ajuda",
        translation: "help",
        usage: "Preciso de ajuda, por favor.",
        englishUsage: "I need help, please.",
        audio: "audio/ajuda.mp3"
      },
      {
        word: "falar",
        translation: "to speak",
        usage: "Eu falo um pouco de português.",
        englishUsage: "I speak a little Portuguese.",
        audio: "audio/falar.mp3"
      },
      {
        word: "compreender",
        translation: "to understand",
        usage: "Não compreendo bem.",
        englishUsage: "I don't understand well.",
        audio: "audio/compreender.mp3"
      },
      {
        word: "supermercado",
        translation: "supermarket",
        usage: "Vou ao supermercado comprar pão.",
        englishUsage: "I'm going to the supermarket to buy bread.",
        audio: "audio/supermercado.mp3"
      },
      {
        word: "farmácia",
        translation: "pharmacy",
        usage: "Preciso de ir à farmácia comprar medicamentos.",
        englishUsage: "I need to go to the pharmacy to buy medicine.",
        audio: "audio/farmacia.mp3"
      },
      {
        word: "banco",
        translation: "bank",
        usage: "Vou ao banco levantar dinheiro.",
        englishUsage: "I'm going to the bank to withdraw money.",
        audio: "audio/banco.mp3"
      },
      {
        word: "correios",
        translation: "post office",
        usage: "Preciso de ir aos correios enviar uma carta.",
        englishUsage: "I need to go to the post office to send a letter.",
        audio: "audio/correios.mp3"
      }
    ],
    advanced: [
      {
        word: "atendimento",
        translation: "customer service",
        usage: "O atendimento nesta loja é excelente.",
        englishUsage: "The customer service in this store is excellent.",
        audio: "audio/atendimento.mp3"
      },
      {
        word: "agendamento",
        translation: "appointment",
        usage: "Preciso de fazer um agendamento para renovar o meu cartão.",
        englishUsage: "I need to make an appointment to renew my card.",
        audio: "audio/agendamento.mp3"
      },
      {
        word: "morada",
        translation: "address",
        usage: "Qual é a sua morada atual?",
        englishUsage: "What is your current address?",
        audio: "audio/morada.mp3"
      },
      {
        word: "código postal",
        translation: "postal code",
        usage: "Qual é o código postal da sua área?",
        englishUsage: "What is the postal code for your area?",
        audio: "audio/codigo-postal.mp3"
      },
      {
        word: "freguesia",
        translation: "parish/district",
        usage: "Em que freguesia mora?",
        englishUsage: "In which parish/district do you live?",
        audio: "audio/freguesia.mp3"
      },
      {
        word: "concelho",
        translation: "municipality",
        usage: "O concelho de Lisboa tem várias freguesias.",
        englishUsage: "The municipality of Lisbon has several parishes.",
        audio: "audio/concelho.mp3"
      },
      {
        word: "distrito",
        translation: "district",
        usage: "Portugal está dividido em 18 distritos.",
        englishUsage: "Portugal is divided into 18 districts.",
        audio: "audio/distrito.mp3"
      }
    ]
  },
  transportation: {
    beginner: [
      {
        word: "comboio",
        translation: "train",
        usage: "Vou apanhar o comboio para Lisboa.",
        englishUsage: "I'm going to catch the train to Lisbon.",
        audio: "audio/comboio.mp3"
      },
      {
        word: "autocarro",
        translation: "bus",
        usage: "O autocarro passa de 30 em 30 minutos.",
        englishUsage: "The bus comes every 30 minutes.",
        audio: "audio/autocarro.mp3"
      },
      {
        word: "metro",
        translation: "subway",
        usage: "O metro é a forma mais rápida de viajar na cidade.",
        englishUsage: "The subway is the fastest way to travel in the city.",
        audio: "audio/metro.mp3"
      },
      {
        word: "bilhete",
        translation: "ticket",
        usage: "Preciso de comprar um bilhete de ida e volta.",
        englishUsage: "I need to buy a round-trip ticket.",
        audio: "audio/bilhete.mp3"
      },
      {
        word: "estação",
        translation: "station",
        usage: "A estação de comboios fica perto do centro.",
        englishUsage: "The train station is near the center.",
        audio: "audio/estacao.mp3"
      },
      {
        word: "paragem",
        translation: "stop",
        usage: "A paragem de autocarro é ali.",
        englishUsage: "The bus stop is over there.",
        audio: "audio/paragem.mp3"
      },
      {
        word: "elétrico",
        translation: "tram",
        usage: "O elétrico 28 é muito popular entre os turistas.",
        englishUsage: "Tram 28 is very popular among tourists.",
        audio: "audio/eletrico.mp3"
      },
      {
        word: "táxi",
        translation: "taxi",
        usage: "Vou apanhar um táxi para o aeroporto.",
        englishUsage: "I'm going to take a taxi to the airport.",
        audio: "audio/taxi.mp3"
      },
      {
        word: "aeroporto",
        translation: "airport",
        usage: "O aeroporto de Lisboa chama-se Humberto Delgado.",
        englishUsage: "Lisbon's airport is called Humberto Delgado.",
        audio: "audio/aeroporto.mp3"
      },
      {
        word: "avião",
        translation: "airplane",
        usage: "O avião para o Porto parte às 15h00.",
        englishUsage: "The plane to Porto leaves at 3:00 PM.",
        audio: "audio/aviao.mp3"
      }
    ],
    advanced: [
      {
        word: "passe",
        translation: "pass (transport)",
        usage: "Tenho um passe mensal para os transportes públicos.",
        englishUsage: "I have a monthly pass for public transportation.",
        audio: "audio/passe.mp3"
      },
      {
        word: "carreira",
        translation: "bus route",
        usage: "Qual é a carreira que vai para o centro?",
        englishUsage: "Which bus route goes to the center?",
        audio: "audio/carreira.mp3"
      },
      {
        word: "horário",
        translation: "schedule",
        usage: "Pode mostrar-me o horário dos comboios?",
        englishUsage: "Can you show me the train schedule?",
        audio: "audio/horario.mp3"
      },
      {
        word: "atraso",
        translation: "delay",
        usage: "O comboio tem um atraso de 20 minutos.",
        englishUsage: "The train has a 20-minute delay.",
        audio: "audio/atraso.mp3"
      },
      {
        word: "transbordos",
        translation: "transfers",
        usage: "Quantos transbordos tenho de fazer?",
        englishUsage: "How many transfers do I have to make?",
        audio: "audio/transbordos.mp3"
      }
    ]
  },
  food: {
    beginner: [
      {
        word: "restaurante",
        translation: "restaurant",
        usage: "Vamos jantar naquele restaurante.",
        englishUsage: "Let's have dinner at that restaurant.",
        audio: "audio/restaurante.mp3"
      },
      {
        word: "café",
        translation: "coffee/café",
        usage: "Vamos tomar um café?",
        englishUsage: "Shall we have a coffee?",
        audio: "audio/cafe.mp3"
      },
      {
        word: "pão",
        translation: "bread",
        usage: "O pão português é muito bom.",
        englishUsage: "Portuguese bread is very good.",
        audio: "audio/pao.mp3"
      },
      {
        word: "água",
        translation: "water",
        usage: "Posso ter um copo de água, por favor?",
        englishUsage: "Can I have a glass of water, please?",
        audio: "audio/agua.mp3"
      },
      {
        word: "vinho",
        translation: "wine",
        usage: "Portugal é famoso pelo seu vinho.",
        englishUsage: "Portugal is famous for its wine.",
        audio: "audio/vinho.mp3"
      },
      {
        word: "pequeno-almoço",
        translation: "breakfast",
        usage: "O que costuma comer ao pequeno-almoço?",
        englishUsage: "What do you usually eat for breakfast?",
        audio: "audio/pequeno-almoco.mp3"
      },
      {
        word: "almoço",
        translation: "lunch",
        usage: "Vamos almoçar juntos?",
        englishUsage: "Shall we have lunch together?",
        audio: "audio/almoco.mp3"
      },
      {
        word: "jantar",
        translation: "dinner",
        usage: "O jantar é servido às 20h00.",
        englishUsage: "Dinner is served at 8:00 PM.",
        audio: "audio/jantar.mp3"
      },
      {
        word: "sobremesa",
        translation: "dessert",
        usage: "Que sobremesa recomenda?",
        englishUsage: "What dessert do you recommend?",
        audio: "audio/sobremesa.mp3"
      },
      {
        word: "conta",
        translation: "bill",
        usage: "Pode trazer a conta, por favor?",
        englishUsage: "Can you bring the bill, please?",
        audio: "audio/conta.mp3"
      }
    ],
    advanced: [
      {
        word: "bacalhau",
        translation: "codfish",
        usage: "O bacalhau é um prato tradicional português.",
        englishUsage: "Codfish is a traditional Portuguese dish.",
        audio: "audio/bacalhau.mp3"
      },
      {
        word: "pastel de nata",
        translation: "custard tart",
        usage: "O pastel de nata é uma sobremesa típica portuguesa.",
        englishUsage: "The custard tart is a typical Portuguese dessert.",
        audio: "audio/pastel-nata.mp3"
      },
      {
        word: "francesinha",
        translation: "francesinha (sandwich)",
        usage: "A francesinha é uma especialidade do Porto.",
        englishUsage: "Francesinha is a specialty from Porto.",
        audio: "audio/francesinha.mp3"
      },
      {
        word: "cozido à portuguesa",
        translation: "Portuguese stew",
        usage: "O cozido à portuguesa leva vários tipos de carne e legumes.",
        englishUsage: "Portuguese stew includes various types of meat and vegetables.",
        audio: "audio/cozido.mp3"
      },
      {
        word: "sardinha",
        translation: "sardine",
        usage: "No verão, as sardinhas assadas são muito populares.",
        englishUsage: "In summer, grilled sardines are very popular.",
        audio: "audio/sardinha.mp3"
      }
    ]
  },
  health: {
    beginner: [
      {
        word: "médico",
        translation: "doctor",
        usage: "Preciso de marcar uma consulta com o médico.",
        englishUsage: "I need to make an appointment with the doctor.",
        audio: "audio/medico.mp3"
      },
      {
        word: "hospital",
        translation: "hospital",
        usage: "O hospital fica perto da estação de metro.",
        englishUsage: "The hospital is near the metro station.",
        audio: "audio/hospital.mp3"
      },
      {
        word: "farmácia",
        translation: "pharmacy",
        usage: "Há uma farmácia aberta 24 horas?",
        englishUsage: "Is there a pharmacy open 24 hours?",
        audio: "audio/farmacia.mp3"
      },
      {
        word: "doente",
        translation: "sick",
        usage: "Estou doente há três dias.",
        englishUsage: "I have been sick for three days.",
        audio: "audio/doente.mp3"
      },
      {
        word: "dor",
        translation: "pain",
        usage: "Tenho dor de cabeça.",
        englishUsage: "I have a headache.",
        audio: "audio/dor.mp3"
      },
      {
        word: "febre",
        translation: "fever",
        usage: "Tenho febre alta.",
        englishUsage: "I have a high fever.",
        audio: "audio/febre.mp3"
      },
      {
        word: "medicamento",
        translation: "medicine",
        usage: "Preciso de tomar este medicamento três vezes por dia.",
        englishUsage: "I need to take this medicine three times a day.",
        audio: "audio/medicamento.mp3"
      },
      {
        word: "receita",
        translation: "prescription",
        usage: "O médico deu-me uma receita para antibióticos.",
        englishUsage: "The doctor gave me a prescription for antibiotics.",
        audio: "audio/receita.mp3"
      }
    ]
  }
};
    
    console.log(`Loaded ${this.cards.length} cards for category: ${this.category}, level: ${this.level}`);
  }
  
  renderCard() {
    if (this.cards.length === 0) {
      console.error('No cards available');
      return;
    }
    
    const card = this.cards[this.currentIndex];
    
    // Update front of card
    if (this.wordElement) {
      this.wordElement.textContent = card.word || card.portuguese || '';
    }
    
    // Update back of card
    if (this.translationElement) {
      this.translationElement.textContent = card.translation || '';
    }
    
    if (this.usageElement) {
      this.usageElement.textContent = card.usage || '';
    }
    
    if (this.englishUsageElement) {
      this.englishUsageElement.textContent = card.englishUsage || '';
    }
    
    // Reset card flip
    if (this.flashcardElement) {
      this.flashcardElement.classList.remove('flipped');
    }
    
    // Update card counter
    if (this.currentCardElement) {
      this.currentCardElement.textContent = this.currentIndex + 1;
    }
    
    if (this.totalCardsElement) {
      this.totalCardsElement.textContent = this.cards.length;
    }
    
    // Update audio button if available
    const audioBtn = document.querySelector('.audio-btn');
    if (audioBtn) {
      audioBtn.onclick = () => {
        if (card.audio) {
          const audio = new Audio(`assets/${card.audio}`);
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Audio file not found. Please try another card.');
          });
        } else {
          alert('No audio available for this card.');
        }
      };
    }
  }
  
  attachEventListeners() {
    // Category selection
    if (this.categoryButtons) {
      this.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.categoryButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.category = btn.getAttribute('data-category');
          this.currentIndex = 0;
          this.loadCards();
          this.renderCard();
        });
      });
    }
    
    // Level selection
    if (this.levelButtons) {
      this.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.levelButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.level = btn.getAttribute('data-level');
          localStorage.setItem('userLevel', this.level);
          this.currentIndex = 0;
          this.loadCards();
          this.renderCard();
        });
      });
    }
    
    // Flip card
    if (this.flipButton) {
      this.flipButton.addEventListener('click', () => {
        if (this.flashcardElement) {
          this.flashcardElement.classList.toggle('flipped');
        }
      });
    }
    
    // Navigate cards
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderCard();
        }
      });
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        if (this.currentIndex < this.cards.length - 1) {
          this.currentIndex++;
          this.renderCard();
          
          // Track progress
          if (window.progressTracker) {
            window.progressTracker.updateFlashcardProgress(this.category, this.currentIndex, this.cards.length);
          }
        }
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle keys if flashcards section is active
      if (document.querySelector('#flashcards.active')) {
        if (e.key === 'ArrowRight') {
          if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.renderCard();
          }
        } else if (e.key === 'ArrowLeft') {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
          }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
          // Flip card on spacebar
          if (this.flashcardElement) {
            this.flashcardElement.classList.toggle('flipped');
          }
          e.preventDefault(); // Prevent scrolling with spacebar
        }
      }
    });
  }
  
  setLevel(level) {
    this.level = level;
    localStorage.setItem('userLevel', level);
    this.currentIndex = 0;
    this.loadCards();
    this.renderCard();
  }
  
  // Helper method to shuffle array
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('#flashcards')) {
    const flashcardManager = new FlashcardManager();
    flashcardManager.init();
    
    // Make it globally accessible
    window.flashcardManager = flashcardManager;
  }
});
