'use client'

import { useRef } from 'react'
import { useSceneStore } from '../model/scene-store'
import { CloudRow } from './cloud-row'
import { Balloon } from './balloon'
import { LoveText } from './love-text'
import { Confetti } from './confetti'

export function ValentineScene() {
	const { scene, start } = useSceneStore()
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const handleStart = async () => {
		try {
			await audioRef.current?.play()
		} catch (e) {
			// ignore play errors when file missing or unsupported
		}
		start()
	}

	return (
		<div className='fixed inset-0 overflow-hidden bg-gradient-to-b from-pink-200 to-pink-100'>
			<audio ref={audioRef} src='/love.mp3' preload='auto' />
			{/* ОБЛАКА */}
			<CloudRow position='top' />
			<CloudRow position='bottom' />

			{/* ШАРИКИ-СЕРДЦА */}
			<Balloon className='left-[15%] top-[30%] delay-0' />
			<Balloon className='right-[18%] top-[25%] delay-200' />
			<Balloon className='left-[30%] bottom-[25%] delay-500' />
			<Balloon className='right-[35%] bottom-[30%] delay-700' />

			{/* КОНТЕНТ */}
			<div className='relative z-10 flex h-full items-center justify-center'>
				{scene === 'intro' && (
					<button
						onClick={handleStart}
						className='rounded-full bg-red-400 px-14 py-6 text-2xl font-semibold text-white shadow-2xl transition hover:scale-105 hover:bg-red-500'
					>
						Поехали ❤️
					</button>
				)}

				{scene === 'love' && <LoveText />}
			</div>

			{/* КОНФЕТТИ */}
			{scene === 'love' && <Confetti />}
		</div>
	)
}
