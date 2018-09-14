<template lang="html">
    <section :class="$style.content">
        <dl v-for="(item, index) in sells" :key="index">
            <dt>
                <img :src="item.src" alt="">
            </dt>
            <dd>
                <p :class="$style.sellTitle">{{item.sellName}}</p>
                <p :class="$style.subSellTitle">{{item.detail}}</p>
                <div >
                    <span>
                        <span>&yen;{{item.price}}</span>
                        <del>&yen; {{item.orgPrice}}</del>
                    </span>
                    <div :class="$style.combo_num">
                        <span :class="$style.reduce" @click="btnPlus"> <img src="../../../static/image/plus.png" alt=""> </span>
                        <span :class="$style.num"> {{ comboNum }} </span>
                        <span :class="$style.reduce" @click="btnReduce"> <img src="../../../static/image/reduce.png" alt=""></span>
                    </div>
                </div>
            </dd>
        </dl>
        <!-- <ul :class="$style.shopFooter">
           <li><span style="font-size: 0.32rem;">&yen;</span>166
               <div>
                   <span>8</span>
               </div>
            </li>
            <li>去结算</li>
        </ul> -->
    </section>
</template>

<script>
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
        btnPlus() {
            if (this.comboNum === 0) {
                // return
            } else {
                this.comboNum--
            }
        },
        btnReduce() {
            this.comboNum++
        }
    },
    components: {}
}
</script>

<style lang="scss" module>
@import '../../components/scss/element.scss';
.content {
    padding-bottom: 40px;
    dl {
        display: flex;
        box-sizing: border-box;
        width: 590px;
        padding: 20px 32px;
        background: #fff;
        dt > img {
            width: 156px;
            height: 156px;
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
                font-size: 28px;
                text-align: left;
                margin-top: 5px;
            }
            .subSellTitle {
                color: #9b9b9b;
                font-size: 24px;
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
                        font-size: 36px;
                    }
                    del {
                        font-size: 32px;
                        color: #9b9b9b;
                    }
                }
                .combo_num {
                    float: right;
                    .reduce {
                        width: 40px;
                        height: 40px;
                        display: inline-block;
                        vertical-align: sub;
                        img {
                            width: 100%;
                            height: 100%;
                        }
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
    .shopFooter{
        width: 750px;
        height: 100px;
        background: pink;
        position: fixed;
        display: flex;
        left: 0;
        bottom: 0;
        & li:nth-child(1){
            flex: 1;
            color: #fff;
            font-size: 48px;
            background: #37435E;
            text-align: left;
            line-height: 100px;
            padding-left: 160px;
            box-sizing: border-box;
            div{
                width: 104px;
                height: 104px;
                background: url('static/image/shopping-cart.png') no-repeat;
                background-size: 104px 104px;
                position: absolute;
                top: -28px;
                left: 30px;
                span{
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    display: inline-block;
                    background: #FF001F;
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
        & li:nth-child(2){
            width: 200px;
            height: 100%;
            background:linear-gradient(-131.8deg,rgba(99,134,255,1),rgba(84,170,255,1));
            font-size: 34px;
            line-height: 100px;
            text-align: center;
            color: #fff;
        }
    }
}
.NoDisplay {
    display: none;
}
</style>
