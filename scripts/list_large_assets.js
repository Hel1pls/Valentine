const fs = require('fs')
const path = require('path')
const start = path.join(__dirname, '..', 'src', 'shared', 'assets')
function walk(dir, res = []) {
	if (!fs.existsSync(dir)) return res
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name)
		const st = fs.statSync(p)
		if (st.isDirectory()) walk(p, res)
		else res.push({ path: p, size: st.size })
	}
	return res
}
const all = walk(start).sort((a, b) => b.size - a.size)
for (const f of all.filter(x => x.size > 50 * 1024)) {
	console.log(`${(f.size / 1024).toFixed(2)} KB\t${f.path}`)
}
