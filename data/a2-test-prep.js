const a2TestPrep = {
    listening: [
        {
            type: 'dialogue',
            audio: 'audio/dialogue1.mp3',
            transcript: 'A: Bom dia, posso ajudar?\nB: Bom dia. Preciso de informações sobre como obter a cidadania portuguesa.\nA: Claro. Tem de preencher o requerimento e apresentar os documentos necessários.\nB: Quais são os documentos necessários?\nA: Precisa do seu passaporte, comprovativo de residência, certificado de língua portuguesa nível A2 e registo criminal.',
            questions: [
                {
                    question: 'O que a pessoa quer fazer?',
                    options: [
                        'Obter cidadania portuguesa',
                        'Comprar um bilhete',
                        'Encontrar um hotel',
                        'Aprender português'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual documento NÃO foi mencionado como necessário?',
                    options: [
                        'Certidão de nascimento',
                        'Passaporte',
                        'Comprovativo de residência',
                        'Registo criminal'
                    ],
                    correct: 0
                },
                {
                    question: 'Que nível de português é necessário?',
                    options: [
                        'A2',
                        'B1',
                        'B2',
                        'C1'
                    ],
                    correct: 0
                }
            ]
        },
        {
            type: 'dialogue',
            audio: 'audio/dialogue2.mp3',
            transcript: 'A: Olá, boa tarde. Queria marcar uma consulta, por favor.\nB: Boa tarde. Para que especialidade?\nA: Para medicina geral. Não me sinto bem.\nB: Tem cartão de utente?\nA: Sim, tenho aqui.\nB: Obrigada. Pode vir amanhã às 10h00?\nA: Sim, está bom. Obrigado.',
            questions: [
                {
                    question: 'Onde está a decorrer esta conversa?',
                    options: [
                        'Num centro de saúde',
                        'Numa loja',
                        'Num restaurante',
                        'Numa escola'
                    ],
                    correct: 0
                },
                {
                    question: 'O que a pessoa quer fazer?',
                    options: [
                        'Marcar uma consulta médica',
                        'Comprar medicamentos',
                        'Pedir informações sobre um médico',
                        'Fazer um exame'
                    ],
                    correct: 0
                },
                {
                    question: 'Para quando ficou marcada a consulta?',
                    options: [
                        'Amanhã às 10h00',
                        'Hoje à tarde',
                        'Na próxima semana',
                        'Não ficou marcada'
                    ],
                    correct: 0
                }
            ]
        },
        {
            type: 'dialogue',
            audio: 'audio/dialogue3.mp3',
            transcript: 'Na loja de cidadania:\nFuncionário: Bom dia, em que posso ajudar?\nCliente: Bom dia. Gostaria de informações sobre como obter a cidadania portuguesa.\nFuncionário: Claro. É cidadão de um país da União Europeia?\nCliente: Não, sou canadiano.\nFuncionário: Entendo. Para cidadãos não-europeus, precisa de residir legalmente em Portugal por pelo menos cinco anos.\nCliente: Sim, já vivo aqui há seis anos.\nFuncionário: Ótimo. Também precisa de comprovar conhecimento da língua portuguesa, nível A2.',
            questions: [
                {
                    question: 'De que país é o cliente?',
                    options: [
                        'Canadá',
                        'Portugal',
                        'União Europeia',
                        'Brasil'
                    ],
                    correct: 0
                },
                {
                    question: 'Quanto tempo o cliente vive em Portugal?',
                    options: [
                        '6 anos',
                        '5 anos',
                        '7 anos',
                        'Menos de 5 anos'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual nível de português é necessário para a cidadania?',
                    options: [
                        'A2',
                        'A1',
                        'B1',
                        'B2'
                    ],
                    correct: 0
                }
            ]
        },
        {
            type: 'dialogue',
            audio: 'audio/dialogue4.mp3',
            transcript: 'No centro de saúde:\nRecepcionista: Bom dia, posso ajudar?\nPaciente: Bom dia. Tenho uma consulta marcada com a Dra. Silva às 10h30.\nRecepcionista: Qual é o seu nome, por favor?\nPaciente: Maria Santos.\nRecepcionista: Deixe-me verificar... Sim, está confirmado. Pode esperar na sala de espera, por favor?\nPaciente: Obrigada. Onde fica a casa de banho?\nRecepcionista: É no final do corredor, à direita.',
            questions: [
                {
                    question: 'A que horas é a consulta?',
                    options: [
                        '10h30',
                        '9h30',
                        '10h00',
                        '11h00'
                    ],
                    correct: 0
                },
                {
                    question: 'O que a paciente pergunta no final?',
                    options: [
                        'Onde é a casa de banho',
                        'Onde é a farmácia',
                        'Quanto tempo vai demorar',
                        'Se pode beber água'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual é o nome da médica?',
                    options: [
                        'Dra. Silva',
                        'Dra. Santos',
                        'Dra. Maria',
                        'Dra. Oliveira'
                    ],
                    correct: 0
                }
            ]
        }
    ],
    reading: [
        {
            text: `# Requisitos para a Cidadania Portuguesa

Para obter a cidadania portuguesa, é necessário cumprir vários requisitos:

1. Residir legalmente em Portugal por pelo menos 5 anos
2. Ter conhecimento suficiente da língua portuguesa (nível A2)
3. Não ter sido condenado por crime com pena de prisão igual ou superior a 3 anos
4. Ter ligação efetiva à comunidade portuguesa

Os documentos necessários incluem:
- Passaporte válido
- Autorização de residência
- Certificado de conhecimento da língua portuguesa
- Comprovativo de meios de subsistência
- Registo criminal do país de origem

O processo pode ser iniciado online através do portal do SEF ou presencialmente nas Conservatórias do Registo Civil.`,
            questions: [
                {
                    question: 'Quantos anos de residência legal são necessários para obter a cidadania portuguesa?',
                    options: [
                        '5 anos',
                        '3 anos',
                        '10 anos',
                        '2 anos'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual é o nível mínimo de conhecimento da língua portuguesa exigido?',
                    options: [
                        'A2',
                        'B1',
                        'A1',
                        'B2'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual dos seguintes documentos NÃO é mencionado como necessário?',
                    options: [
                        'Certidão de casamento',
                        'Passaporte válido',
                        'Registo criminal do país de origem',
                        'Autorização de residência'
                    ],
                    correct: 0
                },
                {
                    question: 'Onde pode ser iniciado o processo de cidadania?',
                    options: [
                        'No portal do SEF ou nas Conservatórias do Registo Civil',
                        'Apenas nas embaixadas portuguesas',
                        'Apenas no Ministério da Justiça',
                        'Em qualquer câmara municipal'
                    ],
                    correct: 0
                }
            ]
        },
        {
            text: `# Transportes Públicos em Lisboa

Lisboa tem uma rede de transportes públicos que inclui metro, autocarros, elétricos e comboios.

O metro de Lisboa tem quatro linhas: azul, amarela, verde e vermelha. Funciona todos os dias das 6h30 às 1h00.

Os autocarros da Carris servem toda a cidade e arredores. A maioria funciona das 6h00 às 24h00, mas há também autocarros noturnos.

Os elétricos são uma forma tradicional e turística de visitar a cidade, especialmente o famoso elétrico 28 que passa por muitos pontos históricos.

Para usar os transportes públicos, pode comprar bilhetes individuais ou o cartão "Viva Viagem", que pode ser carregado com viagens ou passes mensais.`,
            questions: [
                {
                    question: 'Quantas linhas tem o metro de Lisboa?',
                    options: [
                        'Quatro',
                        'Três',
                        'Cinco',
                        'Seis'
                    ],
                    correct: 0
                },
                {
                    question: 'Até que horas funciona o metro de Lisboa?',
                    options: [
                        '1h00',
                        '24h00',
                        '23h00',
                        '2h00'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual é o nome do cartão que pode ser usado nos transportes públicos?',
                    options: [
                        'Viva Viagem',
                        'Lisboa Card',
                        'Metro Card',
                        'Carris Pass'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual elétrico é mencionado como famoso para turistas?',
                    options: [
                        'Elétrico 28',
                        'Elétrico 15',
                        'Elétrico 12',
                        'Elétrico 25'
                    ],
                    correct: 0
                }
            ]
        },
        {
            text: `# Sistema de Saúde em Portugal

O Sistema Nacional de Saúde (SNS) em Portugal oferece cuidados de saúde a todos os cidadãos e residentes legais.

Para aceder aos serviços do SNS, é necessário ter um número de utente e um cartão de utente, que pode ser obtido no centro de saúde da área de residência.

Os centros de saúde são a porta de entrada para o SNS e oferecem cuidados primários, incluindo consultas de medicina geral e familiar, enfermagem e vacinação.

Em caso de emergência, deve dirigir-se às urgências do hospital mais próximo ou ligar para o número de emergência 112.

Os medicamentos prescritos por médicos do SNS têm comparticipação do Estado, o que significa que os utentes pagam apenas uma parte do custo.`,
            questions: [
                {
                    question: 'O que é necessário para aceder aos serviços do SNS?',
                    options: [
                        'Número de utente e cartão de utente',
                        'Apenas o cartão de cidadão',
                        'Apenas o passaporte',
                        'Seguro de saúde privado'
                    ],
                    correct: 0
                },
                {
                    question: 'Onde se pode obter o cartão de utente?',
                    options: [
                        'No centro de saúde da área de residência',
                        'Em qualquer hospital',
                        'Na farmácia',
                        'Na câmara municipal'
                    ],
                    correct: 0
                },
                {
                    question: 'Qual é o número de emergência em Portugal?',
                    options: [
                        '112',
                        '911',
                        '115',
                        '118'
                    ],
                    correct: 0
                },
                {
                    question: 'O que acontece com os medicamentos prescritos por médicos do SNS?',
                    options: [
                        'Têm comparticipação do Estado',
                        'São totalmente gratuitos',
                        'Não têm qualquer desconto',
                        'Só são gratuitos para idosos'
                    ],
                    correct: 0
                }
            ]
        }
    ],
    speaking: [
        {
            scenario: 'Entrevista de Cidadania',
            prompts: [
                'Apresente-se e fale sobre si (nome, idade, nacionalidade, profissão).',
                'Por que quer obter a cidadania portuguesa?',
                'Há quanto tempo vive em Portugal?',
                'O que mais gosta em Portugal?',
                'Fale sobre a sua rotina diária em Portugal.'
            ],
            expectedResponses: [
                'Olá, o meu nome é [nome]. Tenho [idade] anos e sou [nacionalidade]. Trabalho como [profissão].',
                'Quero obter a cidadania portuguesa porque vivo aqui há vários anos e gosto muito do país e da cultura.',
                'Vivo em Portugal há [número] anos. Vim para cá em [ano].',
                'Gosto muito da comida portuguesa, especialmente do bacalhau. Também gosto do clima e das pessoas, que são muito simpáticas.',
                'Todos os dias acordo às 7h00, tomo o pequeno-almoço e vou trabalhar. Almoço por volta das 13h00 e saio do trabalho às 18h00. À noite, janto em casa e às vezes saio com amigos.'
            ]
        },
        {
            scenario: 'No Restaurante',
            prompts: [
                'Peça uma mesa para duas pessoas.',
                'Pergunte ao empregado o que ele recomenda.',
                'Faça um pedido de comida e bebida.',
                'Peça a conta.'
            ],
            expectedResponses: [
                'Boa noite. Tem uma mesa para duas pessoas, por favor?',
                'O que recomenda hoje?',
                'Eu quero [prato] e um copo de [bebida], por favor.',
                'A conta, por favor.'
            ]
        },
        {
            scenario: 'No Centro de Saúde',
            prompts: [
                'Explique que não se sente bem e quais são os seus sintomas.',
                'Responda às perguntas do médico sobre o seu histórico médico.',
                'Pergunte sobre o tratamento recomendado.',
                'Agradeça ao médico.'
            ],
            expectedResponses: [
                'Bom dia, doutor. Não me sinto bem. Tenho dores de cabeça e febre há dois dias.',
                'Não, não tenho alergias. Sim, tomo medicamentos para a tensão alta.',
                'Quanto tempo devo tomar este medicamento? Há algum efeito secundário?',
                'Muito obrigado(a) pela sua ajuda, doutor(a).'
            ]
        },
        {
            scenario: 'Procurando Emprego',
            prompts: [
                'Apresente-se numa entrevista de emprego.',
                'Fale sobre a sua experiência profissional.',
                'Explique por que está interessado neste trabalho.',
                'Pergunte sobre o horário e o salário.'
            ],
            expectedResponses: [
                'Bom dia, chamo-me [nome] e tenho [idade] anos. Sou formado em [área] e tenho experiência em [setor].',
                'Trabalhei durante [número] anos como [profissão]. As minhas principais responsabilidades eram [tarefas].',
                'Estou interessado neste trabalho porque gosto muito desta área e quero desenvolver as minhas competências.',
                'Qual é o horário de trabalho? E qual é o salário oferecido?'
            ]
        },
        {
            scenario: 'Na Loja',
            prompts: [
                'Peça ajuda a um funcionário para encontrar um produto.',
                'Pergunte sobre o preço e se há descontos.',
                'Explique que quer devolver um produto e porquê.',
                'Peça um recibo.'
            ],
            expectedResponses: [
                'Bom dia, pode ajudar-me a encontrar [produto], por favor?',
                'Quanto custa este [produto]? Há algum desconto?',
                'Queria devolver este [produto] porque não funciona corretamente.',
                'Pode dar-me um recibo, por favor?'
            ]
        }
    ],
    writing: [
        {
            task: 'Escreva um email para um amigo a convidar para jantar',
            instructions: 'Escreva 40-50 palavras. Inclua: saudação, convite, data e hora, despedida.',
            example: `Olá Maria,

Como estás? Gostaria de te convidar para jantar na minha casa no próximo sábado, dia 15, às 20h00.

Espero que possas vir!

Abraços,
João`
        },
        {
            task: 'Escreva uma mensagem a cancelar uma consulta',
            instructions: 'Escreva 30-40 palavras. Inclua: saudação, motivo do cancelamento, pedido de remarcação, despedida.',
            example: `Bom dia,

Não poderei comparecer à consulta marcada para amanhã, dia 10, às 15h00, por motivos de saúde.

Seria possível remarcar para a próxima semana?

Obrigado,
António Silva`
        },
        {
            task: 'Email Formal',
            instructions: 'Escreva um email para solicitar informações sobre o processo de cidadania.',
            example: `Exmo. Senhor/Senhora,

Espero que esta mensagem o/a encontre bem.

Venho por este meio solicitar informações sobre o processo de obtenção da cidadania portuguesa. Sou cidadão(ã) canadiano(a) e resido em Portugal há seis anos com autorização de residência válida.

Gostaria de saber quais os documentos necessários para iniciar o processo e onde devo apresentá-los.

Agradeço antecipadamente a sua atenção.

Com os melhores cumprimentos,
[Seu Nome]`
        },
        {
            task: 'Formulário',
            instructions: 'Preencha um formulário com os seus dados pessoais.',
            fields: [
                'Nome completo',
                'Data de nascimento',
                'Nacionalidade',
                'Morada em Portugal',
                'Número de telefone',
                'Email',
                'Motivo do pedido'
            ]
        }
    ],
    grammar: [
        {
            topic: 'Presente do Indicativo',
            explanation: 'O presente do indicativo é usado para falar de ações habituais ou estados permanentes.',
            examples: [
                'Eu falo português todos os dias.',
                'Tu comes no restaurante às vezes?',
                'Ele vive em Lisboa há cinco anos.'
            ],
            questions: [
                {
                    question: 'Eu _____ (falar) português todos os dias.',
                    options: [
                        'falo',
                        'falas',
                        'fala',
                        'falamos'
                    ],
                    correct: 0
                },
                {
                    question: 'Tu _____ (viver) em Portugal?',
                    options: [
                        'vives',
                        'vivo',
                        'vive',
                        'vivem'
                    ],
                    correct: 0
                },
                {
                    question: 'Nós _____ (trabalhar) num escritório.',
                    options: [
                        'trabalhamos',
                        'trabalho',
                        'trabalham',
                        'trabalhas'
                    ],
                    correct: 0
                },
                {
                    question: 'Eles _____ (estudar) português.',
                    options: [
                        'estudam',
                        'estuda',
                        'estudas',
                        'estudamos'
                    ],
                    correct: 0
                }
            ]
        },
        {
            topic: 'Pretérito Perfeito',
            explanation: 'O pretérito perfeito é usado para falar de ações concluídas no passado.',
            examples: [
                'Ontem eu falei com o meu amigo.',
                'Tu comeste no restaurante?',
                'Ele viveu em Lisboa durante cinco anos.'
            ],
            questions: [
                {
                    question: 'Ontem eu _____ (ir) ao supermercado.',
                    options: [
                        'fui',
                        'foi',
                        'foste',
                        'vou'
                    ],
                    correct: 0
                },
                {
                    question: 'Tu _____ (comer) no restaurante?',
                    options: [
                        'comeste',
                        'comeu',
                        'comi',
                        'comemos'
                    ],
                    correct: 0
                },
                {
                    question: 'Eles _____ (chegar) atrasados.',
                    options: [
                        'chegaram',
                        'chegou',
                        'chegaste',
                        'chegámos'
                    ],
                    correct: 0
                },
                {
                    question: 'Nós _____ (viver) em Lisboa no ano passado.',
                    options: [
                        'vivemos',
                        'viveram',
                        'vivi',
                        'viveste'
                    ],
                    correct: 0
                }
            ]
        },
        {
            topic: 'Futuro Simples',
            explanation: 'O futuro simples é usado para falar de ações que acontecerão no futuro.',
            examples: [
                'Amanhã eu falarei com o meu chefe.',
                'Tu comerás no restaurante?',
                'Ele viverá em Lisboa no próximo ano.'
            ],
            questions: [
                {
                    question: 'Amanhã eu _____ (ir) ao cinema.',
                    options: [
                        'irei',
                        'vou',
                        'fui',
                        'ia'
                    ],
                    correct: 0
                },
                {
                    question: 'Tu _____ (visitar) Portugal no próximo verão?',
                    options: [
                        'visitarás',
                        'visitaste',
                        'visitas',
                        'visitavas'
                    ],
                    correct: 0
                },
                {
                    question: 'Nós _____ (comprar) uma casa nova.',
                    options: [
                        'compraremos',
                        'compramos',
                        'comprámos',
                        'comprávamos'
                    ],
                    correct: 0
                }
            ]
        }
    ],
    vocabulary: [
        {
            topic: 'Cidadania e Documentos',
            words: [
                {
                    portuguese: 'cidadania',
                    english: 'citizenship'
                },
                {
                    portuguese: 'passaporte',
                    english: 'passport'
                },
                {
                    portuguese: 'cartão de cidadão',
                    english: 'citizen card'
                },
                {
                    portuguese: 'autorização de residência',
                    english: 'residence permit'
                },
                {
                    portuguese: 'certidão',
                    english: 'certificate'
                },
                {
                    portuguese: 'requerimento',
                    english: 'application form'
                },
                {
                    portuguese: 'nacionalidade',
                    english: 'nationality'
                },
                {
                    portuguese: 'estrangeiro',
                    english: 'foreigner'
                }
            ]
        },
        {
            topic: 'Saúde',
            words: [
                {
                    portuguese: 'médico/médica',
                    english: 'doctor'
                },
                {
                    portuguese: 'hospital',
                    english: 'hospital'
                },
                {
                    portuguese: 'farmácia',
                    english: 'pharmacy'
                },
                {
                    portuguese: 'consulta',
                    english: 'appointment'
                },
                {
                    portuguese: 'doente',
                    english: 'sick'
                },
                {
                    portuguese: 'medicamento',
                    english: 'medicine'
                },
                {
                    portuguese: 'dor',
                    english: 'pain'
                },
                {
                    portuguese: 'febre',
                    english: 'fever'
                }
            ]
        },
        {
            topic: 'Transportes',
            words: [
                {
                    portuguese: 'comboio',
                    english: 'train'
                },
                {
                    portuguese: 'autocarro',
                    english: 'bus'
                },
                {
                    portuguese: 'metro',
                    english: 'subway'
                },
                {
                    portuguese: 'elétrico',
                    english: 'tram'
                },
                {
                    portuguese: 'bilhete',
                    english: 'ticket'
                },
                {
                    portuguese: 'estação',
                    english: 'station'
                },
                {
                    portuguese: 'paragem',
                    english: 'stop'
                },
                {
                    portuguese: 'horário',
                    english: 'schedule'
                }
            ]
        },
        {
            topic: 'Alimentação',
            words: [
                {
                    portuguese: 'restaurante',
                    english: 'restaurant'
                },
                {
                    portuguese: 'café',
                    english: 'coffee/café'
                },
                {
                    portuguese: 'pequeno-almoço',
                    english: 'breakfast'
                },
                {
                    portuguese: 'almoço',
                    english: 'lunch'
                },
                {
                    portuguese: 'jantar',
                    english: 'dinner'
                },
                {
                    portuguese: 'prato',
                    english: 'dish'
                },
                {
                    portuguese: 'bebida',
                    english: 'drink'
                },
                {
                    portuguese: 'conta',
                    english: 'bill'
                }
            ]
        }
    ],
    mockExam: {
        reading: {
            time: 60, // minutes
            sections: [
                {
                    text: 'Um texto sobre a história de Portugal...',
                    questions: [
                        // Questions about the text
                    ]
                },
                {
                    text: 'Um texto sobre a cultura portuguesa...',
                    questions: [
                        // Questions about the text
                    ]
                }
            ]
        },
        listening: {
            time: 30, // minutes
            sections: [
                {
                    audio: 'mock-exam-listening-1.mp3',
                    questions: [
                        // Questions about the audio
                    ]
                },
                {
                    audio: 'mock-exam-listening-2.mp3',
                    questions: [
                        // Questions about the audio
                    ]
                }
            ]
        },
        writing: {
            time: 60, // minutes
            tasks: [
                {
                    instructions: 'Escreva um email para um amigo sobre as suas férias em Portugal (80-100 palavras).',
                    points: 20
                },
                {
                    instructions: 'Escreva um texto sobre a sua experiência de aprender português (100-120 palavras).',
                    points: 30
                }
            ]
        },
        speaking: {
            time: 15, // minutes
            tasks: [
                {
                    type: 'Apresentação pessoal',
                    duration: 2, // minutes
                    points: 10
                },
                {
                    type: 'Descrição de imagem',
                    duration: 3, // minutes
                    points: 15
                },
                {
                    type: 'Diálogo com o examinador',
                    duration: 5, // minutes
                    points: 25
                }
            ]
        }
    }
};
