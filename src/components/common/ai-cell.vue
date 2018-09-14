<template lang="html">
    <div>
        <dl v-for="(item, index) in sells" :key="index">
            <dt>
                <img :src="item.src" alt="">
            </dt>
            <dd>
                <p :class="$style.sellTitle">{{item.sellName}} <span :class="$style.tipBox"><span>杜比视界</span><span>IMAX</span></span> </p>
                <div :class="$style.subSellTitle">
                    <div>
                        <p>导演：刘若英</p>
                        <p v-if="isSelected" :class="$style.titleP1">主演：井柏然 / 周冬雨 / 田壮壮 / 曲哲明 / 刘启恒 // 周冬雨 / 田壮壮 / 曲哲明 / 刘启恒 / </p>
                        <p v-if="!isSelected" :class="$style.titleP2">主演：井柏然 / 周冬雨 / 田壮壮 / 曲哲明 / 刘启恒 // 周冬雨 / 田壮壮 / 曲哲明 / 刘启恒 / </p>
                        <p v-if="!isSelected">2018-05-12大陆上映</p>
                    </div>
                    <div v-if="isSelected">
                        <Btn @upBtnClick='filmPlanClick(item)' :class="$style.buy">购买</Btn>
                    </div>
                </div>
            </dd>
        </dl>
    </div>
</template>

<script>
import Btn from '@/components/base/btn.vue'
export default {
    props: {
        isSelected: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            sells: [
                {
                    src:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    sellName: '后来的我们',
                    detail: '1桶爆米花(大)+一杯大可乐',
                    price: 25,
                    orgPrice: 30
                },
                {
                    src:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    sellName: '爆米花套餐',
                    detail: '1桶爆米花(大)+一杯大可乐',
                    price: 25,
                    orgPrice: 30
                },
                {
                    src:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    sellName: '爆米花套餐',
                    detail: '1桶爆米花(大)+一杯大可乐',
                    price: 25,
                    orgPrice: 30
                },
                {
                    src:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    sellName: '爆米花套餐',
                    detail: '1桶爆米花(大)+一杯大可乐',
                    price: 25,
                    orgPrice: 30
                }
            ]
        }
    },
    methods: {
        filmPlanClick(plan) {
            console.log('upFilmPlanClick', plan)
            this.$emit('upFilmPlanClick', plan)
        }
    },
    components: {
        Btn
    }
}
</script>

<style lang="scss" module>
@import 'vue-swipe/dist/vue-swipe.css';
@import '../scss/element.scss';
.panel {
    @include panel;
}
dl {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 32px;
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
            }
        }
    }
}
</style>
