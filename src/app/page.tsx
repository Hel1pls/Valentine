'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image, { type StaticImageData } from 'next/image' 

// assets
import giftSvg from '@/shared/assets/svg/gift.svg'
import girlImg from '@/shared/assets/img/girl1.png'
import leftGif from '@/shared/assets/gif/8.gif'
import centerGif from '@/shared/assets/gif/7.gif'
import rightGif from '@/shared/assets/gif/9.gif'
import icon10 from '@/shared/assets/gif/10.gif'
import gif19 from '@/shared/assets/gif/19.gif'
import gif1 from '@/shared/assets/gif/1.gif'
import gif4 from '@/shared/assets/gif/4.gif'
import gif5 from '@/shared/assets/gif/5.gif'
import gif7 from '@/shared/assets/gif/7.gif'
import gif11 from '@/shared/assets/gif/11.gif'
import gif13 from '@/shared/assets/gif/13.gif'
import gif14 from '@/shared/assets/gif/14.gif'
import gif15 from '@/shared/assets/gif/15.gif'
import gif16 from '@/shared/assets/gif/16.gif'

const cloudSvg = new URL('../shared/assets/svg/Cloud.svg', import.meta.url).href
const topCloud = new URL('../shared/assets/svg/Top_Cloud.svg', import.meta.url)
	.href

const loveMp3 = new URL('../shared/assets/audio/love.mp3', import.meta.url).href
const successMp3 = new URL('../shared/assets/audio/success.mp3', import.meta.url).href
const failMp3 = new URL('../shared/assets/audio/fail.mp3', import.meta.url).href
const ease = [0.22, 1, 0.36, 1] as const
const FEEDBACK_DURATION = 3000

const quiz = [
	{
		question:
			'Сколько матов было написано и произнесено за первый час нашего общения?',
		options: [
			{ text: '30', correct: true },
			{ text: '47', correct: false },
			{ text: '13', correct: false },
			{ text: '24', correct: false },
		],
	},
	{
		question: 'Какого числа я бухой тебе написал?',
		options: [
			{ text: '19', correct: true },
			{ text: '22', correct: false },
			{ text: '7', correct: false },
			{ text: '13', correct: false },
		],
	},
	{
		question: 'Какой у меня любимый цвет? (Не в одежде)',
		options: [
			{ text: 'Красный', correct: true },
			{ text: 'Зелёный', correct: false },
			{ text: 'Синий', correct: false },
			{ text: 'Жёлтый', correct: false },
		],
	},
	{
		question: 'Что я сделал когда мы впервые встретились?',
		options: [
			{ text: 'Въебал', correct: false },
			{ text: 'Опоздал', correct: false },
			{ text: 'Напугал', correct: true },
			{ text: 'Пошутил', correct: false },
		],
	},
	{
		question: 'Столица австралии?',
		options: [
			{ text: 'Сидней', correct: false },
			{ text: 'Мельбурн', correct: false },
			{ text: 'Канберра', correct: true },
			{ text: 'Брисбен', correct: false },
		],
	},
	{
		question: 'Отмена крепостного права?',
		options: [
			{ text: '1855', correct: false },
			{ text: '1870', correct: false },
			{ text: '1865', correct: false },
			{ text: '1861', correct: true },
		],
	},
	{
		question: 'Что из этого я люблю больше?',
		options: [
			{ text: 'Сиси', correct: false },
			{ text: 'Попа', correct: true },
			{ text: 'Тити', correct: false },
			{ text: 'Душа', correct: false },
		],
	},
	{
		question: 'Столица Африки?',
		options: [
			{ text: 'Каир', correct: false },
			{ text: 'Лагос', correct: false },
			{ text: 'Киншаса', correct: false },
			{ text: 'Долбаеб', correct: true },
		],
	},
	{
		question: 'Сколько?',
		options: [
			{ text: 'Много', correct: true },
			{ text: 'Дохуя', correct: true },
			{ text: 'Пиздец', correct: true },
			{ text: 'Ебанешься', correct: true },
		],
	},
	{
		question: 'Какой подарок я обещал(а) за правильные ответы?',
		options: [
			{ text: 'Дайсон', correct: false },
			{ text: '---', correct: true },
			{ text: 'Клетку', correct: false },
			{ text: 'Стринги', correct: false },
		],
	},
]

const successPhrases = [
	'Умница!',
	'Милашка',
	'Юху🎉',
	'Целую твою жопку',
]
const failPhrases = [
	'Ты че дурында? :(',
	'Варя...',
	'Ну ты и лошара',
	'Дурочка',
]

