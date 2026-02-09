'use client'

import { useRef, useState } from 'react'

export default function Home() {
	const [started, setStarted] = useState(false)
	const audioRef = useRef<HTMLAudioElement>(null)

	const onStart = () => {
		audioRef.current?.play()
		setStarted(true)
	}

	return (
		<div className='fixed inset-0 bg-pink-200 overflow-hidden'>
			<audio ref={audioRef} src='/love.mp3' />

			{/* BACKGROUND */}
			<CloudLayer />

			{/* DECOR
			{/* <BalloonLayer /> */} 

			{/* CENTER */}
			<div className='relative z-10 flex h-full items-center justify-center'>
				{!started ? (
					<button
						onClick={onStart}
						className='rounded-full bg-red-400 px-14 py-6 text-2xl font-semibold text-white shadow-xl transition hover:scale-105'
					>
						Стартуем!
					</button>
				) : (
					<LoveText />
				)}
			</div>

			{started && <ConfettiLayer />}
		</div>
	)
}

function CloudLayer() {
	return (
		<>
			<CloudRow top />
			<CloudRow />
		</>
	)
}

function CloudRow({ top }: { top?: boolean }) {
	if (!top) {
		return (
			<div
				className='absolute bottom-0 left-0 w-screen h-105
				 bg-no-repeat bg-bottom bg-cover pointer-events-none'
				style={{ backgroundImage: `url('/cloud.svg')` }}
			/>
		)
	}

	return (
		<div className={`absolute top-0 left-0 w-full flex justify-between px-24`}>
			<Cloud />
			<Cloud large />
			<Cloud />
		</div>
	)
}

function Cloud({ large }: { large?: boolean }) {
	return (
		<div className={`relative ${large ? 'w-80 h-40' : 'w-64 h-32'}`}>
			<div className='absolute bottom-0 left-0 w-28 h-28 bg-white rounded-full' />
			<div className='absolute bottom-0 left-20 w-40 h-40 bg-white rounded-full' />
			<div className='absolute bottom-0 left-50 w-24 h-24 bg-white rounded-full' />
		</div>
	)
}

function BalloonLayer() {
	return (
		<>
			<Balloon x='20%' y='30%' />
			<Balloon x='80%' y='28%' />
			<Balloon x='30%' y='65%' />
			<Balloon x='70%' y='62%' />
		</>
	)
}

function Balloon({ x, y }: { x: string; y: string }) {
	return (
		<div className='absolute animate-balloon' style={{ left: x, top: y }}>
			<div className='relative'>
				<div className='text-5xl text-red-400'>❤</div>
			</div>
		</div>
	)
}

function LoveText() {
	const text = 'VARVARA, I LOVE YOU ❤️'

	return (
		<h1 className='text-5xl font-bold text-red-500 tracking-wide'>
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
const confetti = Array.from({ length: 24 })

function ConfettiLayer() {
	return (
		<div className='pointer-events-none absolute inset-0'>
			{confetti.map((_, i) => (
				<span
					key={i}
					className='absolute top-0 animate-confetti text-red-400'
					style={{ left: `${(i + 1) * 4}%` }}
				>
					❤
				</span>
			))}
		</div>
	)
}
