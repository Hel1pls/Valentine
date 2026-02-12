'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import { useQuiz } from '@/features/quiz'
import { QuestionCard } from '@/widgets/quiz-card'
import { FeedbackOverlay } from '@/features/feedback'
import { QUIZ } from '@/features/quiz/model/quiz.data'
import { AUDIO } from '@/shared/assets/audio'
const leftGif = '/assets/gif/8.gif'
const centerGif = '/assets/gif/7.gif'
const rightGif = '/assets/gif/9.gif'
const icon10 = '/assets/gif/10.gif'
const gif19 = '/assets/gif/19.gif'
const ease = [0.22, 1, 0.36, 1] as const

export function GameScene() {
	const {
		question,
		answer,
		finished,
		result,
		feedback,
		resultGif,
		resultSuccess,
	} = useQuiz()
	const [showQuestion, setShowQuestion] = useState(false)
	const successRef = useRef<HTMLAudioElement | null>(null)
	const failRef = useRef<HTMLAudioElement | null>(null)

	const handleOpenQuiz = () => setShowQuestion(true)

	// Play sounds for feedback using useEffect
	useEffect(() => {
		if (feedback) {
			const timer = setTimeout(() => {
				if (feedback.type === 'success') {
					successRef.current?.play()
				} else {
					failRef.current?.play()
				}
			}, 0)
			return () => clearTimeout(timer)
		}
	}, [feedback])

	return (
		<motion.div
			className='absolute inset-0 font-comfortaa'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4 }}
		>
			{/* preload sounds */}
			<audio ref={successRef} src={AUDIO.success} preload='auto' />
			<audio ref={failRef} src={AUDIO.fail} preload='auto' />

			{/* Заголовок по центру сверху */}
			<motion.div
				initial={{ y: -28, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.05, duration: 0.6, ease }}
				className='absolute left-0 right-0 text-center mt-13 z-30'
			>
				<h1 className='text-5xl font-black text-red-500 drop-shadow-lg'>
					Игра на выживание?
				</h1>
			</motion.div>

			{/* Левый графический элемент */}
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute left-25 top-60 z-20'
			>
				<Image src={leftGif} alt='left-gif' width={220} height={220} unoptimized />
			</motion.div>
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute left-25 top-53 z-20 rotate-5'
			>
				<h1 className='text-xl font-extrabold text-red-500'>
					Как я прогал все это!
				</h1>
			</motion.div>

			{/* Правый графический элемент */}
			<motion.div
				initial={{ y: -40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.6, ease }}
				className='absolute right-25 top-50 z-20'
			>
				<Image src={rightGif} alt='right-gif' width={250} height={250} unoptimized />
			</motion.div>

			{/* Основной контент: карточка */}
			<motion.div
				initial={{ y: -60, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.25, duration: 0.7, ease }}
				className='absolute left-1/2 top-20 transform -translate-x-1/2 z-30 w-180'
			>
				{finished ? (
					<div
						className={`rounded-3xl ${resultSuccess ? 'bg-green-500' : 'bg-red-500'} h-135 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto flex flex-col items-center justify-center`}
					>
						{resultGif ? (
							<Image
								src={resultGif}
								alt={resultSuccess ? 'success' : 'fail'}
								width={180}
								height={180}
								unoptimized
							/>
						) : (
							<Image
								src={resultSuccess ? icon10 : gif19}
								alt={resultSuccess ? 'success' : 'fail'}
								width={180}
								height={180}
								unoptimized
							/>
						)}
						<p className='mt-4 text-3xl font-extrabold'>
							{resultSuccess
								? 'Юху! Моя девочка 🎉'
								: 'Неудача — не хватило правильных ответов.'}
						</p>
						<p className='mt-2 text-xl'>
							Результат: {result} / {QUIZ.length}
						</p>
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
							<Image src={centerGif} alt='cat box' width={220} height={140} unoptimized />
							<p className='text-xl leading-relaxed mx-auto font-bold w-4/5'>
								Поехали!
							</p>
						</motion.div>
					</div>
				) : (
					<div className='rounded-3xl bg-red-400 h-135 pt-10 mt-15 text-white shadow-2xl text-center w-lg mx-auto relative'>
						{question && <QuestionCard question={question} onAnswer={answer} />}
						<AnimatePresence mode='wait'>
							{feedback && (
								<FeedbackOverlay
									type={feedback.type}
									message={feedback.message}
									gif={feedback.gif}
									fallbackSuccess={icon10}
									fallbackFail={gif19}
								/>
							)}
						</AnimatePresence>
					</div>
				)}
			</motion.div>
		</motion.div>
	)
}
