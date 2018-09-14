/* eslint-disable */
import getters from './getter.js'
const state = {
	cinemaInfo: {},
	userInfo: {}
}
const mutations = {
	setCinemaInfo: (state, cinemaInfo) => {
		state.cinemaInfo = cinemaInfo
	},
	setUserInfo: (state, userInfo) => {
		state.userInfo = userInfo
	}
}

export default {
	getters,
	state,
	mutations
}
