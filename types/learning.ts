export interface Quiz {
  id: string
  title: string
  type: 'qcm' | 'true_false' | 'matching'
  chapterId: string
  questions: QuizQuestion[]
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string | null
}

export interface QuizResult {
  id: string
  score: number
  answers: Record<string, string>
  completedAt: string
}

export interface UserProgress {
  id: string
  userId: string
  chapterId: string
  isCompleted: boolean
  score: number | null
  timeSpent: number | null
}

export interface Flashcard {
  id: string
  mashiWord: string
  frenchTranslation: string
  phonetic: string | null
  deckId: string
}

export interface FlashcardDeck {
  id: string
  name: string
  description: string | null
  category: string | null
  cardsCount: number
}

export interface FlashcardProgress {
  id: string
  status: 'new' | 'learning' | 'review' | 'mastered'
  nextReviewAt: string | null
}

export interface TranslationExercise {
  id: string
  sourceText: string
  expectedTranslation: string
  direction: 'mashi_to_french' | 'french_to_mashi'
  chapterId: string
}
