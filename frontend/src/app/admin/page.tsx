'use client'

import { useCallback, useEffect, useState } from 'react'

type AnswerDTO = {
	questionId: number
	question: string
	optionId: number
	chosenText: string
	correct: boolean
}

type QuizAttempt = {
	_id: string
	userId: string
	answers: AnswerDTO[]
	totalCorrect: number
	totalQuestions: number
	success: boolean
	createdAt: string
}

const API_URL =
	typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
		? process.env.NEXT_PUBLIC_API_URL
		: 'http://localhost:4000'

const AdminPage = () => {
	const [data, setData] = useState<QuizAttempt[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [deletingId, setDeletingId] = useState<string | null>(null)

	const load = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/api/quiz-results`)
			if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
			const json = (await res.json()) as QuizAttempt[]
			setData(json)
			setError(null)
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Не удалось загрузить результаты',
			)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		load()
	}, [load])

	const handleDelete = useCallback(
		async (attempt: QuizAttempt) => {
			if (deletingId) return
			if (!confirm(`Удалить результат пользователя ${attempt.userId}? После этого он сможет пройти квиз снова.`)) return
			setDeletingId(attempt._id)
			try {
				const res = await fetch(
					`${API_URL}/api/quiz-results/${encodeURIComponent(attempt.userId)}`,
					{ method: 'DELETE' },
				)
				if (!res.ok) {
					const err = await res.json().catch(() => ({}))
					throw new Error((err as { error?: string }).error || `HTTP ${res.status}`)
				}
				await load()
				if (expandedId === attempt._id) setExpandedId(null)
			} catch (e) {
				setError(
					e instanceof Error ? e.message : 'Не удалось удалить результат',
				)
			} finally {
				setDeletingId(null)
			}
		},
		[deletingId, load, expandedId],
	)

	if (loading) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-black text-white">
				<p className="text-xl">Загружаю результаты…</p>
			</main>
		)
	}

	if (error) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-black text-red-400 px-4">
				<div className="text-center">
					<p className="text-xl mb-4">Ошибка: {error}</p>
					<button
						type="button"
						onClick={() => { setError(null); load() }}
						className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
					>
						Повторить
					</button>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen bg-black text-white px-4 py-10">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-2">Результаты квиза</h1>
				<p className="text-white/60 text-sm mb-6">
					Пользователь не может проходить квиз дважды. Удалите результат — тогда он сможет пройти снова.
				</p>
				{!data || data.length === 0 ? (
					<p>Пока нет ни одной попытки.</p>
				) : (
					<div className="space-y-4">
						{data.map(attempt => (
							<div
								key={attempt._id}
								className="rounded-lg border border-white/10 overflow-hidden"
							>
								{/* Сводная строка */}
								<div className="bg-white/5 flex flex-wrap items-center gap-4 px-4 py-3">
									<button
										type="button"
										onClick={() =>
											setExpandedId(prev =>
												prev === attempt._id ? null : attempt._id,
											)
										}
										className="flex items-center gap-2 text-left min-w-0 flex-1"
									>
										<span
											className="text-white/70 transition-transform"
											aria-hidden
										>
											{expandedId === attempt._id ? '▼' : '▶'}
										</span>
										<span className="font-mono text-xs md:text-sm truncate">
											{attempt.userId}
										</span>
										<span className="text-white/80 shrink-0">
											{attempt.totalCorrect}/{attempt.totalQuestions}
										</span>
										<span
											className={
												attempt.success
													? 'text-emerald-400 font-semibold'
													: 'text-rose-400 font-semibold'
											}
										>
											{attempt.success ? 'Успех' : 'Не сдал'}
										</span>
									</button>
									<span className="text-white/50 text-sm whitespace-nowrap">
										{new Date(attempt.createdAt).toLocaleString('ru-RU', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
									<button
										type="button"
										onClick={() => handleDelete(attempt)}
										disabled={deletingId === attempt._id}
										className="px-3 py-1.5 rounded text-sm bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 disabled:opacity-50"
									>
										{deletingId === attempt._id ? 'Удаляю…' : 'Удалить результат'}
									</button>
								</div>

								{/* Подробная разбивка по вопросам */}
								{expandedId === attempt._id && (
									<div className="border-t border-white/10 bg-black/30 px-4 py-4">
										<h3 className="text-sm font-semibold text-white/80 mb-3">
											Ответы по вопросам
										</h3>
										<ol className="space-y-3 list-decimal list-inside">
											{attempt.answers.map((a, i) => (
												<li
													key={`${attempt._id}-${a.questionId}-${i}`}
													className="text-sm"
												>
													<span className="text-white/90 font-medium">
														{a.question}
													</span>
													<br />
													<span className="text-white/70">
														Ответ: «{a.chosenText}»
														{a.correct ? (
															<span className="text-emerald-400 ml-1">✓ верно</span>
														) : (
															<span className="text-rose-400 ml-1">✗ неверно</span>
														)}
													</span>
												</li>
											))}
										</ol>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	)
}

export default AdminPage
