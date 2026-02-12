export type QuizOption = {
	id: number
	text: string
	correct: boolean
}

export type QuizQuestion = {
	id: number
	question: string
	options: QuizOption[]
}
