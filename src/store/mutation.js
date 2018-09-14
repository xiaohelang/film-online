/* eslint-disable */
import * as types from './type'
const cancheInfo = {
    [types.SET_TEST](state, test2) {
        state.test = test2
    },
    [types.SET_NAME](state, name) {
        state.name = name
    },
    [types.SET_CURRENT_CINEMA](state, cinema) {
        state.currentCinema = cinema
    },
    [types.SET_CINEMA_LIST](state, cinemas) {
        state.cinemaList = cinemas
    }
}
export default cancheInfo
