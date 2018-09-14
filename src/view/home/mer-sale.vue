<template lang="html">
    <Panel title="卖品" :class="$style.panel">
        <section v-if='items.length>0' :class="$style.content">
            <div @click="merSaleAllClick()" class="arrow">全部 ></div>
            <dl v-for="(item, index) in items" :key="index" :class="{'home-bottom':  index === items.length}">
                <dt>
                    <img v-if="item.merIcon" :src="item.merIcon" alt="">
                    <img v-else :src="merTransPropertiy.defualtImageSrc" alt="">
                </dt>
                <dd>
                    <p :class="$style.sellTitle">{{item.merName}}</p>
                    <p :class="$style.subSellTitle">{{item.merDesc}}</p>
                    <div >
                        <span>
                            <span>&yen;{{item.discountPrice}}</span>
                            <del>&yen; {{item.originalPrice}}</del>
                        </span>
                        <Btn @upBtnClick="merBuyerClick(item)" :class="$style.buy">购买</Btn>
                    </div>
                </dd>
            </dl>
        </section>
        <section v-else :class="$style.content" style="display: flex;flex-direction: column;align-items: center;">
            <img  :class='$style.noMerImg' src="/static/image/default/noMer.png" alt="">
            <span :class='$style.noMerSpan'>暂无卖品可售</span>
        </section>
    </Panel>
</template>

<script>
import Panel from '@/components/base/panel.vue'
import Btn from '@/components/base/btn.vue'
export default {
    data() {
        return {
            /**
             * 适配属性值
             * imageSrc：图片显示地址
             */
            merTransPropertiy: {
                defualtImageSrc: '../../static/image/default/goods-poster.png'
            },
            homeBottom: 'home-bottom'
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
            default: () => {
                return {}
            }
        }
    },
    methods: {
        // 卖品全部
        merSaleAllClick() {
            console.log('查看全部卖品购买')
            let paramData = {}
            paramData.cinemaCode = this.currentCinema.cinemaCode
            this.$router.push({ path: '/shop', query: paramData })
        },
        merBuyerClick(mer) {
            console.log('卖品购买', mer)
            let paramData = {}
            // paramData.mer = JSON.stringify(mer)
            paramData.componentId = mer.componentId
            paramData.discountPrice = mer.discountPrice
            paramData.cinemaCode = this.currentCinema.cinemaCode
            this.$router.push({ path: '/shop', query: paramData })
        }
    },
    components: {
        Panel,
        Btn
    }
}
</script>
<style lang="scss">
.home-bottom{
    &:after{
        content: " ";
        width: 680px!important;
        height: 3px!important;
        display: block!important;
        position: absolute!important;
        bottom: 0!important;
        left: 35px!important;
        border-bottom: 3px solid#fff!important;
    }
}
.product-slider {
    .swiper-container {
        box-sizing: border-box;
        padding: 0 24px;
        .swiper-slide {
            a {
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
        dl {
            display: flex;
            box-sizing: border-box;
            padding: 20px 32px;
            position: relative;
            &:after{
                content: " ";
                width: 680px;
                height: 1px;
                display: block;
                position: absolute;
                bottom: 0;
                left: 35px;
                border-bottom: 1px solid rgba(237,237,237,1);
            }
            dt > img {
                width: 180px;
                height: 180px;
                object-fit: cover;
            }
            dd {
                display: flex;
                width: 480px;
                margin-left: 16px;
                flex-direction: column;
                justify-content: space-between;
                .sellTitle {
                    color: #262628;
                    font-size: 32px;
                    text-align: left;
                    margin-top: 5px;
                }
                .subSellTitle {
                    color: #9b9b9b;
                    font-size: 32px;
                    text-align: left;
                }
                & > div {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    & > span {
                        span {
                            color: #f43933;
                            font-size: 48px;
                        }
                        del {
                            font-size: 32px;
                            color: #9b9b9b;
                        }
                    }
                    .buy {
                        // background: linear-gradient(right bottom, #ff6354, #e8332f) !important;
                        background: -webkit-linear-gradient(
                            right bottom,
                            #ff6354,
                            #e8332f
                        ) !important;
                        // background: -o-linear-gradient(right bottom, #ff6354, #e8332f) !important;
                        // background: -moz-linear-gradient(right bottom, #ff6354, #e8332f) !important;
                    }
                }
            }
        }
    }
}
.noMerImg {
    display: block;
    width: 320px;
    // height: 320px;
}
.noMerSpan {
    display: flex;
    color: #7A797B;
    font-size: 32px;
    margin-top: 10px;
    justify-content: space-between;
}
</style>
