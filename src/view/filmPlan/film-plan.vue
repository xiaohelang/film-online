<template>
    <div :class="$style.filmPlanall">
        <div :class="$style.filmTop">
            <span>当前影院：</span>
            <span>{{comp_cinema.cinemaName}}</span>
        </div>
        <div :class="$style.panel">
            <section :class="$style.content2" id="hh" :style="setBackground">
                <swiper ref="mySwiper" :options="swiperOption" :notNextTick="true">
                    <swiper-slide v-for="(item, index) in showImg" :key="index">
                        <img v-if="item.movieHomeIcon" @click="slideClick(item)" v-lazy="item.movieHomeIcon">
                        <img v-else src="../../../static/image/default/goods-poster.png" @click="slideClick(item)">
                    </swiper-slide>
                </swiper>
            </section>
            <div :class="$style.sliderTitle">
                <p>{{selectItem.movieName}}</p>
                <p>{{selectItem.during}}分钟 / {{selectItem.movieTag}}</p>
            </div>
        </div>
        <div :class="$style.phoneBox" @click="toBingPhone" v-if="needBindingPhone">
            <img src="../../../static/image/phone.png" alt="">
            <p>绑定手机号，购票更优惠</p>
            <img src="../../../static/image/arrow-right.png" alt="">
        </div>
        <div :class="$style.phoneBox" style="background:#E8EBFF;" v-if="selectItem.tips">
            <img src="../../../static/image/phone.png" alt="">
            <p style="color: #598CFF;">此影片涉及暴力场面，需家长陪同观看。</p>
            <img src="../../../static/image/arrow-right.png" alt="">
        </div>
        <div :class="$style.filmPlan" style="position: relative;">
            <div ref="dateSelect" :class="$style.dateSelect">
                <div :class="$style.date" ref="dateBox">
                    <p @click='planDateSelect(index,date)' :class="[$style.dateDay, {active : index === dateSelectActive}]" v-for="(date, index) in planShowDateList" :key="index">{{date | filterDate}}</p>
                </div>
            </div>
            <div :class="$style.filmBox">
                <div :class="$style.filmWrap">
                    <ul v-if="planShow.length !== 0" v-for="(item, index) in planShow" :key="index" :class="$style.filmLI">
                        <li>
                            <p>{{item.startShowDate|filterShowDate}}</p>
                            <p>{{item.endShowDate|filterShowDate}}散场</p>
                        </li>
                        <li>
                            <p>{{item.language}}／{{item.movieVersion}}</p>
                            <p>{{item.hallName}}</p>
                            <span v-show="item.showEffect" :class="$style.tipBox">
                                <span>{{item.showEffect|fliterShowEffect}}</span>
                                <span>{{item.showEffect|fliterShowEffect2}}</span>
                            </span>
                        </li>
                        <li>
                            <p>&yen;{{item.minPrice}}-&yen;{{item.maxPrice}}</p>
                        </li>
                        <li>
                            <Btn class="buyT" @upBtnClick="planClick(item)">选座</Btn>
                        </li>
                    </ul>
                </div>
            </div>
            <section v-if="planShow.length === 0" :class="$style.content" style="display: flex;flex-direction: column;align-items: center; background: #f6f6f6; padding-top: 0.48rem;">
                <img :class="$style.noFilmImg" src="/static/image/default/noFilm2.png" alt="">
                <span :class="$style.noFilmSpan">暂无放映场次</span>
            </section>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import Btn from '@/components/base/btn.vue'
