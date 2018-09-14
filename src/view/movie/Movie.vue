<template>
    <div class="movie">
        <HeadCinema :currentCinema='comp_cinema' @upOpenCinemaSelector='openCinemaSelector'></HeadCinema>
        <ul class="tab">
            <li @click="tabBtn(index);selectIndex=index" v-for="(item, index) in tabData" :key="index" v-bind:class="{ 'select2': selectIndex == index }">{{item.tabTitle}}</li>
        </ul>
        <div v-if="isSelected" class="boxSelect">
            <dl class="boxSelectDl" v-for="(item, index) in comp_filmHot" :key="index">
                <dt>
                    <img v-if="item.movieHomeIcon" :src="item.movieHomeIcon" alt="">
                    <img v-else :src="transPropertiy.defualtImageSrc" alt="">
                </dt>
                <dd>
                    <p class="sellTitle">{{item.movieName}}
                        <span class="tipBox">
                            <span>{{item.movieEffects}}</span>
                        </span>
                    </p>
                    <div class="subSellTitle">
                        <div>
                            <p>导演：{{item.actorList|directorFilter}}</p>
                            <p v-if="isSelected" class="titleP1">主演：{{item.actorList|actorsFilter}}</p>
                        </div>
                        <div v-if="isSelected">
                            <Btn @upBtnClick='filmClick(item)' class="buy">购买</Btn>
                        </div>
                    </div>
                </dd>
            </dl>
            <section v-if="comp_filmHot.length === 0" class="content" style="display: flex;flex-direction: column;align-items: center; padding-top: 0.48rem;">
                <img class="noFilmImg" src="/static/image/default/noFilm2.png" alt="">
                <!-- <span class="noFilmSpan">暂无放映场次</span> -->
            </section>
        </div>
        <div v-else class="boxSelect">
            <div class="boxSelectDl" v-for="(items, index) in comp_filmComing" :key="index">
                <div class="dateList">{{items.showDate|filterDate}}</div>
                <dl v-for="(item, index) in items.movieList" :key="index">
                    <dt>
                        <img v-if="item.movieHomeIcon" :src="item.movieHomeIcon" alt="">
                        <img v-else :src="transPropertiy.defualtImageSrc" alt="">
                    </dt>
                    <dd>
                        <p class="sellTitle">{{item.movieName}}
                            <span class="tipBox">
                                <span>{{item.movieEffects}}</span>
                            </span>
                        </p>
                        <div class="subSellTitle">
                            <div>
                                <p>{{item.movieTag}}</p>
                                <p @click="toSell" class="titleP2">主演：{{item.actorList|actorsFilter}} </p>
                                <p>{{item.publicDate}}上映</p>
                            </div>
                        </div>
                    </dd>
                </dl>
            </div>
            <section v-if="comp_filmComing.length === 0" class="content" style="display: flex;flex-direction: column;align-items: center; padding-top: 0.48rem;">
                <img class="noFilmImg" src="/static/image/default/noFilm2.png" alt="">
                <!-- <span class="noFilmSpan">暂无放映场次</span> -->
            </section>
        </div>
        <!-- <div style="height: 1rem; background-color:transparent!important; "></div> -->
        <!-- <AiCell @upFilmPlanClick='filmPlanClick' :isSelected='isSelected' /> -->
        <navbar :navData='navData' @upNavClick="navClick"></navbar>
        <transition name='slideDown'>
            <SelectCinema ref='SelectCinema' :currentCinema='comp_cinema' :cinemaList='comp_cinemaList' :selector='isSelector' @upCloseCinemaSelector="closeCinemaSelector"></SelectCinema>
        </transition>
    </div>
</template>