// feedback gif pools
const positiveFeedbackGifs = [icon10, gif1, gif4, gif5, gif7, gif11, gif13]
const negativeFeedbackGifs = [gif19, gif14, gif15, gif16]

export default function Page() {
	const [scene, setScene] = useState<'intro' | 'game'>('intro')
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const handleStart = () => {
		audioRef.current?.play()
		setScene('game')
	}

	return (
		<div className='fixed inset-0 bg-pink-200 overflow-hidden'>
			<audio ref={audioRef} src={loveMp3} preload='auto' />

			<AnimatePresence mode='wait'>
				{scene === 'intro' ? (
					<IntroScene key='intro' onStart={handleStart} />
				) : (
					<GameScene key='game' />
				)}
			</AnimatePresence>
		</div>
	)
}

/* ---------------- IntroScene — восстановленная (как у тебя было) ---------------- */

function IntroScene({ onStart }: { onStart: () => void }) {
	return (
		<motion.div
			className='absolute inset-0 font-comfortaa'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.45, ease }}
		>
			{/* Top cloud (restored) */}
			<div
				className='absolute top-0 left-0 w-full h-58 bg-no-repeat bg-top pointer-events-none z-10'
				style={{
					backgroundImage: `url(${topCloud})`,
					backgroundSize: '100% auto',
				}}
			/>

			{/* Bottom clouds (restored) */}
			<div
				className={`absolute bottom-0 left-0 h-105 w-full bg-no-repeat bg-bottom pointer-events-none transform-gpu transition-transform duration-900 ease-in-out z-5`}
				style={{
					backgroundImage: `url(${cloudSvg})`,
					backgroundSize: '100% auto',
				}}
			/>
			{/* Девушка слева (как было) */}
			<Image
				src={girlImg}
				alt='girl'
				width={260}
				height={260}
				className='absolute left-29 bottom-54 pointer-events-none z-1'
				priority
			/>

			{/* Подарок справа — легкое покачивание (Framer Motion) */}
			<motion.div
				className='absolute right-94 top-16 z-20 pointer-events-none'
				initial={{ rotate: -6, y: 0 }}
				animate={{ rotate: [-6, 6, -6], y: [0, -6, 0] }}
				transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
			>
				<Image src={giftSvg} alt='gift' width={120} height={120} priority />
			</motion.div>

			{/* Центр — кнопка */}
			<div className='relative z-30 flex h-full items-center justify-center'>
				<motion.button
					onClick={onStart}
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.98 }}
					className='rounded-full bg-red-400 px-14 py-6 text-2xl font-semibold text-white shadow-2xl'
					aria-label='Стартуем'
				>
					Поехали!
				</motion.button>
			</div>
		</motion.div>
	)
}

/* ---------------- GameScene — сделано под референс (стабильно) ---------------- */

