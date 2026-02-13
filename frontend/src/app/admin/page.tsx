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
				<div className="rounded-xl border border-white/10 bg-white/2 px-8 py-6">
					<p className="text-white/80">Загружаю результаты…</p>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className="min-h-screen flex items-center justify-center bg-black px-4">
				<div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-6 py-8 text-center max-w-md">
					<p className="text-rose-400 font-medium mb-4">Ошибка: {error}</p>
					<button
						type="button"
						onClick={() => { setError(null); load() }}
						className="px-4 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
					>
						Повторить
					</button>
				</div>
			</main>
		)
	}

	return (
		<main className="min-h-screen bg-black text-white px-4 py-10">
			<div className="max-w-3xl mx-auto">
				<header className="mb-8">
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
						Результаты квиза
					</h1>
					<p className="mt-2 text-sm text-white/50">
						Пользователь не может проходить квиз дважды. Удалите результат — тогда он сможет пройти снова.
					</p>
				</header>

				{!data || data.length === 0 ? (
					<div className="rounded-xl border border-white/10 bg-white/2 px-6 py-10 text-center">
						<p className="text-white/60">Пока нет ни одной попытки.</p>
					</div>
				) : (
					<div className="space-y-3">
						{data.map(attempt => (
							<div
								key={attempt._id}
								className="rounded-xl border border-white/10 bg-white/2 overflow-hidden transition-colors hover:border-white/15"
							>
								{/* Сводная строка */}
								<button
									type="button"
									onClick={() =>
										setExpandedId(prev =>
											prev === attempt._id ? null : attempt._id,
										)
									}
									className="w-full flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-4 text-left hover:bg-white/3 transition-colors"
								>
									<span className="font-mono text-xs sm:text-sm text-white/90 truncate min-w-0 flex-1">
										{attempt.userId}
									</span>
									<span className="shrink-0 px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 text-sm tabular-nums">
										{attempt.totalCorrect}/{attempt.totalQuestions}
									</span>
									<span
										className={`shrink-0 px-2.5 py-0.5 rounded-md text-sm font-medium ${
											attempt.success
												? 'bg-emerald-500/20 text-emerald-400'
												: 'bg-rose-500/20 text-rose-400'
										}`}
									>
										{attempt.success ? 'Успех' : 'Не сдал'}
									</span>
									<span className="shrink-0 text-xs text-white/40 whitespace-nowrap">
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
										onClick={e => {
											e.stopPropagation()
											handleDelete(attempt)
										}}
										disabled={deletingId === attempt._id}
										className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-rose-500/40 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-50 disabled:pointer-events-none transition-colors"
									>
										{deletingId === attempt._id ? 'Удаляю…' : 'Удалить'}
									</button>
								</button>

								{/* Подробная разбивка по вопросам */}
								{expandedId === attempt._id && (
									<div className="border-t border-white/10 bg-black/40 px-4 pb-4 pt-1">
										<h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4 mt-3">
											Ответы по вопросам
										</h3>
										<ol className="space-y-4">
											{attempt.answers.map((a, i) => (
												<li
													key={`${attempt._id}-${a.questionId}-${i}`}
													className={`pl-4 border-l-2 ${
														a.correct
															? 'border-emerald-500/50'
															: 'border-rose-500/50'
													}`}
												>
													<p className="text-sm font-medium text-white/95 leading-snug">
														{a.question}
													</p>
													<p className="mt-1.5 text-sm text-white/60 flex flex-wrap items-center gap-2">
														<span>Ответ: «{a.chosenText}»</span>
														{a.correct ? (
															<span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
																<span aria-hidden>✓</span> верно
															</span>
														) : (
															<span className="inline-flex items-center gap-1 text-rose-400 font-medium">
																<span aria-hidden>✗</span> неверно
															</span>
														)}
													</p>
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
