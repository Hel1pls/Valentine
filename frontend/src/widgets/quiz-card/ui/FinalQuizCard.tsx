'use client'

import Image from 'next/image'

const gifSuccess = '/assets/gif/17.gif'
const gifFail = '/assets/gif/6.gif'

type Props = {
	success: boolean
}

export function FinalQuizCard({ success }: Props) {
	return (
		<div className="rounded-3xl bg-red-400 min-h-135 pt-10 pb-10 mt-15 text-white shadow-2xl w-lg mx-auto flex flex-col items-center justify-center gap-4 px-6 text-center">
			<Image
				src={success ? gifSuccess : gifFail}
				alt=""
				width={100}
				height={100}
				unoptimized
				className="shrink-0"
			/>
			<h2 className="text-3xl md:text-4xl font-black leading-tight text-center">
				С Днём святого Валентина!
			</h2>
			<p className="text-base text-white/90 leading-relaxed max-w-sm text-center">
				{success ? (
					<>
						<span>Ты прошла мой маленький квест и ещё раз доказала, какая ты умная и чудесная.</span>
						<br />
						<span>Спасибо, что ты со мной. Подарок уже ждёт тебя в группе 💝</span>
					</>
				) : (
					<>
						<span>Даже если ответы были не идеальными, для меня ты всё равно самая любимая и родная.</span>
						<br />
						<span>Загляни в группу — там тебя тоже ждёт небольшой подарок от меня 💝</span>
					</>
				)}
			</p>
		</div>
	)
}
