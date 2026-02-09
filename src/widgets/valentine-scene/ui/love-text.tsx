export function LoveText() {
	const text = 'VARVARA, I LOVE YOU ❤️'

	return (
		<h1 className='flex text-5xl font-bold text-red-500'>
			{text.split('').map((char, i) => (
				<span
					key={i}
					className='animate-letter'
					style={{ animationDelay: `${i * 0.08}s` }}
				>
					{char === ' ' ? '\u00A0' : char}
				</span>
			))}
		</h1>
	)
}
