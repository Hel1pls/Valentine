const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..', 'src')
const exts = ['.ts', '.tsx', '.js', '.jsx']
const files = []
function walk(dir) {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		const st = fs.statSync(p)
		if (st.isDirectory()) walk(p)
		else if (exts.includes(path.extname(p))) files.push(p)
	}
}
walk(root)
const importRe = /(?:import|export)\s.*from\s+['"](.*?)['"]/g
const relRe = /^\.|^@\//
const graph = new Map()
for (const f of files) {
	const txt = fs.readFileSync(f, 'utf8')
	const dir = path.dirname(f)
	const deps = []
	let m
	while ((m = importRe.exec(txt))) {
		const imp = m[1]
		if (relRe.test(imp)) {
			let resolved
			if (imp.startsWith('@/')) {
				resolved = path.join(root, imp.replace(/^@\//, ''))
			} else {
				resolved = path.join(dir, imp)
			}
			// try different extensions and index files
			const candidates = []
			if (path.extname(resolved)) candidates.push(resolved)
			else {
				for (const e of exts) candidates.push(resolved + e)
				candidates.push(path.join(resolved, 'index.ts'))
				candidates.push(path.join(resolved, 'index.tsx'))
			}
			const found = candidates.find(p => fs.existsSync(p))
			if (found) deps.push(path.normalize(found))
		}
	}
	graph.set(path.normalize(f), deps)
}
// find cycles using DFS
const visited = new Set()
const stack = []
const cycles = []
function dfs(node, seen) {
	if (seen.has(node)) {
		const idx = stack.indexOf(node)
		if (idx >= 0) cycles.push(stack.slice(idx).concat(node))
		return
	}
	if (!graph.has(node)) return
	seen.add(node)
	stack.push(node)
	for (const nb of graph.get(node) || []) dfs(nb, seen)
	stack.pop()
	seen.delete(node)
}
for (const n of graph.keys()) dfs(n, new Set())
if (cycles.length === 0) {
	console.log('No cycles found')
} else {
	console.log('Cycles found:')
	for (const c of cycles) {
		console.log(' - ' + c.join(' -> '))
	}
}