<script>
import HeadCinema from '@/components/common/head-cinema.vue'
import Btn from '@/components/base/btn.vue'
import Navbar from '@/components/base/navbar.vue'
import SelectCinema from '@/components/common/selectCinema.vue'
import { getDayAlias } from '@/js/dateUtils.js'
// import * as util from '../../js/util.js'
// import { mapGetters } from 'vuex'
// import AiCell from '@/components/common/ai-cell.vue'
export default {
    data() {
        return {
            isSelector: false, // 是否切换影院
            isSelected: true,
            tabData: [
                {
                    isSelect: true,
                    tabTitle: '正在热映'
                },
                {
                    isSelect: false,
                    tabTitle: '即将上映'
                }
            ],
            transPropertiy: {
                imageSrc: 'movieHomeIcon',
                jumpHref: 'href',
                defualtImageSrc: 'static/image/default/film-poster.png'
            },
            comp_cinema: {
                // cinemaAddress: '广州市新塘镇汇创国贸大厦',
                // cinemaCode: '20180001',
                // cinemaName: '测试影院',
                // count: 1
            },
            comp_cinemaList: [
                // {
                //     cityName: '广州',
                //     cinemaList: [
                //         {
                //             cinemaCode: '20180001',
                //             cinemaName: '电脑上',
                //             cinemaAddress: '广州市新塘镇汇创国贸大厦'
                //         }
                //     ]
                // }
            ],
            comp_filmHot: [
                // {
                //     movieCode: '123456',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: 'http://i.xcby888.com/10047',
                //     movieName: '海贼王',
                //     publicDate: '2018-06-06'
                // }
            ],
            comp_filmComing: [
                // {
                //     movieCode: '海贼王大结局',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: 'http://i.xcby888.com/10047',
                //     movieName: '海贼王',
                //     publicDate: '2018-06-06'
                // },
                // {
                //     movieCode: '011',
                //     movieEffects: 'IMAX',
                //     movieHomeIcon: 'http://i.xcby888.com/10047',
                //     movieName: '外太空',
                //     publicDate: '2018-06-06'
                // }
            ],
            selectIndex: 0,
            navData: [
                {
                    href: '/home',
                    imgSrc: '../../static/image/nav-icon/home.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/homeSeleted.png',
                    navName: '首页',
                    isSelector: false
                },
                {
                    href: '/movie',
                    imgSrc: '../../static/image/nav-icon/filmSeleted.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/filmSeleted.png',
                    navName: '电影',
                    isSelector: true
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
        setTitle('电影')
        let clickType = this.$route.query.clickType
        this.tabBtn(clickType)
        this.getCinemaInfo()
        this.getCinemaList()
        this.getFilmHotData()
        this.getFilmComingData()
    },
    methods: {
        toSell() {
            let self = this
            let paramData = {cinemaCode: self.$route.query.cinemaCode}
            this.$router.push({
                path: '/sell',
                query: paramData
            })
        },
        navClick(nav) {
            let paramData = {}
            paramData.cinemaCode = this.$omsCacheInfo.getCinemaInfo().cinemaCode
            if (nav.href === '/movie') {
                paramData.clickType = 0
            }
            this.$router.push({
                path: nav.href,
                query: paramData
            })
        },
        tabBtn(index) {
            if (index === 0 || index === '0') {
                this.isSelected = true
                this.selectIndex = 0
            } else {
                this.isSelected = false
                this.selectIndex = 1
            }
            console.log(index)
            console.log(this.isSelected)
        },
        // 获取影院信息
        getCinemaInfo() {
            let self = this
            let paramData1 = {
                cinemaCode: this.$route.query.cinemaCode
            }
            self.comp_cinema = self.$omsCacheInfo.getCinemaInfo(paramData1)
        },
        // 获取影院列表信息
        getCinemaList() {
            let self = this
            let paramData2 = {
                displayStyle: 2
            }
            self.comp_cinemaList = self.$omsCacheInfo.getCinemaList(paramData2)
        },
        getFilmHotData() {
            let self = this
            let paramData = {}
            paramData.cinemaCode = self.comp_cinema.cinemaCode
            paramData.displayStyle = 5
            self.$axios.post('home_getComponentContent', paramData).then(
                res => {
                    console.log(res)
                    self.comp_filmHot = res.data
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                }
            )
        },
        getFilmComingData() {
            let self = this
            let paramData = {}
            paramData.cinemaCode = self.comp_cinema.cinemaCode
            paramData.displayStyle = 6
            self.$axios.post('home_getComponentContent', paramData).then(
                res => {
                    console.log(res)
                    self.comp_filmComing = res.data
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                }
            )
        },
        filmClick(film) {
            console.log('filmClick购票按钮', film)
            let filmParam = {}
            filmParam.cinemaCode = this.$route.query.cinemaCode
            filmParam.movieCode = film.movieCode
            this.$router.push({ path: '/filmplan', query: filmParam })
        },
        /**
         * 选择影院
         */
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
                this.getFilmHotData()
                this.getFilmComingData()
            }
        }
    },
    filters: {
        directorFilter(actorList) {
            let director = '不详'
            if (actorList) {
                // for(let i in actorList) {
                //     actorList.
                // }
            }
            return director
        },
        actorsFilter(actorList) {
            let actors = '不详'
            return actors
        },
        filterDate(longDate) {
            return getDayAlias(new Date(longDate))
        }
    },
    components: {
        HeadCinema,
        // AiCell,
        Btn,
        Navbar,
        SelectCinema
    }
}
</script>

<style lang="scss">
.noFilmImg {
    display: block;
    width: 320px;
    // height: 320px;
}
.movie {
    background: #fff;
    height: 100%;
    .tab {
        display: flex;
        justify-content: space-around;
        background: #fff;
        align-items: center;
        color: #598cff;
        font-size: 32px;
        width: 100%;
        height: 78px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(237, 237, 237, 1);
        li {
            height: 70px;
            line-height: 68px;
            margin-bottom: 0;
            color: #7a797b;
            border-bottom: 6px solid#fff;
        }
    }
}
.boxSelect {
    margin-bottom: 100px;
    .boxSelectDl {
        position: relative;
        &:after {
            content: ' ';
            width: 680px;
            height: 1px;
            display: block;
            position: absolute;
            bottom: 0;
            left: 35px;
            border-bottom: 1px solid #dfdfdf;
        }
    }
}
.select2 {
    border-bottom: 6px solid #598cff !important;
    color: #598cff !important;
}
// .panel {
//     @include panel;
// }
.dateList {
    text-align: left;
    font-size: 32px;
    color: #4a4a4a;
    background: #fff;
    height: 60px;
    line-height: 44px;
    padding-top: 20px;
    // margin-top: 20px;
    padding-left: 32px;
    box-sizing: border-box;
}
dl {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 20px 32px !important;
    dt > img {
        width: 180px;
        height: 180px;
        object-fit: cover;
    }
    dd {
        width: 480px;
        margin-left: 16px;
        display: flex;
        // justify-content: space-between;
        flex-direction: column;
        .sellTitle {
            color: #262628;
            font-weight: 550;
            font-size: 34px;
            text-align: left;
            margin-top: 5px;
            display: flex;
            align-items: center;
            .tipBox {
                margin-left: 10px;
                overflow: hidden;
                font-size: 20px;
                border-radius: 8px;
                display: inline-block;
                border: 1px solid #ddaf62;
                & span:nth-child(1) {
                    padding: 5px;
                    color: #fff;
                    display: inline-block;
                    background: linear-gradient(
                        -130.9deg,
                        rgba(237, 206, 131, 1),
                        rgba(221, 175, 98, 1)
                    );
                }
                & span:nth-child(2) {
                    padding: 5px;
                    background: #fff;
                    color: #ddaf62;
                    display: inline-block;
                }
            }
        }
        .subSellTitle {
            color: #7a797b;
            width: 100%;
            font-size: 24px;
            text-align: left;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .titleP1 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .titleP2 {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
        & > div {
            margin-top: 14px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            line-height: 40px;
            .buy {
                background: linear-gradient(
                    right bottom,
                    #ff6354,
                    #e8332f
                ) !important;
                background: -webkit-linear-gradient(
                    right bottom,
                    #ff6354,
                    #e8332f
                ) !important;
                background: -o-linear-gradient(
                    right bottom,
                    #ff6354,
                    #e8332f
                ) !important;
                background: -moz-linear-gradient(
                    right bottom,
                    #ff6354,
                    #e8332f
                ) !important;
            }
        }
    }
}
</style>
