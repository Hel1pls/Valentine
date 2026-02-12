'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IntroScene, GameScene } from '@/modules/valentines/ui'

const ease = [0.22, 1, 0.36, 1] as const
const transitionIn = { duration: 0.55, ease }

export default function Page() {
	const [scene, setScene] = useState<'intro' | 'game'>('intro')
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const handleStart = () => {
		setScene('game')
	}

	return (
		<div className='fixed inset-0 bg-pink-200 overflow-hidden'>
			<audio ref={audioRef} src='/assets/audio/love.mp3' preload='auto' />

			<AnimatePresence mode='wait'>
				{scene === 'intro' ? (
					<div key='intro' className='absolute inset-0'>
						<IntroScene onStart={handleStart} />
					</div>
				) : (
					<motion.div
						key='game'
						className='absolute inset-0'
						initial={{ opacity: 0, scale: 0.92, y: 32 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={transitionIn}
					>
						<GameScene />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
