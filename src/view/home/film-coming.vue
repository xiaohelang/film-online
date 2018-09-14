<template lang="html">
    <Panel title="即将上映" :class="$style.panel">
        <section v-if='items.length>0' :class="$style.content">
            <div @click="filmComingAllClick()"  class="arrow">全部 ></div>
            <FilmCompingSlider :options="options" :items="items"  :transPropertiy="transPropertiy" cname="product-slider">
                <template slot-scope="slotProps">
                    <h5>{{slotProps.item.movieName}}</h5>
                    <span>{{slotProps.item.publicDate | filmPublishDateShow}}上映</span>
                    <span v-if="slotProps.item.movieEffects" class="DMax1">{{slotProps.item.movieEffects|fliterShowEffect}}</span>
                    <span v-if="slotProps.item.movieEffects" class="DMax2">{{slotProps.item.movieEffects|fliterShowEffect2}}</span>
                </template>
            </FilmCompingSlider>
        </section>
         <section v-else :class="$style.content" style="display: flex;flex-direction: column;align-items: center;">
            <img  :class="$style.noFilmImg" src="/static/image/default/noFilm.png" alt="">
            <span :class="$style.noFilmSpan">暂无即将上映影片</span>
        </section>
    </Panel>
</template>

<script>
import Panel from '@/components/base/panel.vue'
import FilmCompingSlider from '@/components/base/slider.vue'
import Btn from '@/components/base/btn.vue'
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
        filmComingAllClick() {
            let filmComing = {}
            filmComing.clickType = 1
            filmComing.cinemaCode = this.currentCinema.cinemaCode
            console.log('即将上映全部', filmComing)
            this.$router.push({ path: '/movie', query: filmComing })
        }
    },
    filters: {
        /**
         * 上映日期转换
         */
        filmPublishDateShow(dateStr) {
            let dateShow = dateStr
            if (dateStr) {
                let dateArg = dateStr.substring(0, 11).split('-')
                dateShow = dateArg[1] + '月' + dateArg[2] + '日'
            }
            return dateShow
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
    },
    components: {
        Panel,
        FilmCompingSlider,
        Btn
    }
}
</script>

<style lang="scss" scoped>
.DMax1 {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px 8px;
    box-sizing: border-box;
    background:rgb(0,0,0);
    color: #fff!important;
    opacity: 0.4;
    border-radius:0px 8px 0px 8px;
    font-size: 18px!important;
}
.DMax2{
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 8px;
    box-sizing: border-box;
    background:rgb(0,0,0);
    opacity: 0.4;
    color: #fff!important;
    border-radius:8px 0px 8px 0px;
    font-size: 18px!important;
}
.product-slider {
    h5 {
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
    span {
        font-size: 24px;
        color: #999999;
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
.noFilmImg {
    display: block;
    width: 320px;
    // height: 320px;
}
.noFilmSpan {
    display: flex;
    color: #7A797B;
    font-size: 32px;
    margin-top: 10px;
    justify-content: space-between;
}
</style>
