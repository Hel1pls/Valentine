import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { motion } from 'framer-motion'

type Props = {
	type: 'success' | 'fail'
	message: string
	gif?: string | StaticImageData | null
	fallbackSuccess?: string | StaticImageData
	fallbackFail?: string | StaticImageData
}

export function FeedbackOverlay({
	message,
	gif,
	type,
	fallbackSuccess,
	fallbackFail,
}: Props) {
	return (
		<motion.div
			key='feedback'
			initial={{ opacity: 0, scale: 0.92 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.96 }}
			transition={{ duration: 0.45, ease: 'easeInOut' }}
			className='absolute inset-0 rounded-3xl flex flex-col items-center justify-center z-50 p-4 pointer-events-none bg-red-400'
		>
			<div className='pointer-events-auto flex flex-col items-center justify-center'>
				{gif ? (
					<Image src={gif} alt={type} width={160} height={160} unoptimized />
				) : type === 'success' && fallbackSuccess ? (
					<Image src={fallbackSuccess} alt='success' width={96} height={96} unoptimized />
				) : fallbackFail ? (
					<Image src={fallbackFail} alt='fail' width={120} height={120} unoptimized />
				) : null}
				<p className='mt-4 text-2xl font-extrabold text-white'>{message}</p>
			</div>
		</motion.div>
	)
}
