import type { UserProgress, Quiz, QuizResult, FlashcardDeck, TranslationExercise } from '~/types/learning'

export const useLearning = () => {
  const { apiFetch } = useApi()

  const fetchProgress = async () => {
    return await apiFetch<UserProgress[]>('/me/progress')
  }

  const fetchCourseProgress = async (courseId: string) => {
    return await apiFetch<UserProgress>(`/me/progress/courses/${courseId}`)
  }

  const markChapterComplete = async (chapterId: string) => {
    return await apiFetch<UserProgress>('/me/progress', {
      method: 'POST',
      body: { chapterId, isCompleted: true },
    })
  }

  const fetchQuiz = async (quizId: string) => {
    return await apiFetch<Quiz>(`/quizzes/${quizId}`)
  }

  const submitQuiz = async (quizId: string, answers: Record<string, string>) => {
    return await apiFetch<QuizResult>(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: { answers },
    })
  }

  const fetchFlashcardDecks = async () => {
    return await apiFetch<FlashcardDeck[]>('/flashcard-decks')
  }

  const fetchExercises = async () => {
    return await apiFetch<TranslationExercise[]>('/translation-exercises')
  }

  return { fetchProgress, fetchCourseProgress, markChapterComplete, fetchQuiz, submitQuiz, fetchFlashcardDecks, fetchExercises }
}
