function getTodayStr() {
	const d = new Date()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${d.getFullYear()}-${m}-${day}`
}

function getFullDateStr(value) {
	const m = String(value.getMonth() + 1).padStart(2, '0')
	const day = String(value.getDate()).padStart(2, '0')
	return `${value.getFullYear()}-${m}-${day}`
}

export {
	getTodayStr,
	getFullDateStr
}
