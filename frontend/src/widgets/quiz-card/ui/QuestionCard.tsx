import { motion } from 'framer-motion'
import { QuizQuestion, type QuizOption } from '@/features/quiz'

type Props = {
	question: QuizQuestion
	onAnswer: (optionIndex: number) => void
}

export function QuestionCard({ question, onAnswer }: Props) {
	return (
		<>
			<p className='text-2xl leading-relaxed mx-auto font-bold w-4/5'>
				{question.question}
			</p>
			<div className='mt-14 flex flex-col items-center space-y-4 px-8'>
				{question.options.map((opt: QuizOption, i: number) => (
					<motion.button
						key={i}
						onClick={() => onAnswer(i)}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full text-white text-xl font-bold py-4 rounded-lg bg-red-500 hover:bg-red-600 transition'
					>
						{opt.text}
					</motion.button>
				))}
			</div>
		</>
	)
}
