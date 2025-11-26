const fs = require('fs');
const path = require('path');

// Load JSON data files
const loadData = (filename) => {
  const filePath = path.join(__dirname, '..', '..', 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Vocabulary data (Module 1)
let vocabularyData = null;
const getVocabularyData = () => {
  if (!vocabularyData) {
    vocabularyData = loadData('game_vocab_database_complete.json');
  }
  return vocabularyData;
};

// Collocation data (Module 2)
let collocationData = null;
const getCollocationData = () => {
  if (!collocationData) {
    const rawData = loadData('collocation_error_database.json');
    const db = rawData.collocation_error_database || rawData;
    // Combine all error types into one array
    const errors = [
      ...(db.misuse || []).map(e => ({ ...e, error_type: 'misuse' })),
      ...(db.overuse || []).map(e => ({ ...e, error_type: 'overuse' })),
      ...(db.underuse || []).map(e => ({ ...e, error_type: 'underuse' }))
    ];
    collocationData = { errors };
  }
  return collocationData;
};

// Hedging data (Module 3)
let hedgingData = null;
const getHedgingData = () => {
  if (!hedgingData) {
    const rawData = loadData('hedging_training_data.json');
    const trainingItems = rawData.training_items || [];

    // Transform data into formats expected by different game types
    const exercises = [];

    // Create hedging_add exercises with clear, distinct sentences
    const hedgingAddItems = [
      {
        type: 'hedging_add',
        sentence: 'The results _____ indicate a positive correlation between study time and performance.',
        correctAnswer: 'may',
        options: [
          { text: 'may', isCorrect: true },
          { text: 'definitely', isCorrect: false },
          { text: 'always', isCorrect: false },
          { text: 'certainly', isCorrect: false }
        ],
        category: 'modal_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'This treatment _____ be effective for patients with mild symptoms.',
        correctAnswer: 'could',
        options: [
          { text: 'could', isCorrect: true },
          { text: 'will', isCorrect: false },
          { text: 'must', isCorrect: false },
          { text: 'shall', isCorrect: false }
        ],
        category: 'modal_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'The data _____ that there is a link between diet and health outcomes.',
        correctAnswer: 'suggests',
        options: [
          { text: 'suggests', isCorrect: true },
          { text: 'proves', isCorrect: false },
          { text: 'confirms', isCorrect: false },
          { text: 'demonstrates', isCorrect: false }
        ],
        category: 'lexical_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'Climate change is _____ the main cause of rising sea levels.',
        correctAnswer: 'likely',
        options: [
          { text: 'likely', isCorrect: true },
          { text: 'obviously', isCorrect: false },
          { text: 'certainly', isCorrect: false },
          { text: 'definitely', isCorrect: false }
        ],
        category: 'adverbs'
      },
      {
        type: 'hedging_add',
        sentence: 'The experiment _____ shows that temperature affects reaction rate.',
        correctAnswer: 'apparently',
        options: [
          { text: 'apparently', isCorrect: true },
          { text: 'clearly', isCorrect: false },
          { text: 'obviously', isCorrect: false },
          { text: 'undoubtedly', isCorrect: false }
        ],
        category: 'adverbs'
      },
      {
        type: 'hedging_add',
        sentence: 'It _____ that social media influences student behavior.',
        correctAnswer: 'appears',
        options: [
          { text: 'appears', isCorrect: true },
          { text: 'is certain', isCorrect: false },
          { text: 'is obvious', isCorrect: false },
          { text: 'is clear', isCorrect: false }
        ],
        category: 'lexical_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'Further research _____ be needed to confirm these findings.',
        correctAnswer: 'might',
        options: [
          { text: 'might', isCorrect: true },
          { text: 'shall', isCorrect: false },
          { text: 'must', isCorrect: false },
          { text: 'will', isCorrect: false }
        ],
        category: 'modal_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'The study _____ indicates a relationship between sleep and memory.',
        correctAnswer: 'possibly',
        options: [
          { text: 'possibly', isCorrect: true },
          { text: 'certainly', isCorrect: false },
          { text: 'definitely', isCorrect: false },
          { text: 'absolutely', isCorrect: false }
        ],
        category: 'adverbs'
      },
      {
        type: 'hedging_add',
        sentence: 'These findings _____ support the original hypothesis.',
        correctAnswer: 'tend to',
        options: [
          { text: 'tend to', isCorrect: true },
          { text: 'always', isCorrect: false },
          { text: 'completely', isCorrect: false },
          { text: 'definitely', isCorrect: false }
        ],
        category: 'lexical_verbs'
      },
      {
        type: 'hedging_add',
        sentence: 'The relationship between the variables is _____ significant.',
        correctAnswer: 'somewhat',
        options: [
          { text: 'somewhat', isCorrect: true },
          { text: 'absolutely', isCorrect: false },
          { text: 'completely', isCorrect: false },
          { text: 'totally', isCorrect: false }
        ],
        category: 'adverbs'
      }
    ];

    // Create intensity_order exercises (order by hedging strength)
    const intensityExercises = [
      {
        type: 'intensity_order',
        items: [
          { text: 'might', strength: 1 },
          { text: 'may', strength: 2 },
          { text: 'should', strength: 3 }
        ]
      },
      {
        type: 'intensity_order',
        items: [
          { text: 'possibly', strength: 1 },
          { text: 'probably', strength: 2 },
          { text: 'certainly', strength: 3 }
        ]
      },
      {
        type: 'intensity_order',
        items: [
          { text: 'could indicate', strength: 1 },
          { text: 'suggests', strength: 2 },
          { text: 'demonstrates', strength: 3 }
        ]
      },
      {
        type: 'intensity_order',
        items: [
          { text: 'It is possible that', strength: 1 },
          { text: 'It appears that', strength: 2 },
          { text: 'It is evident that', strength: 3 }
        ]
      },
      {
        type: 'intensity_order',
        items: [
          { text: 'seems to', strength: 1 },
          { text: 'tends to', strength: 2 },
          { text: 'is known to', strength: 3 }
        ]
      },
      {
        type: 'intensity_order',
        items: [
          { text: 'unlikely', strength: 1 },
          { text: 'possible', strength: 2 },
          { text: 'probable', strength: 3 }
        ]
      }
    ];

    // Create appropriateness exercises (does this need hedging?)
    const appropriatenessExercises = [
      {
        type: 'appropriateness',
        sentence: 'Water boils at 100 degrees Celsius at sea level.',
        needsHedging: false,
        explanation: 'This is an established scientific fact.'
      },
      {
        type: 'appropriateness',
        sentence: 'This treatment cures all types of cancer.',
        needsHedging: true,
        explanation: 'Medical claims need hedging as effects vary.'
      },
      {
        type: 'appropriateness',
        sentence: 'The Earth orbits around the Sun.',
        needsHedging: false,
        explanation: 'This is a verified scientific fact.'
      },
      {
        type: 'appropriateness',
        sentence: 'Students who study more get better grades.',
        needsHedging: true,
        explanation: 'Correlations are not absolute and need hedging.'
      },
      {
        type: 'appropriateness',
        sentence: 'The experiment results prove the hypothesis completely.',
        needsHedging: true,
        explanation: 'Scientific findings should be hedged; results support rather than prove.'
      },
      {
        type: 'appropriateness',
        sentence: 'DNA contains genetic information.',
        needsHedging: false,
        explanation: 'This is an established biological fact.'
      },
      {
        type: 'appropriateness',
        sentence: 'Social media always improves student learning outcomes.',
        needsHedging: true,
        explanation: 'Absolute claims about complex phenomena need hedging.'
      },
      {
        type: 'appropriateness',
        sentence: 'The speed of light in vacuum is constant.',
        needsHedging: false,
        explanation: 'This is a fundamental physical constant.'
      }
    ];

    exercises.push(...hedgingAddItems);
    exercises.push(...intensityExercises);
    exercises.push(...appropriatenessExercises);

    hedgingData = {
      exercises,
      metadata: rawData.metadata
    };
  }
  return hedgingData;
};

// Linking devices data (Module 4)
let linkingData = null;
const getLinkingData = () => {
  if (!linkingData) {
    const rawData = loadData('linking_devices_exercises.json');
    const rawExercises = rawData.exercises || [];

    // Transform data into formats expected by different game types
    const exercises = [];

    // Create connector_match exercises
    const connectorMatchItems = rawExercises
      .filter(item => item.exercise_type === 'replace' || item.exercise_type === 'identify')
      .slice(0, 20)
      .map(item => {
        // Find sentences around the linking device
        const sentences = item.sentence.split(/[.!?]+/).filter(s => s.trim());
        let sentence1 = '', sentence2 = '';

        for (let i = 0; i < sentences.length; i++) {
          if (sentences[i].toLowerCase().includes(item.linking_device.toLowerCase())) {
            sentence1 = (sentences[i - 1] || sentences[i]).trim();
            sentence2 = (sentences[i + 1] || sentences[i]).trim();
            break;
          }
        }

        if (!sentence1 || !sentence2) {
          sentence1 = sentences[0] ? sentences[0].trim() : 'First sentence';
          sentence2 = sentences[1] ? sentences[1].trim() : 'Second sentence';
        }

        // Limit sentence length
        if (sentence1.length > 100) sentence1 = sentence1.substring(0, 100) + '...';
        if (sentence2.length > 100) sentence2 = sentence2.substring(0, 100) + '...';

        // Determine relation type from category
        const relationMap = {
          causal: 'result',
          contrastive: 'contrast',
          additive: 'addition',
          exemplification: 'example',
          conclusion: 'conclusion',
          sequence: 'sequence'
        };

        // Create options
        const options = [
          { text: item.linking_device, isCorrect: true },
          ...item.alternatives.slice(0, 3).map(alt => ({ text: alt, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        return {
          type: 'connector_match',
          sentence1,
          sentence2,
          relation: relationMap[item.category] || 'connection',
          correctAnswer: item.linking_device,
          options
        };
      });

    // Create paragraph_reorder exercises
    const reorderExercises = [
      {
        type: 'paragraph_reorder',
        sentences: [
          { text: 'First, the researchers collected data from 100 participants.', order: 1 },
          { text: 'Then, they analyzed the results using statistical methods.', order: 2 },
          { text: 'Finally, they drew conclusions based on their findings.', order: 3 },
          { text: 'These conclusions have important implications for future research.', order: 4 }
        ]
      },
      {
        type: 'paragraph_reorder',
        sentences: [
          { text: 'The study examined the effects of sleep on memory.', order: 1 },
          { text: 'Participants were divided into two groups.', order: 2 },
          { text: 'One group slept normally while the other was sleep-deprived.', order: 3 },
          { text: 'The results showed that sleep significantly improves memory retention.', order: 4 }
        ]
      },
      {
        type: 'paragraph_reorder',
        sentences: [
          { text: 'Climate change is a pressing global issue.', order: 1 },
          { text: 'It affects ecosystems, weather patterns, and human societies.', order: 2 },
          { text: 'Therefore, immediate action is required to mitigate its effects.', order: 3 },
          { text: 'In conclusion, international cooperation is essential.', order: 4 }
        ]
      },
      {
        type: 'paragraph_reorder',
        sentences: [
          { text: 'The experiment began with a hypothesis about plant growth.', order: 1 },
          { text: 'Next, seeds were planted in different soil conditions.', order: 2 },
          { text: 'After four weeks, measurements were taken.', order: 3 },
          { text: 'The data confirmed that nutrient-rich soil produced better results.', order: 4 }
        ]
      },
      {
        type: 'paragraph_reorder',
        sentences: [
          { text: 'Social media has transformed communication.', order: 1 },
          { text: 'However, it also raises concerns about privacy.', order: 2 },
          { text: 'Moreover, it can affect mental health in young users.', order: 3 },
          { text: 'Thus, balanced usage is recommended by experts.', order: 4 }
        ]
      }
    ];

    // Create paragraph_complete exercises
    const completeExercises = [
      {
        type: 'paragraph_complete',
        paragraph: 'The study aimed to investigate the relationship between diet and health. [1], 500 participants were recruited. [2], they were divided into three groups. [3], the results showed significant differences between groups.',
        blanks: [
          {
            id: 1,
            options: [
              { text: 'First', isCorrect: true },
              { text: 'However', isCorrect: false },
              { text: 'Therefore', isCorrect: false }
            ]
          },
          {
            id: 2,
            options: [
              { text: 'Then', isCorrect: true },
              { text: 'Nevertheless', isCorrect: false },
              { text: 'Instead', isCorrect: false }
            ]
          },
          {
            id: 3,
            options: [
              { text: 'Finally', isCorrect: true },
              { text: 'Similarly', isCorrect: false },
              { text: 'Meanwhile', isCorrect: false }
            ]
          }
        ]
      },
      {
        type: 'paragraph_complete',
        paragraph: 'Climate change poses serious threats to biodiversity. [1], many species are losing their habitats. [2], some are adapting to new conditions. [3], conservation efforts must be intensified.',
        blanks: [
          {
            id: 1,
            options: [
              { text: 'For example', isCorrect: true },
              { text: 'Therefore', isCorrect: false },
              { text: 'Instead', isCorrect: false }
            ]
          },
          {
            id: 2,
            options: [
              { text: 'However', isCorrect: true },
              { text: 'Similarly', isCorrect: false },
              { text: 'Thus', isCorrect: false }
            ]
          },
          {
            id: 3,
            options: [
              { text: 'Therefore', isCorrect: true },
              { text: 'Nevertheless', isCorrect: false },
              { text: 'Meanwhile', isCorrect: false }
            ]
          }
        ]
      },
      {
        type: 'paragraph_complete',
        paragraph: 'Technology has revolutionized education. [1], students can access resources online. [2], teachers can use interactive tools. [3], some challenges remain, such as the digital divide.',
        blanks: [
          {
            id: 1,
            options: [
              { text: 'For instance', isCorrect: true },
              { text: 'However', isCorrect: false },
              { text: 'Therefore', isCorrect: false }
            ]
          },
          {
            id: 2,
            options: [
              { text: 'Moreover', isCorrect: true },
              { text: 'Instead', isCorrect: false },
              { text: 'Thus', isCorrect: false }
            ]
          },
          {
            id: 3,
            options: [
              { text: 'Nevertheless', isCorrect: true },
              { text: 'Similarly', isCorrect: false },
              { text: 'First', isCorrect: false }
            ]
          }
        ]
      },
      {
        type: 'paragraph_complete',
        paragraph: 'Exercise is beneficial for mental health. [1], it reduces stress hormones. [2], it increases endorphin production. [3], regular physical activity is recommended for overall well-being.',
        blanks: [
          {
            id: 1,
            options: [
              { text: 'First', isCorrect: true },
              { text: 'However', isCorrect: false },
              { text: 'Instead', isCorrect: false }
            ]
          },
          {
            id: 2,
            options: [
              { text: 'Additionally', isCorrect: true },
              { text: 'Nevertheless', isCorrect: false },
              { text: 'Thus', isCorrect: false }
            ]
          },
          {
            id: 3,
            options: [
              { text: 'Therefore', isCorrect: true },
              { text: 'Meanwhile', isCorrect: false },
              { text: 'Similarly', isCorrect: false }
            ]
          }
        ]
      },
      {
        type: 'paragraph_complete',
        paragraph: 'Renewable energy sources are gaining popularity. [1], solar power costs have decreased significantly. [2], wind energy capacity has expanded globally. [3], fossil fuel dependence is gradually decreasing.',
        blanks: [
          {
            id: 1,
            options: [
              { text: 'For example', isCorrect: true },
              { text: 'However', isCorrect: false },
              { text: 'Therefore', isCorrect: false }
            ]
          },
          {
            id: 2,
            options: [
              { text: 'Similarly', isCorrect: true },
              { text: 'Nevertheless', isCorrect: false },
              { text: 'Instead', isCorrect: false }
            ]
          },
          {
            id: 3,
            options: [
              { text: 'As a result', isCorrect: true },
              { text: 'However', isCorrect: false },
              { text: 'First', isCorrect: false }
            ]
          }
        ]
      }
    ];

    exercises.push(...connectorMatchItems);
    exercises.push(...reorderExercises);
    exercises.push(...completeExercises);

    linkingData = {
      exercises,
      metadata: rawData.metadata
    };
  }
  return linkingData;
};

module.exports = {
  getVocabularyData,
  getCollocationData,
  getHedgingData,
  getLinkingData
};
