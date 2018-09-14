/* eslint-disable */
/**
 * 电商缓存信息
 */
// import {axios_http_post} from './axiosRequest.js'
var paxiosRequest = require('./axiosRequest.js')
const omsCacheInfo = {
	setCinemaInfo(paramData) {
		_setCinemaInfo(paramData)
	},
	getCinemaInfo(paramData) {
		return _getCinemaInfo(paramData)
	},
	setCinemaList(paramData) {
		_setCinemaList(paramData)
	},
	getCinemaList(paramData) {
		return _getCinemaList(paramData)
	}
}
/**
 * 设置当前影院信息
 */
function _setCinemaInfo(paramData) {
	sessionStorage.setItem('currentCinema', JSON.stringify(paramData))
}
/**
 * 获取当前影院信息
 * @param {} paramData  参数
 * @param {*} callBack 	回调函数
 */
function _getCinemaInfo(paramData) {
	let currentCinemaStr = sessionStorage.getItem('currentCinema')
	if (currentCinemaStr) {
		return JSON.parse(currentCinemaStr)
	} else {
		console.log('接口获取当前影院信息')
		let cinemaListStr = sessionStorage.getItem('cinemaList')
		let cinema = {}
		if (cinemaListStr) {
			let cinemas = JSON.parse(cinemaListStr)
			for (let i in cinemas) {
				let cinemaList = cinemas[i].cinemaList
				for (let j in cinemaList) {
					if (cinemaList[j].cinemaCode === paramData.cinemaCode) {
						cinema = cinemaList[j]
						cinema.cityName = cinemas[i].cityName
						break
					}
				}
			}
		}
		return cinema
	}
}

/**
 * 设置影院列表信息
 */
function _setCinemaList(paramData) {
	sessionStorage.setItem('cinemaList', JSON.stringify(paramData))
}

/**
 * 获取影院列表信息
 * @param {} paramData  参数
 * @param {*} callBack 	回调函数
 */
function _getCinemaList(paramData) {
	let cinemaListStr = sessionStorage.getItem('cinemaList')
	if (cinemaListStr) {
		return JSON.parse(cinemaListStr)
	} else {
		// console.log('接口获取影院列表信息')
		// paxiosRequest.axios_http_post('home_getComponentContent', paramData).then(
		// 	res => {
		// 		callBack(res)
		// 	},
		// 	err => {
		// 		callBack(err)
		// 	}
		// )
		return null
	}
}
export default {
	install: function(Vue, name = '$omsCacheInfo') {
		Object.defineProperty(Vue.prototype, name, { value: omsCacheInfo })
	}
}
