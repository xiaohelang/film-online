/* eslint-disable */
import axios from 'axios'
import { Indicator } from 'mint-ui'
axios.defaults.timeout = 180000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
// axios.defaults.baseURL = 'http://test.ai-datas.com'
// axios.defaults.baseURL = 'http://192.168.3.225:8108'
axios.defaults.baseURL = 'http://192.168.3.118'

let requestingCount = 0
function startLoading() {
    console.log('开始showloading')
    Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
    })
}
function stopLoading() {
    console.log('关闭showloading')
    Indicator.close();
}
const handleRequestLoading = () => {
    startLoading()
	// if (!requestingCount) {
	// 	startLoading()
	// 	requestingCount++
	// }
}
const handleResponseLoading = () => {
    stopLoading()
	// requestingCount--
	// if (!requestingCount) {
	// 	stopLoading()
	// }
}

axios.interceptors.request.use(
	config => {
		handleRequestLoading()
		return config
	},
	error => {
		handleRequestLoading()
		return Promise.reject(error)
	}
)

//  返回状态判断
axios.interceptors.response.use(
	res => {
		handleResponseLoading()
		return res
	},
	error => {
		handleResponseLoading()
		return Promise.reject(error)
	}
)

function fetch(url, params) {
    let userToken = sessionStorage.getItem('userToken')
    if(typeof(userToken) === 'undefined' || userToken== null ||  userToken ===''  ) {
		console.log('静态token')
	 }
	// userToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3N1ZXIiOiJhaSBkYXRhIG1lbWJlciBKV1QgSXNzdWVyIDAuMSIsImFwcElkIjoid3gwN2UwYTIyZGY0NzMxYWMzIiwiYXBwU2VjcmV0IjoiYTA5ZGZmY2M1MzM5ZGExNWEyMmFlZDJlNDJkNTY1ZDUiLCJhdXRoQ29kZSI6IjdmNjYxMWMyYWM4Yzk1OTA3ZjY2MTFjMmFjOGM5NTkwIiwiY29tcFVpZCI6ImY3M2NmY2VmLTllMzEtNDgxMi04NDMwLWUyODUwM2Q0ODQ3ZCIsIm9yZ1VpZCI6IjZlOWVhYTNiLTY0MjItNDBjZi1iODJiLTZmOGFkMjdhM2EzNSIsImNvbmZpZ0lkIjoxLCJtZW1iZXJJZCI6MTAyOTE5Njk5NDgzNDUwNTczMywic3ViIjoibzVOVEMxRkdmN2JwcXVVMTBTRUJOalE4bkhCVSIsImV4cCI6MTUzNjg5MTYwOH0.lrB-G_F_G-cpsi3YHyIIkyq9Irr7nJGtkDOPKm60KCKiabc1JhFoZw6AWINKltS0whM36XBqt-w618tYOaqXBg'
	// userToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3N1ZXIiOiJhaSBkYXRhIG1lbWJlciBKV1QgSXNzdWVyIDAuMSIsImFwcElkIjoid3gwN2UwYTIyZGY0NzMxYWMzIiwiYXBwU2VjcmV0IjoiYTA5ZGZmY2M1MzM5ZGExNWEyMmFlZDJlNDJkNTY1ZDUiLCJhdXRoQ29kZSI6IjdmNjYxMWMyYWM4Yzk1OTA3ZjY2MTFjMmFjOGM5NTkwIiwiY29tcFVpZCI6IiIsIm9yZ1VpZCI6IjkyMTg5NDdiLTZiZmMtNDA0ZC04YzQ3LWY5ODM4MmIxNjUwYyIsImNvbmZpZ0lkIjoxLCJtZW1iZXJJZCI6MTAyOTE5Njk5NDgzNDUwNTcyOCwic3ViIjoidDEzNjEwMDQxMzkwIiwiZXhwIjoxNTM2NzIwNTQ2fQ.JjhmcAAESMfDjy-OZB-qlnOEz_LUGULw3KEMCLFz8x2QEifhXXYDBmFGAqbYMbNn6bIE9fSWhgP0CiCsK3yi2A'
	userToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3N1ZXIiOiJhaSBkYXRhIG1lbWJlciBKV1QgSXNzdWVyIDAuMSIsImFwcElkIjoid3gwN2UwYTIyZGY0NzMxYWMzIiwiYXBwU2VjcmV0IjoiYTA5ZGZmY2M1MzM5ZGExNWEyMmFlZDJlNDJkNTY1ZDUiLCJhdXRoQ29kZSI6IjdmNjYxMWMyYWM4Yzk1OTA3ZjY2MTFjMmFjOGM5NTkwIiwiY29tcFVpZCI6IiIsIm9yZ1VpZCI6IjkyMTg5NDdiLTZiZmMtNDA0ZC04YzQ3LWY5ODM4MmIxNjUwYyIsImNvbmZpZ0lkIjoxLCJtZW1iZXJJZCI6MTAyOTE5Njk5NDgzNDUwNTczMywic3ViIjoidDEzNTQ0MzIzNzc0IiwiZXhwIjoxNTM2OTgxOTk1fQ.tjDoAnXD_vsS37YQ3bnw4mp6FK-dc5l72cqi5TiOndA5YtU5RynaERG7NULfKx6G6d-09uvYeGvH79wTKfz7OQ'
	let authCode = sessionStorage.getItem('authCode')
	if(typeof(authCode) === 'undefined' || authCode== null ||  authCode ===''  ) {
		params.authCode = '7f6611c2ac25848c95907f66'
		// params.authCode =  ''
	}else{
		params.authCode = authCode
	}
	params.authCode = '7f6611c2ac8c95907f6611c2ac8c9590'
    // if(window.localStorage.mytoken != undefined) {
    //     userToken = window.localStorage.mytoken  7f6611c2ac8c95907f6611c2ac8c9590
    // } 
    return new Promise((resolve, reject) => {
		// console.log('请求接口地址--->', url)
        axios.post(url, {data: params, head: {
            "questUID" : "1",
            "clientIP" : "192.168.103.56",
            "version" : "1.0.0",
            "userToken" : userToken
        }}).then(response => {
                if(response.data.status.status === 0) {
					console.log('成功返回结果--->', response.data) 
					resolve(response.data)
                } else {
					let errorMsg = {}
					errorMsg.code = response.data.status.status
					errorMsg.msg = response.data.status.msg2Dev
					console.log('请求成功，但返回错误结果--->', errorMsg) 
					reject(errorMsg)
                }
            }, err => {
				let errorMsg = {}
				errorMsg.code = err.code
				switch(err.code){
					case 'ECONNABORTED': 
					errorMsg.msg = '请求连接超时'
					break
					default: errorMsg.msg = '数据请求失败'
				}
				// console.log('接口错误--->', err)
				console.log('接口错误--->', errorMsg)
                reject(errorMsg)
            })
            .catch((error) => {
                console.log('捕捉到异常-->', error)
                reject(error)
            })
    })
}
/*
*请求地址
*/
const urlPath = {
	// 组件
	home_getComponent: {url:'/oms-api/component/v1/index',title:'首页组件'},
	home_getComponentContent: {url:'/oms-api/component/v1/detail',title:'获取指定组件对应的内容'},
	cinema_getCinemaInfoByCode: {url:'/oms-api/cinema/v1/getByCinemaCode',title:'根据影院编码查询影院资料'},
	// 影片
	film_getInfo: {url:'/oms-api/movie/v1/detail',title:'查询影片详情'},
	film_getPlanShow: {url:'/oms-api/movie/v1/planShow',title:'查询影片排期'},
	// 锁座，卖品
	planSeat_getInfo: {url:'/oms-api/seat/v1/getPlanShowSeat',title:'查询场次可销售座位'},
	planSeat_getPrice: {url:'/oms-api/seat/v1/getPlanShowPrice',title:'查询场次座位票类价格'},
	mer_getCategory: {url:'/oms-api/merchaise/v1/category',title:'查询卖品分类'},
	sms_send: {url:'/oms-api/sms/v1/send',title:' 短信发送'},
	// 订单
	order_lockSeat: {url:'/oms-api/order/v1/lockSeat',title:'锁座创建订单'},
	order_createMerOrder: {url:'/oms-api/order/v1/createMerOrder',title:'创建卖品订单'},
	order_appendOrder: {url:'/oms-api/order/v1/appendOrder',title:'追加订单'},
	order_deleteOrder: {url:'/oms-api/order/v1/deleteOrder',title:'取消订单'},
	order_queryUnsettleOrder: {url:'/oms-api/order/v1/queryUnsettledOrder',title:'查询未结算的订单'},
	order_queryOrderList: {url:'/oms-api/order/v1/queryOrderList',title:'查询订单列表'},
	order_queryOrderDetail: {url:'/oms-api/order/v1/queryOrderDetail',title:'根据订单ID查询订单'},
	// 会员
	member_bind: {url:'/oms-api/member/v1/bind',title:'会员绑定'},
	member_getInfo: {url:'/oms-api/member/v1/get',title:'获取会员资料'},
	member_getCards: {url:'/oms-api/member/v1/getCards',title:'获取会员卡'},
	member_setDefaultCard: { url: '/oms-api/member/v1/setDefaultCard', title: '设置默认卡' },
	member_bindMemberCard: { url:'/oms-api/member/v1/bindMemberCard',title:'绑定会员卡'},
	// 支付
	weixin_getConfig: {url:'/oms-api/wx/v1/getJsSign',title:'获取微信配置'},
	pay_memberCardPay: {url:'/oms-api/omspay/v1/card',title:'会员卡支付'},
	order_aliPayment: {url:'/oms-api/omspay/v1/aliPayH5',title:'支付宝支付'},
	pay_weiXinPay: {url:'/oms-api/omspay/v1/wxPayH5',title:'微信支付'},
	pay_getPayType: {url:'/oms-api/omspay/v1/getPayType',title:'获取支付方式'},
	//充值
	order_recharge: { url: '/oms-api/order/v1/rechargeOrder', title: '充值订单' },
	//扫码订餐查询卖品
	mer_QueryGoodsByScan: { url: '/oms-api/merchaise/v1/queryGoodsByScan', title: '扫码订餐查询卖品' },
}
const axiosHttp ={
	post(urlName,params){
        return fetch(urlPath[urlName].url, params)
    }
}

function axios_http_post(urlName,params) {
	return fetch(urlPath[urlName].url, params)
}

export default {
	install: function(Vue, name = '$http') {
		Object.defineProperty(Vue.prototype, name, { value: axiosHttp })
	}
}
export {
	axios_http_post
}