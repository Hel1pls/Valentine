import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO } from '@/shared/assets/audio/index'
import {
	QUIZ,
	FEEDBACK_DURATION,
	successPhrases,
	failPhrases,
	positiveFeedbackGifs,
	negativeFeedbackGifs,
} from './quiz.data'

type AnswerRecord = {
	questionId: number
	question: string
	optionId: number
	chosenText: string
	correct: boolean
}

const API_URL =
	typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
		? process.env.NEXT_PUBLIC_API_URL
		: 'http://localhost:4000'

export function useQuiz() {
	const [index, setIndex] = useState(0)
	const [correct, setCorrect] = useState(0)
	const [finished, setFinished] = useState(false)
	const [resultCount, setResultCount] = useState<number | null>(null)
	const [resultSuccess, setResultSuccess] = useState<boolean | null>(null)
	const [resultGif, setResultGif] = useState<string | null>(null)
	const [userId] = useState<string | null>(() => {
		if (typeof window === 'undefined') return null
		try {
			const key = 'quizUserId'
			let stored = localStorage.getItem(key)
			if (!stored) {
				const random =
					typeof crypto !== 'undefined' && 'randomUUID' in crypto
						? crypto.randomUUID()
						: `user_${Math.random().toString(36).slice(2)}`
				stored = random
				localStorage.setItem(key, stored)
			}
			return stored
		} catch {
			return null
		}
	})

	const [feedback, setFeedback] = useState<null | {
		type: 'success' | 'fail'
		message: string
		gif: string
	}>(null)

	const [locked, setLocked] = useState(false) // prevent repeated clicks while feedback shown

	const successAudio = useRef<HTMLAudioElement | null>(null)
	const failAudio = useRef<HTMLAudioElement | null>(null)

	// текущие ответы держим в ref, чтобы всегда иметь актуальное значение
	const answersRef = useRef<AnswerRecord[]>([])

	useEffect(() => {
		successAudio.current = new Audio(AUDIO.success)
		failAudio.current = new Audio(AUDIO.fail)
	}, [])

	const question = index < QUIZ.length ? QUIZ[index] : undefined

	const sendResults = useCallback(
		async (finalCorrect: number) => {
			if (!userId) return
			try {
				const payload = {
					userId,
					answers: answersRef.current,
					totalCorrect: finalCorrect,
					totalQuestions: QUIZ.length,
				}
				await fetch(`${API_URL}/api/quiz-results`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				})
			} catch (e) {
				console.warn('Failed to send quiz results', e)
			}
		},
		[userId],
	)

	const advance = useCallback(
		(correctAnswered: boolean) => {
			setLocked(false)
			if (index + 1 < QUIZ.length) {
				setIndex(i => i + 1)
				return
			}

			// finalize
			const finalCorrect = correctAnswered ? correct + 1 : correct
			const success = finalCorrect >= 7
			const pool = success ? positiveFeedbackGifs : negativeFeedbackGifs
			setResultGif(pool[Math.floor(Math.random() * pool.length)])
			setResultCount(finalCorrect)
			setResultSuccess(success)
			setFinished(true)

			// Отправляем результаты на бэкенд
			void sendResults(finalCorrect)
		},
		[index, correct, sendResults],
	)

	const recordAnswer = useCallback((entry: AnswerRecord) => {
		answersRef.current.push(entry)
	}, [])

	const answer = useCallback(
		(i: number) => {
			if (locked || finished) return
			if (!question) return
			setLocked(true)

			const chosen = question.options[i]
			const isCorrect = !!chosen.correct

			// сохраняем подробный ответ для отправки на бэкенд
			recordAnswer({
				questionId: question.id,
				question: question.question,
				optionId: chosen.id,
				chosenText: chosen.text,
				correct: isCorrect,
			})

			const phrases = isCorrect ? successPhrases : failPhrases
			const message = phrases[Math.floor(Math.random() * phrases.length)]

			const gifPool = isCorrect ? positiveFeedbackGifs : negativeFeedbackGifs
			const chosenGif = gifPool[Math.floor(Math.random() * gifPool.length)]

			setFeedback({
				type: isCorrect ? 'success' : 'fail',
				message,
				gif: chosenGif,
			})

			if (isCorrect) {
				setCorrect(c => c + 1)
				successAudio.current?.play()
			} else {
				failAudio.current?.play()
			}

			setTimeout(() => {
				setFeedback(null)
				advance(isCorrect)
			}, FEEDBACK_DURATION)
		},
		[locked, finished, question, advance],
	)

	// handle user leaving/tab switch — count as wrong
	const awayHandled = useRef(false)

	const handleAway = useCallback(() => {
		if (locked || finished || awayHandled.current) return
		awayHandled.current = true
		setLocked(true)

		const message = failPhrases[Math.floor(Math.random() * failPhrases.length)]
		const chosenGif =
			negativeFeedbackGifs[
				Math.floor(Math.random() * negativeFeedbackGifs.length)
			]
		setFeedback({ type: 'fail', message, gif: chosenGif })
		failAudio.current?.play()

		recordAnswer({
			questionId: QUIZ[index].id,
			question: QUIZ[index].question,
			optionId: -1,
			chosenText: 'ушёл',
			correct: false,
		})

		setTimeout(() => {
			setFeedback(null)
			advance(false)
			awayHandled.current = false
			setLocked(false)
		}, FEEDBACK_DURATION)
	}, [locked, finished, index, advance])

	useEffect(() => {
		function onHidden() {
			if (document.hidden) handleAway()
		}
		function onBlur() {
			handleAway()
		}
		window.addEventListener('visibilitychange', onHidden)
		window.addEventListener('pagehide', onHidden)
		window.addEventListener('blur', onBlur)
		window.addEventListener('beforeunload', onHidden)
		return () => {
			window.removeEventListener('visibilitychange', onHidden)
			window.removeEventListener('pagehide', onHidden)
			window.removeEventListener('blur', onBlur)
			window.removeEventListener('beforeunload', onHidden)
		}
	}, [handleAway])

	return {
		question,
		answer,
		finished,
		result: resultCount ?? correct,
		feedback,
		resultSuccess,
		resultGif,
	}
}
