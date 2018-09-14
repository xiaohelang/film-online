<template lang="html">
    <div :class="$style.panel">
        <section :class="$style.content">
            <dl v-for="(item, index) in sells" :key="index" v-if="item.sum !== 0">
                <dt>
                    <img v-if="item.merchaiseIcon" :src="item.merchaiseIcon" alt="">
                    <img v-else src="static/image/default/goods-poster.png" alt="">
                </dt>
                <dd>
                    <p :class="$style.sellTitle">{{item.merchaiseName}}</p>
                    <p :class="$style.subSellTitle">{{item.merDesc}}</p>
                    <div :class="$style.sellBoxIn">
                        <span>
                            <span>&yen;{{item.discountPrice}}</span>
                            <del>&yen; {{item.originalPrice}}</del>
                        </span>
                        <div :class="$style.combo_num">
                            <img  @click="btnPlus(item)" src="../../../static/image/plus.png" alt="">
                            <span :class="$style.num"> {{item.sum }} </span>
                            <img  @click="btnReduce(item)" src="../../../static/image/reduce.png" alt="">
                        </div>
                    </div>
                </dd>
            </dl>
            <div :class="$style.litteSell">
                <div :class="$style.litteSellT">
                    <p>包含<span>3</span>件商品</p>
                    <div>
                        收起
                    </div>
                </div>
                <dl v-for="(item, index) in sells" :key="index">
                    <dt>
                        <img :src="item.src" alt="">
                    </dt>
                    <dd>
                        <p style="font-size: 0.32rem; color: #262628;">汉根达斯单球杯</p>
                        <p style="font-size: 0.24rem; color: #9B9B9B;">x1</p>
                    </dd>
                </dl>
            </div>
            <ul :class="$style.shopFooter">
                <li>
                    <span style="font-size: 0.32rem; color: #C2C4CA;">合计：</span>
                    <span style="font-size: 0.32rem;">&yen;</span>{{allPrice}}</li>
                <li @click="getCreateMerOrder" :class="[{'no-point': allPrice == 0}]">下单</li>
            </ul>
        </section>
    </div>
</template>

