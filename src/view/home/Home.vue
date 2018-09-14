<template>
    <div :class="$style.home">
        <HeadCinema :currentCinema='comp_cinema' @upOpenCinemaSelector='openCinemaSelector'></HeadCinema>
        <swiper :class="$style.bannerSlider" :options="options" :not-next-tick="options.notNextTick">
            <swiper-slide :class="$style.bannerSliderItem" v-for="item in comp_banner" :key="item.bannerIcon">
                <section @click="sliderClick(item)">
                    <img :class="$style.img" v-if="item.bannerIcon" :src="item.bannerIcon" alt="">
                    <img :class="$style.img" v-else src="static/image/default/banner.png" alt="">
                </section>
            </swiper-slide>
            <div class="swiper-pagination" v-if="options.pagination" slot="pagination" />
        </swiper>
        <!-- <BannerSlider :items="comp_banner" :cname="$style.bannerSlider" :transPropertiy="bannerTransPropertiy" @upSliderClick="bannerClick"></BannerSlider> -->
        <FuncArea :currentCinema='comp_cinema' :items="comp_btn" :waitingOrderCount="waitingOrderCount" @upFuncBtnClick="funcBtnClick"></FuncArea>
        <FilmHot v-if="filmShow" :currentCinema='comp_cinema' :items="comp_hotFilm" :class="$style.product"></FilmHot>
        <FilmComing :currentCinema='comp_cinema' :items="comp_comingFilm"></FilmComing>
        <MerSale v-if="merShow" :currentCinema='comp_cinema' :items="comp_merInfo"></MerSale>
        <navbar :currentCinema='comp_cinema' :navData='navData' :class="$style.homeNav" @upNavClick="navClick"></navbar>
        <transition name='slideDown'>
            <SelectCinema ref='SelectCinema' :currentCinema='comp_cinema' :cinemaList='comp_cinemaList' :selector='isSelector' @upCloseCinemaSelector="closeCinemaSelector"></SelectCinema>
        </transition>
    </div>
</template>

