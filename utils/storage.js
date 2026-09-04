export function setStorage(key, value) {
	return uni.setStorageSync(key, value)
}
export function getStorage(key) {
	return uni.getStorageSync(key)
}
export function removeStorage(key) {
	return uni.removeStorageSync(key)
}