function GameScene() {
	const [showQuestion, setShowQuestion] = useState(false)
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

	const [showFeedback, setShowFeedback] = useState(false)
	const [feedbackType, setFeedbackType] = useState<'success' | 'fail' | null>(
		null,
	)
	const [feedbackMessage, setFeedbackMessage] = useState<string>('')

	// audio refs for feedback sounds
	const successRef = useRef<HTMLAudioElement | null>(null)
	const failRef = useRef<HTMLAudioElement | null>(null)

	// quiz progress
	const [correctCount, setCorrectCount] = useState(0)
	const [finished, setFinished] = useState(false)

	// gif for current feedback and result
	const [feedbackGif, setFeedbackGif] = useState<string | StaticImageData | null>(null)
	const [resultGif, setResultGif] = useState<string | StaticImageData | null>(null)
	// final result state (to avoid async timing issues with setState)
	const [resultCount, setResultCount] = useState<number | null>(null)
	const [resultSuccess, setResultSuccess] = useState<boolean | null>(null) 

	// quiz is defined at module scope now

	const current = quiz[currentQuestionIndex]

	// phrases moved to module scope

	const handleOpenQuiz = () => setShowQuestion(true)

	const awayHandledRef = useRef(false)
	const handleAway = useCallback(() => {
		// mark as wrong if user hides or leaves page during a question
		if (!showQuestion || finished) return
		if (awayHandledRef.current) return
		awayHandledRef.current = true

		setFeedbackType('fail')
		setFeedbackMessage('Куда пошла!!!')
		const chosenGif = negativeFeedbackGifs[Math.floor(Math.random() * negativeFeedbackGifs.length)]
		setFeedbackGif(chosenGif)
		setShowFeedback(true)
		// pause background music if playing
		;(document.getElementById('bg-music') as HTMLAudioElement | null)?.pause()
		failRef.current?.play()

		// record in history
		try {
			const key = 'quizHistory'
			const raw = localStorage.getItem(key)
			const list = raw ? JSON.parse(raw) : []
			list.push({
				question: quiz[currentQuestionIndex].question,
				chosen: 'ушёл',
				correct: false,
				timestamp: Date.now(),
			})
			localStorage.setItem(key, JSON.stringify(list))
		} catch (e) {
			console.warn('Could not write quiz history', e)
		}

		setTimeout(() => {
			setShowFeedback(false)
			awayHandledRef.current = false
			if (currentQuestionIndex + 1 < quiz.length) {
				setCurrentQuestionIndex(idx => idx + 1)
			} else {
				const finalCorrect = correctCount
				const success = finalCorrect >= 7
				const resultPool = success ? positiveFeedbackGifs : negativeFeedbackGifs
				setResultGif(resultPool[Math.floor(Math.random() * resultPool.length)])
				setResultCount(finalCorrect)
				setResultSuccess(success)
				setFeedbackGif(null)
				setFinished(true)
				setShowQuestion(false)
			}
		}, FEEDBACK_DURATION)
	}, [showQuestion, finished, currentQuestionIndex, correctCount])

	const handleAnswer = useCallback((i: number) => {
		// ignore repeated clicks
		if (selectedAnswer !== null) return
		setSelectedAnswer(i)

		const chosen = quiz[currentQuestionIndex].options[i]
		const correct = !!chosen.correct

		// choose random phrase (executed on click)
		const phrases = correct ? successPhrases : failPhrases
		const message = phrases[Math.floor(Math.random() * phrases.length)]

		// choose random gif for feedback
		const gifPool = correct ? positiveFeedbackGifs : negativeFeedbackGifs
		const chosenGif = gifPool[Math.floor(Math.random() * gifPool.length)]

		setFeedbackType(correct ? 'success' : 'fail')
		setFeedbackMessage(message)
		setFeedbackGif(chosenGif)
		setShowFeedback(true)

		if (correct) {
			setCorrectCount(c => c + 1)
			successRef.current?.play()
		} else {
			failRef.current?.play()
		}

		// save to localStorage
		try {
			const key = 'quizHistory'
			const raw = localStorage.getItem(key)
			const list = raw ? JSON.parse(raw) : []
			list.push({
				question: quiz[currentQuestionIndex].question,
				chosen: chosen.text,
				correct,
				timestamp: Date.now(),
			})
			localStorage.setItem(key, JSON.stringify(list))
		} catch (e) {
			console.warn('Could not write quiz history', e)
		}

		// auto-hide feedback and move to next question after a short delay
		setTimeout(() => {
			setShowFeedback(false)
			setSelectedAnswer(null)
			if (currentQuestionIndex + 1 < quiz.length) {
				setCurrentQuestionIndex(idx => idx + 1)
			} else {
				// quiz finished — determine final result and show (use finalCorrect to avoid async setState timing issues)
				const finalCorrect = correct ? correctCount + 1 : correctCount
				const success = finalCorrect >= 7
				const resultPool = success ? positiveFeedbackGifs : negativeFeedbackGifs
				setResultGif(resultPool[Math.floor(Math.random() * resultPool.length)])
				setResultCount(finalCorrect)
				setResultSuccess(success)
				// cleanup feedback gif and mark finished
				setFeedbackGif(null)
				setFinished(true)
				setShowQuestion(false)
			}
		}, FEEDBACK_DURATION)
	}, [selectedAnswer, currentQuestionIndex, correctCount])

	// watch for user leaving/tab switch - count as an incorrect answer and show sad feedback
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

	return (
		<motion.div
			className='absolute inset-0 font-comfortaa'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5, ease }}
		>
			{/* preload feedback sounds */}
			<audio ref={successRef} src={successMp3} preload='auto' />
			<audio ref={failRef} src={failMp3} preload='auto' />
			{/* Заголовок по центру сверху (letter animation) */}
			<motion.div
				initial={{ y: -28, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.05, duration: 0.6, ease }}
				className='absolute left-0 right-0 text-center mt-13 z-30'
			>
				<LoveText />
			</motion.div>

			{/* Левый графический элемент (вверху слева) */}
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute left-25 top-60 z-20'
			>
				<Image src={leftGif} alt='left-gif' width={220} height={220} />
			</motion.div>
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute left-25 top-53 z-20 rotate-5'
			>
				<h1 className='text-xl font-extrabold text-red-500  '>
					Как я прогал все это!
				</h1>
			</motion.div>

			{/* Правый графический элемент (вверху справа) */}
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute right-25 top-50 z-20'
			>
				<Image src={rightGif} alt='right-gif' width={250} height={250} />
			</motion.div>

			{/* Основной контент: карточка — центрованная и увеличенная */}
			<motion.div
				initial={{ y: -60, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.25, duration: 0.7, ease }}
				className='absolute left-1/2 top-20 transform -translate-x-1/2 z-30 w-180'
			>
				{finished ? (
					<div className={`rounded-3xl ${resultSuccess ? 'bg-green-500' : 'bg-red-500'} h-135 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto flex flex-col items-center justify-center` }>
						{resultGif ? (
							<Image src={resultGif} alt={resultSuccess ? 'success' : 'fail'} width={180} height={180} />
						) : (
							<Image src={resultSuccess ? icon10 : gif19} alt={resultSuccess ? 'success' : 'fail'} width={180} height={180} />
						)}
						<p className='mt-4 text-3xl font-extrabold'>
							{resultSuccess ? 'Юху! Моя девочка 🎉' : 'Неудача — не хватило правильных ответов.'}
						</p>
						<p className='mt-2 text-xl'>Результат: {resultCount} / {quiz.length}</p>
					</div>
				) : !showQuestion ? (
					<div className='rounded-3xl bg-red-400 h-135 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto relative'>
						<p className='text-2xl leading-relaxed mx-auto font-bold w-4/5'>
							Если ответишь правильно на 10 вопросов, получишь обещанный приз.
							<br />
							Если ошибёшься два раза — ничего не получишь.
							<br />
							Не волнуйся — он не вылезет.
						</p>
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							whileHover={{ scale: 1.18 }}
							whileTap={{ scale: 0.98 }}
						transition={{ duration: 0.9, ease }}
							className='absolute left-1/2 transform -translate-x-1/2 top-[50%] z-30 cursor-pointer'
							onClick={handleOpenQuiz}
						>
							<Image src={centerGif} alt='cat box' width={220} height={140} />
							<p className='text-xl leading-relaxed mx-auto font-bold w-4/5'>
								Поехали!
							</p>
						</motion.div>
					</div>
				) : (
					<div className='rounded-3xl bg-red-400 h-135 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto relative'>
						<p className='text-2xl leading-relaxed mx-auto font-bold w-4/5'>
							{current.question}
						</p>
						<div className='mt-14 flex flex-col items-center space-y-4 px-8'>
							{current.options.map((opt, i) => (
								<motion.button
									key={i}
									onClick={() => selectedAnswer === null && handleAnswer(i)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`w-full text-white text-xl font-bold py-4 rounded-lg ${selectedAnswer === i ? 'bg-red-700' : 'bg-red-500'} transition`}
								>
									{opt.text}
								</motion.button>
							))}
						</div>
					<AnimatePresence mode='wait'>
						{showFeedback && (
							<motion.div
								key='feedback'
								initial={{ opacity: 0, scale: 0.92 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.96 }}
								transition={{ duration: 0.45, ease: 'easeInOut' }}
								className='absolute inset-0 rounded-3xl flex flex-col items-center justify-center z-50 p-4 pointer-events-none bg-transparent'
							>
								<div className='pointer-events-auto flex flex-col items-center justify-center'>
								{feedbackGif ? (
									<Image src={feedbackGif} alt={feedbackType ?? 'feedback'} width={160} height={160} />
								) : feedbackType === 'success' ? (
									<Image src={icon10} alt='success' width={96} height={96} />
								) : (
									<Image src={gif19} alt='fail' width={120} height={120} />
								)}
								<p className='mt-4 text-2xl font-extrabold text-white'>
									{feedbackMessage}
								</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
					</div>
				)}
			</motion.div>

			<div className='absolute right-8 bottom-12 z-10 opacity-40'></div>
		</motion.div>
	)
}

function LoveText() {
	const text = 'Игра на выживание?'

	return (
		<h1 className='text-5xl font-bold text-red-500 tracking-wide font-comfortaa'>
			{text.split('').map((c, i) => (
				<span
					key={i}
					className='inline-block animate-letter'
					style={{ animationDelay: `${i * 0.06}s` }}
				>
					{c === ' ' ? '\u00A0' : c}
				</span>
			))}
		</h1>
	)
}
