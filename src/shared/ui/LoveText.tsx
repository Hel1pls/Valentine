type Props = {
	text: string
}

export function LoveText({ text }: Props) {
	return (
		<h1>
			{text.split('').map((c, i) => (
				<span key={i} style={{ animationDelay: `${i * 0.05}s` }}>
					{c}
				</span>
			))}
		</h1>
	)
}
