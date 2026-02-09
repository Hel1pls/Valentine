export function CloudRow({ position }: { position: 'top' | 'bottom' }) {
	return (
		<div
			className={`absolute pointer-events-none z-0 ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 flex w-full justify-between px-24 h-40`}
		>
			<Cloud scale={1} />
			<Cloud scale={1.2} />
			<Cloud scale={0.9} />
		</div>
	)
}

function Cloud({ scale }: { scale: number }) {
	return (
		<div
			style={{ transform: `scale(${scale})` }}
			className='relative h-40 w-72'
		>
			<div className='absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white opacity-90' />
			<div className='absolute bottom-0 left-16 h-32 w-32 rounded-full bg-white opacity-90' />
			<div className='absolute bottom-0 left-40 h-24 w-24 rounded-full bg-white opacity-90' />
		</div>
	)
}
