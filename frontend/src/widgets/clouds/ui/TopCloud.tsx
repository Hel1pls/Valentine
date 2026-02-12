import Image from 'next/image'
const topCloud = '/assets/svg/Top_Cloud.svg'

export function TopCloud() {
	return (
		<div
			className='absolute top-1 left-0 pointer-events-none z-10 overflow-hidden'
			style={{ height: '223px', width: '100%' }}
		>
			<Image
				src={topCloud}
				alt='top-cloud'
				fill
				className='object-cover object-bottom'
				style={{
					transform: 'scaleY(-1)',
				}}
				priority
				unoptimized
			/>
		</div>
	)
}
