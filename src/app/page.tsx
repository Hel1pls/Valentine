'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// assets
import giftSvg from '@/shared/assets/svg/gift.svg'
import girlImg from '@/shared/assets/img/girl1.png'
import leftGif from '@/shared/assets/gif/8.gif'
import centerGif from '@/shared/assets/gif/7.gif'
import rightGif from '@/shared/assets/gif/9.gif'
import icon10 from '@/shared/assets/gif/10.gif'
import gif19 from '@/shared/assets/gif/19.gif'

const cloudSvg = new URL('../shared/assets/svg/Cloud.svg', import.meta.url).href
const topCloud = new URL('../shared/assets/svg/Top_Cloud.svg', import.meta.url)
	.href

const loveMp3 = new URL('../shared/assets/audio/love.mp3', import.meta.url).href
const ease = [0.22, 1, 0.36, 1] as const

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
		// добавляй сюда новые вопросы в том же формате
	]

	const current = quiz[currentQuestionIndex]

	const successPhrases = [
		'Отлично!',
		'Молодец, так держать!',
		'Победитель! 🎉',
		'Ты прав!',
	]
	const failPhrases = [
		'Ох...',
		'Упс, не повезло.',
		'В следующий раз повезёт.',
		'Неправильно :(',
	]

	const handleOpenQuiz = () => setShowQuestion(true)
	const handleAnswer = (i: number) => {
		// ignore repeated clicks
		if (selectedAnswer !== null) return
		setSelectedAnswer(i)

		const chosen = current.options[i]
		const correct = !!chosen.correct

		// choose random phrase
		const phrases = correct ? successPhrases : failPhrases
		const message = phrases[Math.floor(Math.random() * phrases.length)]

		setFeedbackType(correct ? 'success' : 'fail')
		setFeedbackMessage(message)
		setShowFeedback(true)

		// save to localStorage
		try {
			const key = 'quizHistory'
			const raw = localStorage.getItem(key)
			const list = raw ? JSON.parse(raw) : []
			list.push({
				question: current.question,
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
			// move to next question if available
			setCurrentQuestionIndex(idx => (idx + 1 < quiz.length ? idx + 1 : idx))
		}, 1400)
	}

	return (
		<motion.div
			className='absolute inset-0 font-comfortaa'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5, ease }}
		>
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
				{!showQuestion ? (
					<div className='rounded-3xl bg-red-400 h-140 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto relative'>
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
							transition={{ duration: 0.6, ease }}
							className='absolute left-1/2 transform -translate-x-1/2 top-[50%] z-30 cursor-pointer'
							onClick={handleOpenQuiz}
						>
							{/* если у тебя есть стикер белого кота — подставь, иначе используем box */}
							<Image src={centerGif} alt='cat box' width={220} height={140} />
							<p className='text-xl leading-relaxed mx-auto font-bold w-4/5'>
								Поехали!
							</p>
						</motion.div>
					</div>
				) : (
					<div className='rounded-3xl bg-red-400 h-140 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto relative'>
						<p className='text-2xl leading-relaxed mx-auto font-bold w-4/5'>
							{current.question}
						</p>
						<div className='mt-6 flex flex-col items-center space-y-4 px-6'>
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
						{showFeedback && (
							<div className='absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center z-40 p-4'>
								{feedbackType === 'success' ? (
									<Image src={icon10} alt='success' width={96} height={96} />
								) : (
									<Image src={gif19} alt='fail' width={120} height={120} />
								)}
								<p className='mt-4 text-xl font-bold text-white'>
									{feedbackMessage}
								</p>
							</div>
						)}
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
