// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import '../src/assets/rem'
import './components/scss/reset.scss'
import store from './store'
import VConsole from 'vconsole/dist/vconsole.min.js'
// import { Swipe, SwipeItem } from 'vue-swipe'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import AxiosPlugin from './plugin/axiosRequest.js'
Vue.use(AxiosPlugin, '$axios');
import OmsCacheInfoPlugin from './plugin/omsCacheInfo.js'
Vue.use(OmsCacheInfoPlugin, '$omsCacheInfo')
// import { AlertPlugin, ToastPlugin, ConfirmPlugin } from 'vux'
import MintUI from 'mint-ui'
import { Toast, MessageBox } from 'mint-ui'
import 'mint-ui/lib/style.css'
import setTitle from './js/util.js'

// Vue.use(VueTouch)
window.setTitle = setTitle
Vue.use(VueAwesomeSwiper)
// 图片懒加载
Vue.use(VueLazyload, {
    loading: require('../static/image/default/goods-poster.png')
})
/* eslint-disable */
// let vConsole = new VConsole()

import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
Vue.use(AlloyFingerPlugin,{
  AlloyFinger
})

Vue.prototype.hlTest = {
    cinemaCode: ''
}
// if (window.sessionStorage.cinemaInfo) {
//     store.dispatch('setCinemaInfo', JSON.parse(window.sessionStorage.cinemaInfo));
// }
// if (window.sessionStorage.userInfo) {
//     store.dispatch('setUserInfo', JSON.parse(window.sessionStorage.userInfo));
// }
Vue.use(MintUI)
// Vue.use(Toast)
// Vue.use(Cell)
Vue.prototype.$hToast = function() {
    Toast({
        message: '操作成功',
        iconClass: 'icon icon-success no-cardIcon',
        position: 'bottom',
        duration: 5000
    })
}

Vue.prototype.$MessageAlert = function(msg, title) {
    MessageBox({
        title: title||'提示',
        message: msg,
        showCancelButton: false,
        showConfirmButton: true
    })
}
Vue.prototype.$alertCallBack = function(msg, cbFn) {
    MessageBox.alert(msg).then(action => {
        cbFn&&cbFn()
    })
}
Vue.prototype.$MessageConfirm = function(msg, title, resFn, errFn) {
    title = title || '提示'
    MessageBox.confirm(msg, title, false).then(action => {
        // 确定
        resFn&&resFn()
    }, err => {
        // 取消
        errFn&&errFn()
    })
}
Vue.prototype.$MsgConfirm = function(msg, resFn, errFn) {
    MessageBox.confirm(msg, '提示', false).then(action => {
        // 确定
        resFn&&resFn()
    }, err => {
        // 取消
        errFn&&errFn()
    })
}

Vue.prototype.$hToast = function() {
    Toast({
        message: '操作成功',
        iconClass: 'icon icon-success no-cardIcon',
        position: 'bottom',
        duration: 5000
    })
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    // components: { App },
    // template: '<App/>',
    render: h => h(App)
})
