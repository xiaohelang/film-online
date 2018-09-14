<template lang="html">
    <Panel title="正在热映" :class="$style.panel">
        <section v-if='items.length>0' :class="$style.content">
            <div @click="hotFilmAllClick()" class="arrow">全部 ></div>
            <FilmHotSlider :options="options" :items="items" :transPropertiy="transPropertiy" cname="product-slider">
                <template slot-scope="slotProps">
                    <h5 class="h5">{{slotProps.item.movieName}}</h5>
                    <Btn @upBtnClick="filmBuyerClick(slotProps.item)" v-if="isBuy(slotProps.item)" class="buyT2">{{slotProps.item|salesOrPreSales}}</Btn>
                    <Btn @upBtnClick="filmBuyerClick(slotProps.item)" v-if="!isBuy(slotProps.item)" class="buyT">{{slotProps.item|salesOrPreSales}}</Btn>
                    <!-- <Btn @upBtnClick="filmBuyerClick(slotProps.item)" :class="[{buyT2: slotProps.item|salesOrPreSales == '购票'},{buyT: slotProps.item|salesOrPreSales == '预售'} ]">{{slotProps.item|salesOrPreSales}}</Btn> -->
                    <span v-if="slotProps.item.movieEffects" class="DMax1">{{slotProps.item.movieEffects|fliterShowEffect}}</span>
                    <span v-if="slotProps.item.movieEffects" class="DMax2">{{slotProps.item.movieEffects|fliterShowEffect2}}</span>
                </template>
            </FilmHotSlider>
        </section>
        <section v-else :class="$style.content" style="display: flex;flex-direction: column;align-items: center;">
            <img  :class='$style.noFilmImg' src="/static/image/default/noFilm.png" alt="">
            <span :class="$style.noFilmSpan">暂无放映场次</span>
        </section>
    </Panel>
</template>

<script>
import Panel from '@/components/base/panel.vue'
import FilmHotSlider from '@/components/base/slider.vue'
import Btn from '@/components/base/btn.vue'
import { formatDate } from '@/js/dateUtils.js'
export default {
    data() {
        return {
            transPropertiy: {
                imageSrc: 'movieHomeIcon',
                jumpHref: 'href',
                defualtImageSrc: '../../static/image/default/film-poster.png'
            },
            options: {
                slidesPerView: 3.6,
                spaceBetween: 15,
                freeMode: true
            }
        }
    },
    props: {
        items: {
            type: Array,
            default() {
                return []
            }
        },
        currentCinema: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    methods: {
        hotFilmAllClick() {
            // 全部
            // console.log('123', dateUtils.dateFormat('2018-08-01'))
            let hotFilm = {}
            hotFilm.clickType = 0
            hotFilm.cinemaCode = this.currentCinema.cinemaCode
            console.log('热映全部', hotFilm)
            this.$router.push({ path: '/movie', query: hotFilm })
        },
        filmBuyerClick(hotFilm) {
            console.log('热映购票', hotFilm)
            let filmParma = {}
            filmParma.cinemaCode = this.currentCinema.cinemaCode
            filmParma.movieCode = hotFilm.movieCode
            this.$router.push({ path: '/filmplan', query: filmParma })
        },
        isBuy(item) {
            let salesStatus = '购票'
            let curDate = formatDate(new Date(), 'yyyy-MM-dd')
            if (item.publicDate > curDate) {
                salesStatus = '预售'
            }
            // return salesStatus
            if (salesStatus === '购票') {
                return true
            } else {
                return false
            }
        }
    },
    filters: {
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
        },
        salesOrPreSales(item) {
            let salesStatus = '购票'
            let curDate = formatDate(new Date(), 'yyyy-MM-dd')
            if (item.publicDate > curDate) {
                salesStatus = '预售'
            }
            return salesStatus
        }
    },
    components: {
        Panel,
        FilmHotSlider,
        Btn
    }
}
</script>

<style lang="scss" scoped>
.DMax1 {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 8px;
    box-sizing: border-box;
    background: rgb(0, 0, 0);
    opacity: 0.4;
    color: #fff !important;
    border-radius: 8px 0px 8px 0px;
    font-size: 18px !important;
}
.DMax2 {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px 8px;
    box-sizing: border-box;
    background: rgb(0, 0, 0);
    color: #fff !important;
    opacity: 0.4;
    border-radius: 0px 8px 0px 8px;
    font-size: 18px !important;
}
.product-slider {
    .h5 {
        margin-top: 18px;
        margin-bottom: 18px;
        font-size: 32px;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        color: #4a4a4a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .buyT {
        background: -webkit-linear-gradient(
            right bottom,
            #6f85ff,
            #54aaff
        ) !important;
        background: -o-linear-gradient(
            right bottom,
            #6f85ff,
            #54aaff
        ) !important;
        background: -moz-linear-gradient(
            right bottom,
            #6f85ff,
            #54aaff
        ) !important;
        background: linear-gradient(right bottom, #6f85ff, #54aaff) !important;
    }
    .buyT2 {
        background: -webkit-linear-gradient(
            right bottom,
            #E8332F,
            #FF6354
        ) !important;
        background: -o-linear-gradient(
            right bottom,
            #E8332F,
            #FF6354
        ) !important;
        background: -moz-linear-gradient(
            right bottom,
            #E8332F,
            #FF6354
        ) !important;
        background: linear-gradient(right bottom, #E8332F, #FF6354) !important;
    }
    .swiper-container {
        box-sizing: border-box;
        padding: 0 24px;
        .swiper-slide {
            se {
                display: inline-block;
                width: 100%;
                img {
                    width: 100%;
                    display: block;
                    height: 260px;
                    border: 1px solid #fafafa;
                }
            }
        }
    }
}
</style>

<style lang="scss" module>
@import '../../components/scss/element.scss';
.panel {
    @include panel;
    h4 {
        font-size: 32px;
    }
    .content {
        padding-bottom: 40px;
        position: relative;
        & > div {
            position: absolute;
            font-size: 28px;
            color: #999;
            right: 30px;
            top: -70px;
        }
    }
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
    .swiper-container {
        box-sizing: border-box;
        padding: 0 24px;
        .swiper-slide {
            section {
                display: inline-block;
                width: 100%;
                img {
                    width: 100%;
                    display: block;
                    height: 260px;
                    border: 1px solid #fafafa;
                }
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
    margin-top: 10px;
    justify-content: space-between;
}
</style>
