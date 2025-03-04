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
        }
    ],
    grammar: [
        {
            topic: 'Presente do Indicativo',
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
                }
            ]
        },
        {
            topic: 'Pretérito Perfeito',
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
                }
            ]
        }
    ],
    vocabulary
