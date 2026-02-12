import Image from 'next/image'
const girlImg = '/assets/img/girl1.png'
const BottomCloudSvg = '/assets/svg/Cloud.svg'

export function BottomClouds() {
	return (
		<div>
			<div
				className='absolute bottom-0  w-full pointer-events-none z-10 '
				style={{ height: '360px' }}
			>
				<Image
					src={BottomCloudSvg}
					alt='bottom-cloud'
					fill
					className='object-cover object-top'
					priority
					unoptimized
				/>
			</div>
			<div className='absolute bottom-46 left-60 transform -translate-x-1/2 pointer-events-none z-2'>
				<Image src={girlImg} alt='girl' width={260} height={260} priority />
			</div>
		</div>
	)
}
