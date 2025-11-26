// Task generator utility for daily tasks
// Uses seeded random to ensure same tasks for same date

const {
  getVocabularyData,
  getCollocationData,
  getHedgingData,
  getLinkingData
} = require('./dataLoader');

// Task type definitions for each module
const MODULE_TASKS = {
  1: ['flashcard', 'spelling', 'meaning_match', 'word_family', 'contextual_usage'],
  2: ['error_detection', 'error_correction', 'contrastive', 'gap_fill'],
  3: ['add_hedging', 'strength_ranking', 'appropriateness'],
  4: ['linking_match', 'paragraph_reorder', 'completion']
};

const MODULE_NAMES = {
  1: 'Vocabulary Training',
  2: 'Collocation Training',
  3: 'Hedging Practice',
  4: 'Linking Devices'
};

const TASK_NAMES = {
  flashcard: 'Flashcard Review',
  spelling: 'Spelling Challenge',
  meaning_match: 'Definition Match',
  word_family: 'Word Family Explorer',
  contextual_usage: 'Contextual Usage',
  error_detection: 'Error Detection',
  error_correction: 'Error Correction',
  contrastive: 'Contrastive Learning',
  gap_fill: 'Gap Fill',
  add_hedging: 'Add Hedging',
  strength_ranking: 'Strength Ranking',
  appropriateness: 'Appropriateness Judgment',
  linking_match: 'Linking Match',
  paragraph_reorder: 'Paragraph Reorder',
  completion: 'Paragraph Completion'
};

// Simple hash function for creating seed from string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

// Shuffle array with seeded random
function seededShuffle(array, rng) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get today's date string in YYYY-MM-DD format
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Generate daily tasks for a user
function generateDailyTasks(userId, dateStr = null) {
  const date = dateStr || getDateString();
  const seed = hashCode(userId.toString() + date);
  const rng = seededRandom(seed);

  const tasks = [];

  for (let module = 1; module <= 4; module++) {
    const taskTypes = MODULE_TASKS[module];
    const randomIndex = Math.floor(rng() * taskTypes.length);
    const taskType = taskTypes[randomIndex];

    // Get data for this module
    const data = getModuleData(module, taskType, rng);

    tasks.push({
      id: `${date}-${module}-${taskType}`,
      module,
      moduleName: MODULE_NAMES[module],
      taskType,
      taskName: TASK_NAMES[taskType],
      data,
      completed: false
    });
  }

  return {
    date,
    tasks
  };
}

// Get data for a specific module task
function getModuleData(module, taskType, rng) {
  let rawData;

  switch (module) {
    case 1:
      rawData = getVocabularyData();
      return prepareVocabularyData(rawData, taskType, rng);
    case 2:
      rawData = getCollocationData();
      return prepareCollocationData(rawData, taskType, rng);
    case 3:
      rawData = getHedgingData();
      return prepareHedgingData(rawData, taskType, rng);
    case 4:
      rawData = getLinkingData();
      return prepareLinkingData(rawData, taskType, rng);
    default:
      return null;
  }
}

// Prepare vocabulary data based on task type
function prepareVocabularyData(data, taskType, rng) {
  if (!Array.isArray(data)) return [];

  // Shuffle and get 10 words
  const shuffled = seededShuffle(data, rng);
  const words = shuffled.slice(0, 10);

  switch (taskType) {
    case 'flashcard':
      return words.map(w => ({
        word: w.word,
        definition: w.definition,
        examples: w.examples || [],
        partOfSpeech: w.part_of_speech || 'noun',
        wordFamily: w.word_family || []
      }));

    case 'spelling':
      return words.map(w => ({
        word: w.word,
        definition: w.definition,
        hint: w.word[0].toUpperCase()
      }));

    case 'meaning_match':
      return words.map(w => {
        // Get 3 distractors from other words
        const others = shuffled.filter(o => o.word !== w.word);
        const distractors = seededShuffle(others, rng).slice(0, 3);

        const options = seededShuffle([
          { text: w.definition, isCorrect: true },
          ...distractors.map(d => ({ text: d.definition, isCorrect: false }))
        ], rng);

        return {
          word: w.word,
          options
        };
      });

    case 'word_family':
      return words.filter(w => w.word_family && w.word_family.length > 0).slice(0, 5).map(w => {
        const familyMembers = w.word_family || [];
        // Get distractors from other word families
        const otherWords = shuffled
          .filter(o => o.word !== w.word)
          .flatMap(o => o.word_family || [])
          .slice(0, 4);

        const allOptions = seededShuffle([...familyMembers, ...otherWords], rng);

        return {
          headword: w.word,
          partOfSpeech: w.part_of_speech,
          familyMembers,
          options: allOptions.slice(0, 8)
        };
      });

    case 'contextual_usage':
      return words.filter(w => w.examples && w.examples.length > 0).slice(0, 8).map(w => {
        const example = w.examples[0];
        // Create blank by replacing the word
        const sentence = example.replace(new RegExp(`\\b${w.word}\\b`, 'gi'), '_____');

        // Get distractors
        const others = shuffled.filter(o => o.word !== w.word);
        const distractors = seededShuffle(others, rng).slice(0, 3);

        const options = seededShuffle([
          { text: w.word, isCorrect: true },
          ...distractors.map(d => ({ text: d.word, isCorrect: false }))
        ], rng);

        return {
          sentence,
          word: w.word,
          options
        };
      });

    default:
      return words;
  }
}

