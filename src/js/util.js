/* eslint-disable */
/* 判断是否为微信浏览器 */
export function isWeiXin(fnTrue, fnFalse) {
	let ua = window.navigator.userAgent.toLowerCase()
	let ts = /micromessenger/i
	//        if (ua.test(/MicroMessenger/i) === 'micromessenger') {
	if (ts.test(ua)) {
		fnTrue && fnTrue()
	} else {
		fnFalse && fnFalse()
	}
}
/**
 *
 * @param {*} title
 */
export default function setTitle(title) {
	document.title = title
	let userAgent = window.navigator.userAgent.toLowerCase()
	let isiOS = userAgent.indexOf('applewebkit') >= 0
	let isWechat = userAgent.indexOf('micromessenger') >= 0
	if (isiOS && isWechat) {
		let iframe = document.createElement('iframe')
		// iframe.src = 'https://www.baidu.com/favicon.ico'
		iframe.style.display = 'none'
		document.body.appendChild(iframe)
		iframe.onload = function() {
			setTimeout(function() {
				iframe.remove()
			}, 0)
		}
	}
}
