import { QuizQuestion } from './quiz.types'

// assets (served from public to avoid bundling)
const icon10 = '/assets/gif/10.gif'
const gif19 = '/assets/gif/19.gif'
const gif1 = '/assets/gif/1.gif'
const gif4 = '/assets/gif/4.gif'
const gif5 = '/assets/gif/5.gif'
const gif7 = '/assets/gif/7.gif'
const gif11 = '/assets/gif/11.gif'
const gif13 = '/assets/gif/13.gif'
const gif14 = '/assets/gif/14.gif'
const gif15 = '/assets/gif/15.gif'
const gif16 = '/assets/gif/16.gif'

export const FEEDBACK_DURATION = 3000

export const successPhrases = [
	'Умница!',
	'Милашка',
	'Юху🎉',
	'Целую твою жопку',
]
export const failPhrases = [
	'Ты че дурында? :(',
	'Варя...',
	'Ну ты и лошара',
	'Дурочка',
]

export const positiveFeedbackGifs: string[] = [
	icon10,
	gif1,
	gif4,
	gif5,
	gif7,
	gif11,
	gif13,
]
export const negativeFeedbackGifs: string[] = [gif19, gif14, gif15, gif16]

export const QUIZ: QuizQuestion[] = [
	{
		id: 1,
		question:
			'Сколько матов было написано и произнесено за первый час нашего общения?',
		options: [
			{ id: 1, text: '30', correct: true },
			{ id: 2, text: '47', correct: false },
			{ id: 3, text: '13', correct: false },
			{ id: 4, text: '24', correct: false },
		],
	},
	{
		id: 2,
		question: 'Какого числа я бухой тебе написал?',
		options: [
			{ id: 1, text: '19', correct: true },
			{ id: 2, text: '22', correct: false },
			{ id: 3, text: '7', correct: false },
			{ id: 4, text: '13', correct: false },
		],
	},
	{
		id: 3,
		question: 'Какой у меня любимый цвет? (Не в одежде)',
		options: [
			{ id: 1, text: 'Красный', correct: true },
			{ id: 2, text: 'Зелёный', correct: false },
			{ id: 3, text: 'Синий', correct: false },
			{ id: 4, text: 'Жёлтый', correct: false },
		],
	},
	{
		id: 4,
		question: 'Что я сделал когда мы впервые встретились?',
		options: [
			{ id: 1, text: 'Въебал', correct: false },
			{ id: 2, text: 'Опоздал', correct: false },
			{ id: 3, text: 'Напугал', correct: true },
			{ id: 4, text: 'Пошутил', correct: false },
		],
	},
	{
		id: 5,
		question: 'Столица австралии?',
		options: [
			{ id: 1, text: 'Сидней', correct: false },
			{ id: 2, text: 'Мельбурн', correct: false },
			{ id: 3, text: 'Канберра', correct: true },
			{ id: 4, text: 'Брисбен', correct: false },
		],
	},
	{
		id: 6,
		question: 'Отмена крепостного права?',
		options: [
			{ id: 1, text: '1855', correct: false },
			{ id: 2, text: '1870', correct: false },
			{ id: 3, text: '1865', correct: false },
			{ id: 4, text: '1861', correct: true },
		],
	},
	{
		id: 7,
		question: 'Что из этого я люблю больше?',
		options: [
			{ id: 1, text: 'Сиси', correct: false },
			{ id: 2, text: 'Попа', correct: true },
			{ id: 3, text: 'Тити', correct: false },
			{ id: 4, text: 'Душа', correct: false },
		],
	},
	{
		id: 8,
		question: 'Столица Африки?',
		options: [
			{ id: 1, text: 'Каир', correct: false },
			{ id: 2, text: 'Лагос', correct: false },
			{ id: 3, text: 'Киншаса', correct: false },
			{ id: 4, text: 'Долбаеб', correct: true },
		],
	},
	{
		id: 9,
		question: 'Сколько?',
		options: [
			{ id: 1, text: 'Много', correct: true },
			{ id: 2, text: 'Дохуя', correct: true },
			{ id: 3, text: 'Пиздец', correct: true },
			{ id: 4, text: 'Ебанешься', correct: true },
		],
	},
	{
		id: 10,
		question: 'Какой подарок я обещал(а) за правильные ответы?',
		options: [
			{ id: 1, text: 'Дайсон', correct: false },
			{ id: 2, text: '---', correct: true },
			{ id: 3, text: 'Клетку', correct: false },
			{ id: 4, text: 'Стринги', correct: false },
		],
	},
]