// Prepare collocation data based on task type
function prepareCollocationData(data, taskType, rng) {
  if (!data || !data.errors) return [];

  // Filter errors by type
  const misuseErrors = data.errors.filter(e => e.error_type === 'misuse' && e.correct_form);
  const overuseErrors = data.errors.filter(e => e.error_type === 'overuse' && e.correct_form);
  const allErrors = [...misuseErrors, ...overuseErrors];

  switch (taskType) {
    case 'error_detection':
      // Show error collocation, user identifies it's wrong
      const detectionErrors = seededShuffle(misuseErrors, rng).slice(0, 8);
      return detectionErrors.map(e => {
        const errorCollocation = e.collocation || '';
        // Get first alternative if multiple
        const correctForm = (e.correct_form || '').split('/')[0].trim();

        return {
          errorCollocation,
          correctCollocation: correctForm,
          explanation: e.grammar_issue || `"${errorCollocation}" should be "${correctForm}"`,
          examples: e.examples || [],
          frequency: e.learner_freq
        };
      });

    case 'error_correction':
      // Show sentence with blank, select correct collocation from 2 options
      const correctionErrors = seededShuffle(misuseErrors, rng).slice(0, 8);
      return correctionErrors.map(e => {
        const errorCollocation = e.collocation || '';
        // Get first alternative if multiple
        const correctForm = (e.correct_form || '').split('/')[0].trim();

        // Create sentence with blank from example
        let sentence = '';
        if (e.examples && e.examples.length > 0) {
          const example = e.examples[0];
          // Escape special regex characters in correctForm
          const escapedCorrectForm = correctForm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          sentence = example.replace(new RegExp(escapedCorrectForm, 'gi'), '_____');
        }

        // Fallback if no example or replacement failed
        if (!sentence || !sentence.includes('_____')) {
          sentence = `The correct academic expression is _____ instead of "${errorCollocation}".`;
        }

        // Only 2 options: correct form vs error form
        const options = seededShuffle([
          { text: correctForm, isCorrect: true },
          { text: errorCollocation, isCorrect: false }
        ], rng);

        return {
          sentence,
          errorCollocation,
          correctForm,
          options,
          explanation: e.grammar_issue || '',
          examples: e.examples || []
        };
      });

    case 'contrastive':
      // Use both misuse and overuse items for contrastive learning
      const contrastiveErrors = seededShuffle([...misuseErrors, ...overuseErrors], rng).slice(0, 8);
      return contrastiveErrors.map(e => ({
        errorForm: e.collocation,
        correctForm: e.correct_form,
        learnerFrequency: e.learner_freq ? `Learner: ${e.learner_freq} per million` : 'Common in learner writing',
        nativeFrequency: e.corpus_freq_per_million ? `Native: ${e.corpus_freq_per_million} per million` : 'Rare in native writing',
        explanation: e.grammar_issue || e.issue || '',
        examples: e.examples || []
      }));

    case 'gap_fill':
      // Use items that have correct_form
      const gapFillErrors = seededShuffle(allErrors, rng).slice(0, 8);
      return gapFillErrors.map(e => {
        const correctForm = e.correct_form || '';
        const words = correctForm.split(' ');
        const correctWord = words[0];
        const restPhrase = words.slice(1).join(' ');

        // Find example and create blank
        let sentence = '';
        if (e.examples && e.examples.length > 0) {
          const example = e.examples.find(ex =>
            ex.toLowerCase().includes(correctForm.toLowerCase())
          );
          if (example) {
            sentence = example.replace(new RegExp(`\\b${correctWord}\\b`, 'i'), '_____');
          }
        }

        if (!sentence || !sentence.includes('_____')) {
          sentence = `The researcher will _____ ${restPhrase} to investigate the hypothesis.`;
        }

        // Create options based on the correct word
        const commonWords = ['support', 'enhance', 'enable', 'facilitate', 'provide', 'obtain', 'utilize', 'establish'];
        const wrongOptions = commonWords.filter(w => w.toLowerCase() !== correctWord.toLowerCase()).slice(0, 3);

        const options = seededShuffle([
          { text: correctWord, isCorrect: true },
          ...wrongOptions.map(w => ({ text: w, isCorrect: false }))
        ], rng);

        return {
          sentence,
          correctWord,
          fullCorrectForm: correctForm,
          options
        };
      });

    default:
      return seededShuffle(allErrors, rng).slice(0, 8);
  }
}