<script>
import Panel from '@/components/base/panel.vue'
import Btn from '@/components/base/btn.vue'
export default {
    data() {
        return {
            comboNum: 0,
            items: [
                {
                    href: 'home',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t13963/267/2355123229/48850/254f797a/5a3c59aeN9cb550f6.jpg?width=335&height=421'
                }
            ],
            sells: [
                {
                    src:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    sellName: '爆米花套餐',
                    detail: '1桶爆米花(大)+一杯大可乐',
                    price: 25,
                    orgPrice: 30
                }
            ],
            comp_merInfo: [],
            merList: [],
            allPrice: 0
        }
    },
    created() {
        let sellStr = window.localStorage.getItem('selectSell')
        // window.localStorage.setItem('selectSell', '')
        this.sells = JSON.parse(sellStr)
        this.getSum()
        console.log('---selectSell---')
        console.log(this.sells)
    },
    methods: {
        btnClick() {
            console.log('购票按钮')
        },
        btnPlus(arg) {
            // 减少套餐数量
            console.log('jian一')
            console.log(arg)
            // let merList = []
            this.sells.map((item, index) => {
                if (arg.merchaiseId === item.merchaiseId) {
                    if (item.sum) {
                        item.sum--
                    } else {
                        item.sum = 0
                    }
                }
                // merList.push(item)
            })
            console.log(this.comp_merInfo)
            // this.comp_merInfo = merList
            this.getSum()
        },
        // +1
        btnReduce(arg) {
            // 增加套餐数量
            console.log('加一')
            console.log(arg)
            // let merList = []
            console.log(this.sells)
            this.sells.map((item, index) => {
                if (arg.merchaiseId === item.merchaiseId) {
                    if (item.sum === undefined) {
                        item.sum = 1
                    } else {
                        item.sum++
                    }
                }
                // merList.push(item)
            })
            console.log(this.sells)
            // this.comp_merInfo = merList
            this.getSum()
        },
        // 总价格
        getSum() {
            this.allPrice = 0
            this.merList = []
            this.sells.map((item, index) => {
                if (item.sum && item.sum !== 0) {
                    this.allPrice += item.discountPrice * item.sum
                    this.merList.push({
                        merAmount: item.discountPrice,
                        merGiftStatus: 0,
                        merName: item.merchaiseName,
                        merNum: item.sum,
                        merOriginal: item.originalPrice,
                        merchaiseId: item.merchaiseId
                    })
                }
            })
            console.log(`----getSum-----${this.allPrice}`)
        },
        // 新创建卖品订单
        getCreateMerOrder() {
            console.log('创建订单')
            let self = this
            let paramData = {}
            paramData.merList = self.merList
            paramData.cinemaCode = self.$route.query.cinemaCode
            paramData.actAmount = self.allPrice
            paramData.orignalAmount = self.allPrice
            self.$axios.post('order_createMerOrder', paramData).then(
                res => {
                    console.log('创建订单---res')
                    console.log(res)
                    let orderId = res.data.orderId
                    // let autoUnlockDatetimeSt = res.data.autoUnlockDatetimeSt
                    let actAmount = res.data.actAmount
                    self.$router.push({
                        path: '/confirmpayment',
                        query: {orderId: orderId, paymentAmount: actAmount, autoUnlockDatetimeSt: 30}
                    })
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        }
    },
    components: {
        Panel,
        Btn
    }
}
</script>

<style lang="scss">
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
.no-point {
    background: #ccc !important;
    pointer-events: none;
}
</style>

<style lang="scss" module>
@import '../../components/scss/element.scss';
.panel {
    .content {
        margin-bottom: 100px;
        padding-bottom: 40px;
        dl {
            display: flex;
            background: #fff;
            box-sizing: border-box;
            padding: 20px 32px;

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
                .sellBoxIn {
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
                    .combo_num {
                        float: right;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        img {
                            width: 40px;
                            height: 40px;
                        }
                        .num {
                            font-size: 32px;
                            color: #4a4a4a;
                            margin: 0 20px;
                        }
                    }
                }
            }
        }
        .litteSell {
            border-bottom: 1px solid #dfdfdf;
            border-top: 1px solid rgba(223, 223, 223, 1);
            background: #fff;
            .litteSellT {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 40px 0 28px;
                box-sizing: border-box;
                width: 750px;
                height: 80px;
                border-bottom: 1px solid #dfdfdf;
                font-size: 28px;
                p span {
                    color: #ed9400;
                    margin: 0 10px;
                }
            }
            dl {
                width: 750px;
                height: 104px;
                display: flex;
                padding: 18px 30px;
                box-sizing: border-box;
                dt {
                    margin-right: 32px;
                    img {
                        width: 68px;
                        height: 68px;
                        object-fit: cover;
                    }
                }
                dd {
                    font-size: 32px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    p {
                        text-align: left;
                    }
                    // &p::nth-child(1){
                    //     color: #262628;
                    //     font-size: 32px;
                    //     text-align: left;
                    // }
                    // &p::nth-child(2){
                    //     color: #9B9B9B;
                    //     font-size: 24px;
                    //     text-align: left;
                    // }
                }
            }
        }
        .shopFooter {
            width: 750px;
            height: 100px;
            background: pink;
            position: fixed;
            display: flex;
            left: 0;
            bottom: 0;
            & li:nth-child(1) {
                flex: 1;
                color: #fff;
                font-size: 48px;
                height: 100%;
                background: #37435e;
                text-align: left;
                line-height: 100px;
                padding-left: 30px;
                box-sizing: border-box;
                div {
                    width: 104px;
                    height: 104px;
                    background: url('static/image/shopping-cart.png') no-repeat;
                    background-size: 104px 104px;
                    position: absolute;
                    top: -28px;
                    left: 30px;
                    span {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        display: inline-block;
                        background: #ff001f;
                        border: 2px solid #fff;
                        right: -8px;
                        border-radius: 22px;
                        top: 0;
                        font-size: 24px;
                        line-height: 40px;
                        text-align: center;
                    }
                }
            }
            & li:nth-child(2) {
                width: 200px;
                height: 100%;
                background: linear-gradient(
                    -131.8deg,
                    rgba(99, 134, 255, 1),
                    rgba(84, 170, 255, 1)
                );
                font-size: 34px;
                line-height: 100px;
                text-align: center;
                color: #fff;
            }
        }
    }
}
</style>
