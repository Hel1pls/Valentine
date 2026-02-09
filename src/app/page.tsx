'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import girlImg from '@/shared/assets/img/girl1.png'

const loveMp3 = new URL('../shared/assets/audio/love.mp3', import.meta.url).href
const cloudSvg = new URL('../shared/assets/svg/Cloud.svg', import.meta.url).href
const topCloudSvg = new URL(
	'../shared/assets/svg/Top_Cloud.svg',
	import.meta.url,
).href
const giftSvg = new URL('../shared/assets/svg/gift.svg', import.meta.url).href

export default function Home() {
	const [started, setStarted] = useState(false)
	const audioRef = useRef<HTMLAudioElement>(null)

	const onStart = () => {
		audioRef.current?.play()
		setStarted(true)
	}

	return (
		<div className='fixed inset-0 bg-pink-200 overflow-hidden'>
			<audio ref={audioRef} src={loveMp3} />

			{/* TOP LAYER: cloud + gift */}
			<TopLayer started={started} />

			{/* GIRL IMAGE (ниже облаков) */}
			<GirlImage started={started} />

			{/* BACKGROUND CLOUDS */}
			<CloudLayer started={started} />

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

function CloudLayer({ started }: { started: boolean }) {
	return (
		<div
			className={`absolute bottom-0 left-0 h-105 w-full bg-no-repeat bg-bottom pointer-events-none transition-transform duration-700 ease-in-out ${
				started ? 'translate-y-105' : 'translate-y-0'
			}`}
			style={{
				backgroundImage: `url(${cloudSvg})`,
				backgroundSize: '100% auto',
				willChange: 'transform',
			}}
		/>
	)
}

function TopLayer({ started }: { started: boolean }) {
	return (
		<div
			className={`pointer-events-none absolute top-0 left-0 w-full z-30 transition-transform duration-700 ease-in-out`}
			style={{
				transform: started ? 'translateY(100vh)' : 'translateY(0)',
				willChange: 'transform',
			}}
		>
			{/* top cloud */}
			<div
				className='w-full h-58 bg-no-repeat bg-top mt-5'
				style={{
					backgroundImage: `url(${topCloudSvg})`,
					backgroundSize: '100% auto',
				}}
			/>

			{/* gift */}
			<div style={{ position: 'absolute', right: 378, top: 48 }}>
				<Image
					src={giftSvg}
					alt='gift'
					width={150}
					height={150}
					className={`${!started ? 'animate-sway' : ''}`}
					style={{ transformOrigin: 'center top' }}
					priority
				/>
			</div>
		</div>
	)
}

function GirlImage({ started }: { started: boolean }) {
	return (
		<Image
			src={girlImg}
			alt='girl'
			width={girlImg.width}
			height={girlImg.height}
			className='absolute z-0 pointer-events-none'
			style={{
				bottom: 150,
				left: 80,
				transform: started ? 'translateY(100vh)' : 'translateY(0)',
				transition: 'transform 700ms ease-in-out',
				willChange: 'transform',
			}}
			priority
		/>
	)
}

function LoveText() {
	const text = 'Варя я люблю тебя ❤️'

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