// Prepare hedging data based on task type
function prepareHedgingData(data, taskType, rng) {
  if (!data || !data.exercises) return [];

  const exercises = data.exercises;

  switch (taskType) {
    case 'add_hedging':
      const hedgingExercises = exercises
        .filter(e => e.type === 'hedging_add')
        .slice(0, 8);

      return hedgingExercises.map(e => ({
        sentence: e.sentence,
        originalSentence: e.originalSentence,
        correctAnswer: e.correctAnswer,
        options: e.options,
        category: e.category
      }));

    case 'strength_ranking':
      const intensityExercises = exercises
        .filter(e => e.type === 'intensity_order')
        .slice(0, 6);

      return intensityExercises.map(e => ({
        items: seededShuffle(e.items, rng),
        correctOrder: e.items.sort((a, b) => a.strength - b.strength)
      }));

    case 'appropriateness':
      const appropriatenessExercises = exercises
        .filter(e => e.type === 'appropriateness')
        .slice(0, 8);

      return appropriatenessExercises.map(e => ({
        sentence: e.sentence,
        needsHedging: e.needsHedging,
        explanation: e.explanation
      }));

    default:
      return exercises;
  }
}

// Prepare linking data based on task type
function prepareLinkingData(data, taskType, rng) {
  if (!data || !data.exercises) return [];

  const exercises = data.exercises;

  switch (taskType) {
    case 'linking_match':
      const matchExercises = exercises
        .filter(e => e.type === 'connector_match')
        .slice(0, 8);

      return matchExercises.map(e => ({
        sentence1: e.sentence1,
        sentence2: e.sentence2,
        relation: e.relation,
        correctAnswer: e.correctAnswer,
        options: e.options
      }));

    case 'paragraph_reorder':
      const reorderExercises = exercises
        .filter(e => e.type === 'paragraph_reorder')
        .slice(0, 5);

      return reorderExercises.map(e => ({
        sentences: seededShuffle(e.sentences, rng),
        correctOrder: e.sentences.sort((a, b) => a.order - b.order)
      }));

    case 'completion':
      const completeExercises = exercises
        .filter(e => e.type === 'paragraph_complete')
        .slice(0, 5);

      return completeExercises.map(e => ({
        paragraph: e.paragraph,
        blanks: e.blanks
      }));

    default:
      return exercises;
  }
}

// Calculate login streak
function calculateLoginStreak(lastLoginDate, currentDate, currentStreak) {
  if (!lastLoginDate) return 1;

  const last = new Date(lastLoginDate);
  const today = new Date(currentDate);

  // Reset time to midnight for comparison
  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - last;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, keep streak
    return currentStreak;
  } else if (diffDays === 1) {
    // Consecutive day, increment
    return currentStreak + 1;
  } else {
    // Streak broken, reset to 1
    return 1;
  }
}

module.exports = {
  generateDailyTasks,
  calculateLoginStreak,
  getDateString,
  MODULE_TASKS,
  MODULE_NAMES,
  TASK_NAMES
};
