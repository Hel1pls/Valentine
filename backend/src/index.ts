import express, { Request, Response } from 'express'
import mongoose from 'mongoose'

const app = express()

// Порт, на котором будет работать сервер
const PORT = Number(process.env.PORT) || 4000

// Строка подключения к MongoDB
const MONGO_URL =
	process.env.MONGO_URL || 'mongodb://localhost:27017/valentines'

// Позволяет Express понимать JSON в теле запросов
app.use(express.json())

// Простейший CORS: разрешаем запросы с любых origin (мы не используем куки)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Content-Type')

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204)
	}

	next()
})

// ----- Схема и модель для результатов квиза -----

type AnswerDTO = {
	questionId: number
	question: string
	optionId: number
	chosenText: string
	correct: boolean
}

type QuizResultBody = {
	userId: string
	answers: AnswerDTO[]
	totalCorrect: number
	totalQuestions: number
}

const quizAttemptSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, unique: true },
		answers: [
			{
				questionId: Number,
				question: String,
				optionId: Number,
				chosenText: String,
				correct: Boolean,
			},
		],
		totalCorrect: Number,
		totalQuestions: Number,
		success: Boolean,
		createdAt: { type: Date, default: Date.now },
	},
	{ versionKey: false },
)

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema)

// ----- Роуты -----

// Базовый health-check, чтобы проверить, что сервер жив
app.get('/api/health', (req: Request, res: Response) => {
	res.json({
		status: 'ok',
		dbConnected: mongoose.connection.readyState === 1,
		env: process.env.NODE_ENV || 'development',
	})
})

// Проверка: проходил ли пользователь квиз (для показа сцены «уже пройден»)
app.get('/api/quiz-results/check/:userId', async (req: Request, res: Response) => {
	try {
		const { userId } = req.params
		if (!userId) return res.status(400).json({ error: 'userId required' })
		const attempt = await QuizAttempt.findOne({ userId }).lean()
		if (!attempt) return res.status(404).json({ error: 'notFound' })
		return res.json({
			passed: true,
			success: !!attempt.success,
			totalCorrect: attempt.totalCorrect,
			totalQuestions: attempt.totalQuestions,
		})
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Failed to check' })
	}
})

// Приём результатов квиза
app.post(
	'/api/quiz-results',
	async (req: Request<unknown, unknown, QuizResultBody>, res: Response) => {
		try {
			const { userId, answers, totalCorrect, totalQuestions } = req.body

			if (!userId || !Array.isArray(answers)) {
				return res.status(400).json({ error: 'Invalid payload' })
			}

			// Проверяем, не проходил ли пользователь квиз раньше
			const existing = await QuizAttempt.findOne({ userId }).lean()
			if (existing) {
				return res.status(409).json({ error: 'alreadyPassed' })
			}

			const success = totalCorrect >= Math.ceil(totalQuestions * 0.7)

			await QuizAttempt.create({
				userId,
				answers,
				totalCorrect,
				totalQuestions,
				success,
			})

			return res.status(201).json({ ok: true, success })
		} catch (err) {
			console.error(err)
			return res.status(500).json({ error: 'Failed to save quiz results' })
		}
	},
)

// Получение списка результатов квиза (для админки)
app.get('/api/quiz-results', async (req: Request, res: Response) => {
	try {
		const attempts = await QuizAttempt.find({})
			.sort({ createdAt: -1 })
			.limit(100)
			.lean()

		return res.json(attempts)
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Failed to load quiz results' })
	}
})

// Удаление результата по userId — после этого пользователь сможет пройти квиз снова
app.delete('/api/quiz-results/:userId', async (req: Request, res: Response) => {
	try {
		const { userId } = req.params
		if (!userId) {
			return res.status(400).json({ error: 'userId required' })
		}
		const deleted = await QuizAttempt.findOneAndDelete({ userId }).lean()
		if (!deleted) {
			return res.status(404).json({ error: 'Attempt not found' })
		}
		return res.status(200).json({ ok: true, deleted: deleted._id })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Failed to delete quiz result' })
	}
})

// ----- Запуск приложения только после подключения к MongoDB -----

async function start() {
	try {
		await mongoose.connect(MONGO_URL)
		console.log('Connected to MongoDB')

		app.listen(PORT, () => {
			console.log(`Backend listening on port ${PORT}`)
			console.log(`MONGO_URL: ${MONGO_URL}`)
		})
	} catch (err) {
		console.error('Failed to connect to MongoDB', err)
		process.exit(1)
	}
}

start()

