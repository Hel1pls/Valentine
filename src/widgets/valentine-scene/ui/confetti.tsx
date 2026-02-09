const confettiPieces = Array.from({ length: 30 }).map((_, i) => ({
	id: i,
	left: Math.random() * 100,
	delay: Math.random(),
}))

export function Confetti() {
	return (
		<div className='pointer-events-none absolute inset-0'>
			{confettiPieces.map(({ id, left, delay }) => (
				<span
					key={id}
					className='absolute top-0 animate-confetti text-red-400'
					style={{
						left: `${left}%`,
						animationDelay: `${delay}s`,
					}}
				>
					❤
				</span>
			))}
		</div>
	)
}
