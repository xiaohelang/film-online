/* eslint-disable */
/**
 * 日期工具类
 */
const weekArr = new Array("日", "一", "二", "三", "四", "五", "六"); 
/**
 * 日期格式转换类
 * @param {*} date 
 * @param {*} fmt 
 */
export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + '').substr(4 - RegExp.$1.length)
		)
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + ''
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : padLeftZero(str)
			)
		}
	}
	return fmt
}

export function strDateFormat(dateStr, fmt) {
	let date = new Date(Date.parse(dateStr.replace(/-/g, '/')))
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + '').substr(4 - RegExp.$1.length)
		)
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + ''
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : padLeftZero(str)
			)
		}
	}
	return fmt
}
/**
 * 获取日期名
 * @param {*} date 
 */
export function getDayAlias(date) {
	let dayAlias = formatDate(date,'M月d日')
	dayAlias += (' 周'+ weekArr[date.getDay()])
	return dayAlias
}

export function transDay(dateStr) {
	let date = new Date(Date.parse(dateStr.replace(/-/g, '/')))
	let dayObj = {}
	dayObj.dayAli =formatDate(date,'M月d日')
	dayObj.week = (' 周'+ weekArr[date.getDay()])
	return dayObj
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length)
}
