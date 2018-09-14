import * as types from './type'

const testMutations = {
    [types.SET_TEST](state, test2) {
        state.test = test2
    },
    [types.SET_NAME](state, name) {
        state.name = name
    }
}
export default testMutations
