/**
 * Утилита для рандомизации параметров квиза
 * Позволяет перемешивать опции ответов и другие элементы
 */

import type { QuizQuestion, QuizOption } from '@/features/quiz'

/**
 * Перемешивает массив (алгоритм Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

/**
 * Перемешивает опции в вопросе, сохраняя правильный ответ
 */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
	return {
		...question,
		options: shuffle(question.options),
	}
}

/**
 * Перемешивает все вопросы в квизе
 */
export function shuffleQuiz(quiz: QuizQuestion[]): QuizQuestion[] {
	return shuffle(quiz)
}

/**
 * Перемешивает и вопросы, и опции в каждом вопросе
 */
export function shuffleQuizFully(quiz: QuizQuestion[]): QuizQuestion[] {
	return shuffle(quiz).map(shuffleQuestionOptions)
}

/**
 * Выбирает случайный элемент из массива
 */
export function pickRandom<T>(array: T[]): T | undefined {
	if (array.length === 0) return undefined
	return array[Math.floor(Math.random() * array.length)]
}

/**
 * Выбирает N случайных элементов из массива без повторений
 */
export function pickRandomN<T>(array: T[], n: number): T[] {
	if (n >= array.length) return shuffle(array)
	return shuffle(array).slice(0, n)
}

/**
 * Находит индекс правильного ответа после перемешивания
 */
export function findCorrectAnswerIndex(options: QuizOption[]): number {
	return options.findIndex(option => option.correct)
}

/**
 * Проверяет, является ли выбранный индекс правильным ответом
 */
export function isCorrectAnswer(
	options: QuizOption[],
	selectedIndex: number,
): boolean {
	return (
		selectedIndex >= 0 &&
		selectedIndex < options.length &&
		options[selectedIndex].correct
	)
}
