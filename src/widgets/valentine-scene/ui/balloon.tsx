export function Balloon({ className }: { className: string }) {
	return (
		<div className={`absolute animate-float ${className}`}>
			<div className='relative'>
				<div className='text-6xl text-red-400'>❤</div>
				<div className='mx-auto mt-1 h-16 w-px bg-red-300' />
			</div>
		</div>
	)
}
