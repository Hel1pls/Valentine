import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO } from '@/shared/assets/audio'
import {
	QUIZ,
	FEEDBACK_DURATION,
	successPhrases,
	failPhrases,
	positiveFeedbackGifs,
	negativeFeedbackGifs,
} from './quiz.data'

export function useQuiz() {
	const [index, setIndex] = useState(0)
	const [correct, setCorrect] = useState(0)
	const [finished, setFinished] = useState(false)
	const [resultCount, setResultCount] = useState<number | null>(null)
	const [resultSuccess, setResultSuccess] = useState<boolean | null>(null)
	const [resultGif, setResultGif] = useState<string | null>(null)

	const [feedback, setFeedback] = useState<null | {
		type: 'success' | 'fail'
		message: string
		gif: string
	}>(null)

	const [locked, setLocked] = useState(false) // prevent repeated clicks while feedback shown

	const successAudio = useRef<HTMLAudioElement | null>(null)
	const failAudio = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		successAudio.current = new Audio(AUDIO.success)
		failAudio.current = new Audio(AUDIO.fail)
	}, [])

	const question = index < QUIZ.length ? QUIZ[index] : undefined

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
		},
		[index, correct],
	)

	const saveHistory = useCallback(
		(chosenText: string, isCorrect: boolean) => {
			try {
				const key = 'quizHistory'
				const raw = localStorage.getItem(key)
				const list = raw ? JSON.parse(raw) : []
				list.push({
					question: QUIZ[index].question,
					chosen: chosenText,
					correct: isCorrect,
					timestamp: Date.now(),
				})
				localStorage.setItem(key, JSON.stringify(list))
			} catch (e) {
				console.warn('Could not write quiz history', e)
			}
		},
		[index],
	)

	const answer = useCallback(
		(i: number) => {
			if (locked || finished) return
			if (!question) return
			setLocked(true)

			const chosen = question.options[i]
			const isCorrect = !!chosen.correct

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

			saveHistory(chosen.text, isCorrect)

			setTimeout(() => {
				setFeedback(null)
				advance(isCorrect)
			}, FEEDBACK_DURATION)
		},
		[locked, finished, question, advance, saveHistory],
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

		try {
			const key = 'quizHistory'
			const raw = localStorage.getItem(key)
			const list = raw ? JSON.parse(raw) : []
			list.push({
				question: QUIZ[index].question,
				chosen: 'ушёл',
				correct: false,
				timestamp: Date.now(),
			})
			localStorage.setItem(key, JSON.stringify(list))
		} catch (e) {
			console.warn('Could not write quiz history', e)
		}

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
