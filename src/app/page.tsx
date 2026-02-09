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
		</div>
	)
}

function CloudLayer({ started }: { started: boolean }) {
	return (
		<div
			className={`absolute bottom-0 left-0 h-105 w-full bg-no-repeat bg-bottom pointer-events-none transform-gpu transition-transform duration-900 ease-in-out ${
				started ? 'translate-y-[100vh]' : 'translate-y-0'
			}`}
			style={{
				backgroundImage: `url(${cloudSvg})`,
				backgroundSize: '100% auto',
			}}
		/>
	)
}

function TopLayer({ started }: { started: boolean }) {
	return (
		<div
			className={`pointer-events-none absolute top-0 left-0 w-full z-30 transform-gpu transition-transform duration-1000 ease-in-out ${
				started ? 'translate-y-[100vh]' : 'translate-y-0'
			}`}
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
			<div
				className={`absolute right-90 top-8 ${!started ? 'animate-sway-x' : ''}`}
				style={{ width: 120, height: 120 }}
			>
				<Image src={giftSvg} alt='gift' width={120} height={120} priority />
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
			className={`absolute z-0 pointer-events-none left-20 bottom-36 transform-gpu transition-transform duration-1000 ease-in-out ${
				started ? 'translate-y-[100vh]' : 'translate-y-0'
			}`}
			priority
		/>
	)
}

function LoveText() {
	const text = 'Игра на выживание?'

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