import Product from './product.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    components: {
        Btn,
        Product,
        swiper,
        swiperSlide
    },
    data() {
        let self = this
        return {
            headBg: '../../../static/image/default/film-poster.png',
            comp_cinema: {},
            needBindingPhone: false,
            myIndex: 0,
            cinemaCode: '',
            movieCode: '',
            planShowDate: '',
            dateSel: '',
            planShow: [],
            planShowDateList: [],
            dateSelectActive: 0,
            options: {
                slidesPerView: 3.8,
                spaceBetween: 15,
                freeMode: true
            },
            activeImg: 0,
            selectItem: {},
            showImg: [],
            swiperOption: {
                slidesPerView: 4,
                notNextTick: true,
                centeredSlides: true,
                spaceBetween: 30,
                grabCursor: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                // mySwiper.slideTo(index, speed, runCallbacks)
                // 点击哪张
                slideToClickedSlide: true,
                on: {
                    // 切换到哪张
                    slideChangeTransitionEnd: function() {
                        console.log(this.activeIndex)
                        self.myIndex = this.activeIndex
                        console.log('监听到滚动到哪里了')
                        self.selectItem = self.showImg[this.activeIndex]
                    }
                }
            }
        }
    },
    created() {
        setTitle('影片排期')
        this.getCinemaInfo()
        var self = this
        self.cinemaCode = this.$route.query.cinemaCode
        self.movieCode = this.$route.query.movieCode
        self.planShowDate = ''
        self.getPlanShow(self.cinemaCode, self.movieCode, self.planShowDate)
        // this.$nextTick(() => {
        //     console.log('--====----')
        //     console.log(this.$refs.mySwiper)
        //     this.$refs.mySwiper.swiper.on('slideChange', function() {
        //         console.log('slide changed')
        //     })
        // })
        // this.swiper.slideTo(1, 500, false)
    },
    mounted() {
        // 可以使用swiper这个对象去使用swiper官网中的那些方法
        // this.$refs.mySwiper.swiper.slideTo(0, 500, true)
        let self = this
        this.$refs.mySwiper.swiper.on('slideChangeTransitionEnd', inde => {
            console.log('监听监听----')
            console.log(this.myIndex)
            self.dateSelectActive = 0
            self.movieCode = self.showImg[self.myIndex].movieCode
            self.planShowDate = ''
            self.getPlanShow(self.cinemaCode, self.movieCode, self.planShowDate)
        })
        this.selectItem = this.showImg[0]
    },
    computed: {
        setBackground() {
            return { background: 'url(' + this.headBg + ') 0 0 / 1000% 400%' }
        }
    },
    methods: {
        tabImg(index) {
            this.activeImg = index
        },
        slideClick(item) {
            console.log('slideClick-->')
            console.log(item)
            let self = this
            self.selectItem = item
            self.movieCode = self.selectItem.movieCode
            self.headBg = self.selectItem.movieHomeIcon
            self.getPlanShow(self.cinemaCode, self.movieCode, self.planShowDate)
        },
        // 点击日期查看排期
        planDateSelect(index, date) {
            console.log('planDateSelect-->')
            let self = this
            self.dateSelectActive = index
            self.dateSel = date
            self.planShowDate = date
            this.getPlanShow(self.cinemaCode, self.movieCode, self.planShowDate)
        },
        /**
         * 获取首页组件
         */
        getPlanShow(cinemaCode, movieCode, planShowDate) {
            let self = this
            let paramData = {}
            paramData.cinemaCode = cinemaCode
            paramData.movieCode = movieCode
            paramData.planShowDate = planShowDate
            console.log('getPlanShow--paramData-->', paramData)
            self.$axios.post('film_getPlanShow', paramData).then(
                res => {
                    console.log(res)
                    if (res.data) {
                        self.planShow = res.data.planShowDTOList
                        self.planShowDateList = res.data.planShowDateList
                        if (self.showImg.length === 0) {
                            self.showImg = res.data.movieList
                        }
                        self.showImg.map((item, index) => {
                            if (item.movieCode === self.movieCode) {
                                console.log('00000')
                                console.log(index)
                                self.$refs.mySwiper.swiper.slideTo(
                                    index,
                                    0,
                                    true
                                )
                                self.selectItem = self.showImg[index]
                                self.movieCode = self.selectItem.movieCode
                                self.headBg = self.selectItem.movieHomeIcon
                            }
                        })
                        self._initPic(self.planShowDateList.length)
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        _initPic(length) {
            let picWidth = 148
            let margin = 26
            let width = (picWidth + margin * 2) * length + 8
            this.$refs.dateBox.style.width = width / 100 + 'rem'
            if (!this.picScroll) {
                this.picScroll = new BScroll(this.$refs.dateSelect, {
                    scrollX: true,
                    click: true
                })
            } else {
                this.picScroll.refresh()
            }
        },
        // 选座场次，查看座位图
        planClick(plan) {
            let planParam = {}
            planParam.cinemaCode = this.cinemaCode
            planParam.planShowId = plan.planShowId
            this.$router.push({ path: '/buySeat', query: planParam })
        },
        // 获取影院信息
        getCinemaInfo() {
            let paramData = {}
            paramData.cinemaCode = this.$route.query.cinemaCode
            this.comp_cinema = this.$omsCacheInfo.getCinemaInfo(paramData)
        },
        // 获取手机是否绑定
        getPhone() {
            let self = this
            this.$axios.post('member_getInfo', {}).then(
                res => {
                    if (res.data.mobile == null || res.data.mobile === '') {
                        self.needBindingPhone = true
                    } else {
                        self.needBindingPhone = false
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 绑定手机
        toBingPhone() {
            let paramData = {}
            paramData.cinemaCode = this.$route.query.cinemaCode
            paramData.movieCode = this.$route.query.movieCode
            paramData.path = 'filmplan'
            this.$router.push({ path: '/login', query: paramData })
        }
    },
    filters: {
        // 设置日期
        filterDate(dates) {
            let monthDateArr = dates.split('-')
            let monthDate = monthDateArr[1] + '-' + monthDateArr[2]
            let showDay = [
                '周日',
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六'
            ]
            let date = new Date()
            let today = Date.parse(date)
            today = parseInt(today / (1000 * 24 * 60 * 60))
            let upDate = new Date(dates)
            let upDateStr = upDate / (1000 * 24 * 60 * 60)
            let week = showDay[new Date(dates).getDay()]
            if (upDateStr - today === 0) {
                week = '今天'
            } else if (upDateStr - today === 1) {
                week = '明天'
            } else if (upDateStr - today === 2) {
                week = '后天'
            }
            return week + ' ' + monthDate
        },
        filterShowDate(str) {
            let arr = str.split(' ')
            let arr2 = arr[1].split('-')
            let reStr = arr2.join(':')
            return reStr
        },
        fliterShowEffect(showEffect) {
            if (!showEffect) return
            let arr = showEffect.split(',')
            return arr[0]
        },
        fliterShowEffect2(showEffect) {
            let text = ''
            if (!showEffect) return
            let arr = showEffect.split(',')
            if (arr.length > 1) {
                text = arr[1]
            } else {
                text = ''
            }
            return text
        }
    }
}
</script>
<style lang="scss">
.swiper-wrapper {
    display: flex;
    align-items: center;
}
</style>
<style lang="scss" scoped>
@import 'swiper/dist/css/swiper.css';
.active {
    padding-bottom: 0;
    border-bottom: 6px solid#598CFF;
}

.buyT {
    background: linear-gradient(right bottom, #6f85ff, #54aaff) !important;
    background: -webkit-linear-gradient(
        right bottom,
        #6f85ff,
        #54aaff
    ) !important;
    background: -o-linear-gradient(right bottom, #6f85ff, #54aaff) !important;
    background: -moz-linear-gradient(right bottom, #6f85ff, #54aaff) !important;
}
.noFilmImg {
    display: block;
    width: 320px; // height: 320px;
}
.product-slider {
    .h5 {
        margin-top: 18px;
        margin-bottom: 18px;
        font-size: 32px;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        color: #4a4a4a;
    }
}
#hh {
    // box-sizing: border-box;
    // padding: 0 24px; // background: #fff;
    .swiper-container {
        width: 750px;
        height: 266px;
        align-items: center;
        display: flex;
        .swiper-wrapper {
            align-items: center;
            .swiper-slide {
                width: 132px;
                height: 198px;
                margin-left: 13px !important;
                margin-right: 13px !important;
                img {
                    width: 132px;
                    height: 198px;
                }
            }
            .swiper-slide-active {
                width: 188px !important;
                height: 284px !important;
                overflow: hidden;
                img {
                    width: 188px !important;
                    height: 284px !important;
                }
            }
        }
    }
}
</style>

<style lang="scss" module>
.filmPlanall {
    position: relative;
    // padding-top: 80px;
    .filmTop {
        width: 750px;
        height: 72px;
        line-height: 72px;
        font-size: 28px;
        text-align: left;
        padding-left: 32px;
        box-sizing: border-box;
    }
    .panel {
        .content2 {
            // padding-bottom: 40px;
            background-size: 300% 300%;
            position: relative;
            .scrollContainer {
                height: 266px;
                background: pink;
                overflow: hidden;
                width: 750px;
                .scrollBox {
                    white-space: nowrap;
                    height: 250px;
                    background: blue;
                    width: 750px;
                    img {
                        width: 132px;
                        height: 198px;
                        margin: 0 13px;
                    }
                }
            }
        }
        .sliderTitle {
            height: 80px;
            margin-top: 5px;
            & p:nth-child(1) {
                font-size: 34px;
                color: #262628;
                line-height: 40px;
            }
            & p:nth-child(2) {
                font-size: 24px;
                color: #7a797b;
                line-height: 40px;
            }
        }
    }
    .phoneBox {
        width: 750px;
        height: 80px;
        background: rgba(255, 242, 241, 1);
        display: flex;
        padding: 0 34px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        img {
            height: 32px;
        }
        p {
            font-size: 28px;
            color: #f43933;
            width: 600px;
            text-align: left;
        }
    }
    .filmPlan {
        .dateSelect {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            z-index: 1;
            background: #fff;
            border-bottom: 1px solid rgba(223, 223, 223, 1);
            line-height: 80px;
            width: 750px;
            overflow: hidden;
            .date {
                white-space: nowrap;
                padding: 0 4px;
                height: 80px;
                box-sizing: border-box;
                .dateDay {
                    padding-bottom: 2px;
                    display: inline-block;
                    width: 148px;
                    height: 72px;
                    margin: 0 26px;
                    margin-left: 15px;
                    text-align: center;
                    color: #7a797b;
                    font-size: 28px;
                    // padding-bottom: 2px;
                    &.active {
                        color: blue;
                        padding-bottom: 0;
                        border-bottom: 6px solid blue;
                    }
                }
            }
        }
        .filmBox {
            width: 750px;
            overflow: hidden;
            padding-left: 30px;
            box-sizing: border-box;
            background: #fff;
            padding-top: 80px;
            .filmWrap {
                width: 720px;
                .filmLI {
                    display: flex;
                    height: 136px;
                    align-items: center;
                    color: #7a797b;
                    border-bottom: 1px solid rgba(223, 223, 223, 1);
                    & li:nth-child(1) {
                        width: 186px;
                        font-size: 24px;
                        & p:nth-child(1) {
                            color: #7a797b;
                            font-size: 40px;
                            margin-bottom: 10px;
                        }
                    }
                    & li:nth-child(2) {
                        width: 220px;
                        font-size: 24px;
                        & p:nth-child(1) {
                            color: #262628;
                            font-size: 28px;
                            margin-bottom: 10px;
                        }
                        .tipBox {
                            margin-left: 10px;
                            overflow: hidden;
                            font-size: 20px;
                            border-radius: 8px;
                            display: inline-block;
                            border: 1px solid #9da9dc;
                            & span:nth-child(1) {
                                padding: 4px;
                                color: #fff;
                                display: inline-block;
                                background: linear-gradient(
                                    -128.9deg,
                                    rgba(184, 198, 255, 1),
                                    rgba(154, 166, 216, 1)
                                );
                            }
                            & span:nth-child(2) {
                                padding: 5px;
                                background: #fff;
                                color: #9da9dc;
                                display: inline-block;
                            }
                        }
                    }
                    & li:nth-child(3) {
                        width: 182px;
                        p {
                            font-size: 28px;
                            color: #f43933;
                        }
                    }
                    & li:nth-child(4) {
                        width: 140px;
                    }
                }
            }
        }
        .noFilmImg {
            display: block;
            width: 320px;
            // height: 320px;
        }
        .noFilmSpan {
            display: flex;
            color: #7a797b;
            font-size: 32px;
            margin-top: 20px;
            justify-content: space-between;
        }
    }
}
</style>