<script>
import HeadCinema from '@/components/common/head-cinema.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import BannerSlider from '@/components/base/slider.vue'
import FuncArea from './func-area.vue'
import FilmHot from './film-hot.vue'
import FilmComing from './film-coming.vue'
import MerSale from './mer-sale.vue'
import navbar from '@/components/base/navbar.vue'
import SelectCinema from '@/components/common/selectCinema.vue'
import wx from 'weixin-js-sdk'
// import Vue from 'vue'
import { mapMutations } from 'vuex'
// import {cancheInfo} from 'vuex'
export default {
    data() {
        return {
            options: {
                autoplay: true,
                loop: true,
                pagination: {
                    el: '.swiper-pagination'
                },
                notNextTick: false
            },
            isSelector: false, // 是否开始条件筛选
            waitingOrderCount: 0, // 是否开始条件筛选
            aiComponent: [],
            filmShow: false,
            merShow: false,
            comp_cinema: {
                // cinemaAddress: '广州市新塘镇汇创国贸大厦',
                // cinemaCode: '20180001',
                // cinemaName: '测试影院',
                // count: 1
            },
            comp_cinemaList: [
                // {
                //     cityName: '12',
                //     cinemaList: [
                //         {
                //             cinemaCode: '20180001',
                //             cinemaName: '电脑上',
                //             cinemaAddress: '广州市新塘镇汇创国贸大厦'
                //         }
                //     ]
                // }
            ],
            comp_banner: [],
            bannerTransPropertiy: {
                imageSrc: 'bannerIcon',
                jumpHref: 'jumpUrl'
            },
            comp_btn: [
                {
                    href: '/memberCode',
                    img: 'static/image/funcArea-icon/memberCode.png',
                    title: '会员码',
                    isTip: false
                },
                {
                    href: 'scanCode',
                    img: 'static/image/funcArea-icon/scanCode.png',
                    title: '扫一扫',
                    isTip: false
                },
                {
                    href: '/orderList',
                    img: 'static/image/funcArea-icon/waitGoods.png',
                    title: '待取货',
                    isTip: true
                },
                {
                    href: '/orderList',
                    img: 'static/image/funcArea-icon/myBill.png',
                    title: '我的订单',
                    isTip: false
                }
            ],
            comp_hotFilm: [
                // {
                //     movieCode: '123456',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: '',
                //     movieName: '海贼王',
                //     publicDate: '2018-06-06',
                //     href: 'home'
                // }
            ],
            comp_comingFilm: [
                // {
                //     movieCode: '海贼王大结局',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: 'http://i.xcby888.com/10047',
                //     movieName: '海贼王',
                //     publicDate: '2018-06-06',
                //     href: 'home',
                //     src: '../../static/image/default/film-poster.png'
                // },
                // {
                //     movieCode: '011',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: 'http://i.xcby888.com/10047',
                //     movieName: '外太空',
                //     publicDate: '2018-06-06',
                //     href: 'home',
                //     src: '../../static/image/default/film-poster.png'
                // }
            ],
            comp_merInfo: [
                // {
                //     componentId: '10',
                //     merIcon:
                //         'http://img14.360buyimg.com/n0/jfs/t5857/135/6971564543/1849727/bd1f4e6/596d67a1Ncbfb6a25.jpg',
                //     merName: '爆米花',
                //     merDesc: '爆米花',
                //     originalPrice: 12,
                //     discountPrice: 10
                // },
                // {
                //     componentId: '1004610415302414336',
                //     merIcon: null,
                //     merName: '65161',
                //     merDesc: '65161',
                //     originalPrice: 4,
                //     discountPrice: 4
                // }
            ],
            navData: [
                {
                    href: '/home',
                    imgSrc: '../../static/image/nav-icon/homeSeleted.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/homeSeleted.png',
                    navName: '首页',
                    isSelector: true
                },
                {
                    href: '/movie',
                    imgSrc: '../../static/image/nav-icon/film.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/filmSeleted.png',
                    navName: '电影',
                    isSelector: false
                },
                {
                    href: '/shop',
                    imgSrc: '../../static/image/nav-icon/shoppingMall.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/shoppingMallSeleted.png',
                    navName: '商城',
                    isSelector: false
                },
                {
                    href: '/me',
                    imgSrc: '../../static/image/nav-icon/my.png',
                    selectedImgSrc: '../../static/image/nav-icon/mySeleted.png',
                    navName: '我的',
                    isSelector: false
                }
            ]
        }
    },
    created() {
        setTitle('首页')
        let userToken = this.getQueryString('userToken')
        if (userToken) {
            console.log('userToken-->', userToken)
            sessionStorage.setItem('userToken', userToken)
        }
        let authCode = this.getQueryString('authCode')
        if (authCode) {
            console.log('authCode-->', authCode)
            sessionStorage.setItem('authCode', authCode)
        }
        this.home_component()
        this.queryOrderList()
    },
    methods: {
        ...mapMutations({
            setCurrentCinema: 'SET_CURRENT_CINEMA'
        }),
        /**
         * 获取首页组件
         */
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            } else {
                return null
            }
        },
        home_component() {
            // console.log('getCurrentCinema--->', this.getCurrentCinema())
            let paramData = {}
            let cinemaCode = this.comp_cinema.cinemaCode
            if (cinemaCode) {
                paramData.cinemaCode = cinemaCode
            }
            let self = this
            self.$axios.post('home_getComponent', paramData).then(
                res => {
                    console.log(res)
                    self.aiComponent = res.data.componentList
                    self.comp_cinema = res.data.indexCinema
                    self.$omsCacheInfo.setCinemaInfo(res.data.indexCinema)
                    self.home_component_content()
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
            let paramData2 = {}
            paramData2.displayStyle = 2
            self.$axios.post('home_getComponentContent', paramData2).then(
                res => {
                    self.comp_cinemaList = res.data
                    self.$omsCacheInfo.setCinemaList(self.comp_cinemaList)
                    // for (let item of self.comp_cinemaList) {
                    //     if (item.cityName === self.comp_cinema.cityName) {
                    //         item.isChecked = true
                    //     } else {
                    //         item.isChecked = false
                    //     }
                    // }
                },
                err => {
                    self.comp_cinemaList = {}
                    self.$omsCacheInfo.setCinemaList('')
                    console.log(err)
                }
            )
        },
        /**
         * 获取首页内容组件
         *  displayStyle: 2, "影院切换"
         *  displayStyle: 3, "Banner"
         *  displayStyle: 4, "4宫格"
         *  displayStyle: 5, "正在热映"
         *  displayStyle: 6,"即将上映"
         *  displayStyle: 7,"卖品商城"
         */
        home_component_content() {
            let self = this
            let componnetList = self.aiComponent
            for (let key in componnetList) {
                ;(function(key1) {
                    if (
                        componnetList[key1].displayStyle === 4 ||
                        componnetList[key1].displayStyle === 2
                    ) {
                        // 不请求接口，默认功能图标
                        return
                    }
                    let paramData = {}
                    paramData.cinemaCode = self.comp_cinema.cinemaCode
                    paramData.displayStyle = componnetList[key1].displayStyle
                    self.$axios
                        .post('home_getComponentContent', paramData)
                        .then(
                            res => {
                                console.log(
                                    paramData.displayStyle,
                                    ',组件内容返回结果',
                                    res
                                )
                                if (paramData.displayStyle === 3) {
                                    if (res.data && res.data.length > 0) {
                                        // 没有返回数据时，默认一张图
                                        self.comp_banner = res.data
                                    } else {
                                        self.comp_banner = [
                                            {
                                                bannerIcon:
                                                    '../../static/image/default/banner.png'
                                            }
                                        ]
                                    }
                                } else if (paramData.displayStyle === 5) {
                                    self.filmShow = true
                                    self.comp_hotFilm = res.data
                                } else if (paramData.displayStyle === 6) {
                                    let comingFilm = []
                                    for (let i in res.data) {
                                        comingFilm = comingFilm.concat(
                                            res.data[i].movieList
                                        )
                                    }
                                    self.comp_comingFilm = comingFilm
                                } else if (paramData.displayStyle === 7) {
                                    self.merShow = true
                                    self.comp_merInfo = res.data
                                }
                            },
                            err => {
                                console.log('失败')
                                console.log(err)
                                self.$MessageAlert(err.msg)
                            }
                        )
                })(key)
            }
        },
        openCinemaSelector() {
            // console.log('selectCinemaClick', currentCinema)
            // this.$router.push({ path: '/cinema', query: currentCinema })
            // debugger
            // let self = this
            // self.comp_cinemaList.forEach(item => {
            //     if (self.comp_cinema.cityName.indexOf(item.cityName) === -1) {
            //         item.isChecked = false
            //     } else {
            //         item.isChecked = true
            //     }
            // })
            this.isSelector = true
        },
        closeCinemaSelector(selectedCinema) {
            this.isSelector = false
            if (selectedCinema) {
                console.log('选中的影院', selectedCinema)
                this.comp_cinema = selectedCinema
                this.home_component()
            }
        },

        // banner广告点击事件
        bannerClick(currentBanner) {
            console.log('bannerClick', currentBanner)
            let bannerHref = currentBanner.href
            if (bannerHref) {
                this.$router.push(bannerHref)
            }
        },
        // 菜单功能点击事件
        funcBtnClick(funcSelected) {
            console.log('funcBtnClick', funcSelected)
            if (funcSelected.href === 'scanCode') {
                console.log('使用微信jsdk扫描二维码')
                this.weixinConfig()
            } else {
                let param = {}
                if (funcSelected.title === '待取货') {
                    param.orderStatus = 2
                }
                if (funcSelected.title === '我的订单') {
                    param.orderStatus = 3
                }
                param.cinemaCode = this.comp_cinema.cinemaCode
                this.$router.push({
                    path: funcSelected.href,
                    query: param
                })
            }
        },
        weixinConfig() {
            let self = this
            let cinemaCode = this.comp_cinema.cinemaCode
            let url = encodeURIComponent(location.href.split('#')[0])
            let paramData = { cinemaCode: cinemaCode, url: url }
            console.log('paramData-->', paramData)
            self.$axios.post('weixin_getConfig', paramData).then(
                res => {
                    console.log(res)
                    wx.config({
                        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        debug: false,
                        // 必填，公众号的唯一标识
                        appId: res.data.appId,
                        // 必填，生成签名的时间戳
                        timestamp: res.data.timestamp,
                        // 必填，生成签名的随机串
                        nonceStr: res.data.noncestr,
                        // 必填，签名
                        signature: res.data.signature,
                        // 必填，需要使用的JS接口列表，所有JS接口列表
                        jsApiList: ['checkJsApi', 'scanQRCode']
                    })
                    wx.ready(function() {
                        self.weixinScan()
                    })
                    wx.error(function(res) {
                        // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                        // alert('出错啦：' + res.errMsg)
                        console.log('wxConfig出错', res)
                        self.$MessageAlert('wxConfig出错:' + res.errMsg)
                    })
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert('jssdk请求出错:' + err.msg)
                }
            )
        },
        weixinScan() {
            let self = this
            wx.ready(function() {
                wx.checkJsApi({
                    jsApiList: ['scanQRCode'],
                    success: function(res) {
                        wx.scanQRCode({
                            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                            success: function(res) {
                                console.log('扫描结果-->', res) // 当needResult 为 1 时，扫码返回的结果
                                let result = res.resultStr
                                if (result && result.indexOf(',')) {
                                    let resultArr = result.split(',')
                                    if (resultArr[1]) {
                                        result = resultArr[1]
                                    } else {
                                        result = resultArr[0]
                                    }
                                }
                                self.$MessageAlert(result)
                            }
                        })
                    }
                })
            })
        },
        navClick(nav) {
            let paramData = {}
            paramData.cinemaCode = this.comp_cinema.cinemaCode
            if (nav.href === '/movie') {
                paramData.clickType = 0
            }
            this.$router.push({
                path: nav.href,
                query: paramData
            })
        },
        queryOrderList() {
            let self = this
            let paramData = {}
            paramData.orderStatus = 2 // 待取货
            self.$axios.post('order_queryOrderList', paramData).then(
                res => {
                    console.log('成功。。。')
                    console.log('--->', res)
                    if (res.data && res.data.length > 0) {
                        self.waitingOrderCount = res.data.length
                    }
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    // self.$MessageAlert(err.msg)
                }
            )
        }
    },
    components: {
        HeadCinema,
        swiper,
        swiperSlide,
        BannerSlider,
        FuncArea,
        FilmHot,
        FilmComing,
        MerSale,
        navbar,
        SelectCinema
    }
}
</script>

<style lang="scss" module>
@import '../../components/scss/element.scss';
// @import 'vue-swipe/dist/vue-swipe.css';

.home {
    margin-bottom: 130px;
    background: #f5f5f5;
}
.homeNav {
    margin: 0 !important;
}
h1 {
    font-size: 0.3rem;
}
.hl {
    // @include btn(linear-gradient(right bottom, #ff6354, #e8332f));
    background: linear-gradient(right bottom, #ff6354, #e8332f) !important;
}
.hl2 {
    width: 110px !important;
    height: 48px !important;
    border-radius: 8px !important;
    line-height: 48px !important;
    font-size: 24px !important;
}

p {
    color: 0.5rem;
}

.bannerSlider {
    .bannerSliderItem {
        width: 750px !important;
        .img {
            width: 100% !important;
            height: 300px !important;
            object-fit: cover;
        }
    }
    // .swiper-slide-active {
    // }
}
.slideDown-enter-active,
.slideDown-leave-active {
    transition: transform 0.2s ease-out;
}
.slideDown-enter,
.slideDown-leave-active {
    transform: translate3d(0, -100%, 0);
}
</style>
