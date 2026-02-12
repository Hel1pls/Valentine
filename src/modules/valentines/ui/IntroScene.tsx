'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { TopCloud, BottomClouds } from '@/widgets/clouds'
import Image from 'next/image'
import { AUDIO } from '@/shared/assets/audio'

const giftSvg = '/assets/svg/gift.svg'
const ease = [0.22, 1, 0.36, 1] as const
const transition = { duration: 0.75, ease }
const EXIT_DELAY_MS = 850

type Props = {
	onStart: () => void
}

export function IntroScene({ onStart }: Props) {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [isExiting, setIsExiting] = useState(false)

	const handleStart = () => {
		if (isExiting) return
		audioRef.current?.play()
		setIsExiting(true)
		setTimeout(onStart, EXIT_DELAY_MS)
	}

	return (
		<div className='absolute inset-0 font-comfortaa'>
			<audio ref={audioRef} src={AUDIO.love} />

			{/* Верхние облака — улетают ВВЕРХ */}
			<motion.div
				className='absolute top-0 left-0 right-0 z-10'
				animate={{ y: isExiting ? -280 : 0, opacity: isExiting ? 0 : 1 }}
				transition={transition}
			>
				<TopCloud />
			</motion.div>

			{/* Подарок — улетает ВВЕРХ */}
			<motion.div
				className='absolute right-94 top-16 z-20 pointer-events-none'
				animate={{ y: isExiting ? -320 : 0, opacity: isExiting ? 0 : 1 }}
				transition={transition}
			>
				<Image src={giftSvg} alt='gift' width={120} height={120} priority />
			</motion.div>

			{/* Нижние облака и девочка — уезжают ВНИЗ (обёртка с position, чтобы дети двигались вместе) */}
			<motion.div
				className='absolute bottom-0 left-0 right-0 h-[420px] w-full'
				animate={{ y: isExiting ? 420 : 0, opacity: isExiting ? 0 : 1 }}
				transition={transition}
			>
				<BottomClouds />
			</motion.div>

			<motion.div
				className='relative z-30 flex h-full items-center justify-center'
				animate={{ opacity: isExiting ? 0 : 1 }}
				transition={{ ...transition, duration: 0.5 }}
			>
				<button
					onClick={handleStart}
					className='rounded-full bg-red-400 px-14 py-6 text-2xl font-semibold text-white shadow-2xl'
					aria-label='Стартуем'
				>
					Стартуем!
				</button>
			</motion.div>
		</div>
	)
}
