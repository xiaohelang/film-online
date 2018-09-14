<template>
    <div class="order">
        <CountDown v-if="autoUnlockDatetimeStr" :expireTime="autoUnlockDatetimeStr" :callback="dealExipirtBill"></CountDown>
        <!-- 影片购买信息 -->
        <div class="hall_detaile">
            <p>
                <span class="hallName">{{ ticketDetail.ticket ? ticketDetail.ticket.movieName : '' }}</span>
                <span class="hallNum">{{ ticketDetail.ticket ? ticketDetail.ticket.ticketNum : '' }}张 </span>
            </p>
            <p class="saleTime">
                <span>{{ item.week }}</span>
                <span>{{ ticketDetail.ticket ? ticketDetail.ticket.startPlanShow : '' }}</span>
                <span>（{{ ticketDetail.ticket ? ticketDetail.ticket.language : ''}}{{ ticketDetail.ticket ? ticketDetail.ticket.showEffect : ''}}）</span>
            </p>
            <p> {{ ticketDetail.cinemaName }} </p>
            <p class="seatInformation"> {{ ticketDetail.ticket ? ticketDetail.ticket.hallName : '' }} {{ticketDetail.ticket ? ticketDetail.ticket.ticketDescribe : ''}}</p>
            <div v-show="false">
                <span> {{ item.vip }} </span>
                <span class="fr c_bg"> {{ item.discount }} </span>
            </div>
            <div>
                <span> 手机号码 </span>
                <span class="fr"> {{ ticketDetail.mobile }} </span>
            </div>
            <div>
                <span> 小计 </span>
                <span class="fr c_bg"> &yen;{{ ticketDetail.totalAmount }}</span>
            </div>
        </div>

        <!-- 观影套餐 -->
        <div class="hallCombo" v-if="comp_merInfo.length!==0">
            <h2 class="comboNum"> 观影超值套餐({{ comp_merInfo.length }})</h2>
            <ul>
                <li v-for="(item, index) in comp_merInfo" :key="index">
                    <div class="comboImg">
                        <img v-if="item.merIcon" :src="item.merIcon" alt="">
                        <img v-else src="static/image/default/goods-poster.png" alt="">
                    </div>
                    <div class="combo_details">
                        <h4>{{ item.merName }}</h4>
                        <p>
                            <span> {{ item.merDesc }} </span>
                            <!-- <span> {{ item.drinks }} </span> -->
                        </p>
                        <div class="combo_price">
                            <div class="price">
                                <span class="presentPrice">&yen;{{ item.discountPrice }}</span>
                                <span class="originalPrice">&yen;{{ item.originalPrice }}</span>
                            </div>
                            <div class="combo_num">
                                <span v-show="item.sum" class="reduce" @click="btnPlus(item)"> <img src="../../../static/image/plus.png" alt=""> </span>
                                <span v-show="item.sum" class="num"> {{ item.sum }} </span>
                                <span class="reduce" @click="btnReduce(item)"> <img src="../../../static/image/reduce.png" alt=""></span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 确认按钮 -->
        <div class="fonter">
            <div class="order_detail" v-if="orderDetailFlag" transition="fade">
                <ul>
                    <li>
                        <div>
                            <span class="productName"> {{ ticketDetail.ticket ? ticketDetail.ticket.movieName : '' }} </span>
                            <span> x {{ ticketDetail.ticket ? ticketDetail.ticket.ticketNum : ''}} </span>
                        </div>
                        <span class="productPrice"> &yen;{{ticketDetail.totalAmount}} </span>
                    </li>
                    <li v-for="(item, index) in merList" :key="index">
                        <div>
                            <span class="productName"> {{ item.merName }} </span>
                            <span> x {{ item.merNum }} </span>
                        </div>
                        <span class="productPrice"> &yen;{{item.merAmount*item.merNum}} </span>
                    </li>
                </ul>
            </div>
            <div class="paymentPrice">
                <span class="rule">不支持退票、改签</span>
                <div class="real_payment">
                    <span>应付：</span>
                    <span class="real"> &yen;{{ticketDetail.totalAmount + allPrice}}</span> <img @click="btnShowOrder" src="../../../static/image/show.png" alt=""></div>
            </div>
            <div v-if="continuePay" class="continuePayment">
                <div class="paymentItem1" @click="cancelBill(ticketDetail.orderId)">取消</div>
                <div class="paymentItem2" @click="btnToCheck">去结算</div>
            </div>
            <div v-else class="payment" @click="btnToCheck">去结算</div>
        </div>
        <div class="order-mask" v-if="orderDetailFlag" @click="btnShowOrder"></div>
    </div>
</template>

<script>
import CountDown from './reverseTime'
export default {
    data() {
        return {
            continuePay: false,
            orderDetailFlag: false,
            expireTime: '2019-06-02 11:50:00',
            ticketDetail: {},
            item: {
                hallName: '后来的我们',
                hallNum: '2',
                week: '周六',
                time: '05-12 14:20',
                version: '中文2D',
                stornName: '广州万达影院万胜广场店',
                seatInformation: '四号厅 7排10座,7排11座',
                vip: '影城会员卡',
                discount: '减6元',
                phone: '手机号码',
                iphone: '13922235815',
                priceName: '小计',
                price: '6'
            },
            comboData: [
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                },
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                },
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                },
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                },
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                },
                {
                    url:
                        'https://gw.alicdn.com/tfs/TB1dN9fX3MPMeJjy1XcXXXpppXa-1280-520.jpg_720x720Q30.jpg',
                    comboName: '爆米花套餐',
                    snacks: '1桶爆米花(大)',
                    drinks: '1杯大可乐',
                    presentPrice: '25',
                    originalPrice: '30',
                    comboNum: '12'
                }
            ],
            orderDetailData: [
                {
                    productName: '后来的我们',
                    productNum: 'x2',
                    productPrice: '88'
                }
            ],
            comp_merInfo: [],
            allPrice: 0,
            orignalAmount: 0,
            totalAmount: 0,
            autoUnlockDatetimeStr: '',
            seatList: [],
            merList: []
        }
    },
    created() {
        setTitle('结算')
        let orderId = this.$route.query.orderId
        if (this.$route.query.continuePay) {
            this.continuePay = true
        }
        this.getQueryOrderDetail(orderId)
        this.getMerDetail()
    },
    methods: {
        btnShowOrder() {
            this.orderDetailFlag = !this.orderDetailFlag
        },
        // 根据订单ID查询订单
        getQueryOrderDetail(id) {
            let self = this
            self.$axios.post('order_queryOrderDetail', { orderId: id }).then(
                res => {
                    console.log('查询订单详情---res')
                    console.log(res)
                    if (res.data.orderStatus === 2) {
                        self.$alertCallBack('订单已结束', function(cancelRes) {
                            self.$router.push({ path: '/home', query: {} })
                        })
                    }
                    self.ticketDetail = res.data
                    self.totalAmount = res.data.totalAmount
                    if (res.data.ticket) {
                        self.autoUnlockDatetimeStr =
                            res.data.ticket.autoUnlockDatetimeStr
                        res.data.ticket.seatCodeList.map((item, index) => {
                            self.seatList.push({
                                seatCode: item
                            })
                        })
                    }
                },
                err => {
                    console.log('查询订单详情---err')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 卖品查询
        getMerDetail() {
            let paramData = {}
            let self = this
            // paramData.cinemaCode = this.hlTest.cinemaCode
            console.log('-------cinemaCode-------')
            console.log(this.hlTest.cinemaCode)
            paramData.cinemaCode = this.$route.query.cinemaCode
            paramData.displayStyle = 7
            self.$axios.post('home_getComponentContent', paramData).then(
                res => {
                    console.log('卖品---res')
                    console.log(res)
                    self.comp_merInfo = res.data
                },
                err => {
                    console.log('卖品---err')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 追加订单
        getAppendOrder() {
            let self = this
            let orderId = this.$route.query.orderId
            // let merList = {
            //     campaignAmount: 0,
            //     merAmount: 0,
            //     merGiftStatus: 0,
            //     merName: '',
            //     merNum: 0,
            //     merOriginal: 0,
            //     merchaiseId: 0,
            //     shareAmount: 0
            // }
            // let seatList = {
            //     campaignAmount: 0,
            //     seatCode: '',
            //     shareAmount: 0
            // }
            let paramData = {}
            paramData.merList = self.merList
            paramData.orderId = self.$route.query.orderId
            paramData.orignalAmount = self.orignalAmount
            paramData.seatList = self.seatList
            self.$axios.post('order_appendOrder', paramData).then(
                res => {
                    console.log('order_appendOrder---err')
                    console.log(res)
                    if (res.status.status === 0) {
                        let order = {}
                        order.orderId = orderId
                        self.$router.push({
                            path: 'confirmPayment',
                            query: order
                        })
                    }
                },
                err => {
                    console.log('order_appendOrder---err')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        btnPlus(arg) {
            // 减少套餐数量
            console.log('jian一')
            console.log(arg)
            let merList = []
            this.comp_merInfo.map((item, index) => {
                if (arg.componentId === item.componentId) {
                    if (item.sum) {
                        item.sum--
                    } else {
                        item.sum = 0
                    }
                }
                merList.push(item)
            })
            console.log(this.comp_merInfo)
            this.comp_merInfo = merList
            this.getSum()
        },
        // +1
        btnReduce(arg) {
            // 增加套餐数量
            console.log('加一')
            console.log(arg)
            let merList = []
            this.comp_merInfo.map((item, index) => {
                if (arg.componentId === item.componentId) {
                    if (item.sum === undefined) {
                        item.sum = 1
                    } else {
                        item.sum++
                    }
                }
                merList.push(item)
            })
            console.log(this.comp_merInfo)
            this.comp_merInfo = merList
            this.getSum()
        },
        // 总价格
        getSum() {
            this.allPrice = 0
            this.merList = []
            this.comp_merInfo.map((item, index) => {
                if (item.sum && item.sum !== 0) {
                    this.allPrice += item.discountPrice * item.sum
                    this.merList.push({
                        merAmount: item.discountPrice,
                        merGiftStatus: 0,
                        merName: item.merName,
                        merNum: item.sum,
                        merOriginal: item.originalPrice,
                        merchaiseId: item.componentId
                    })
                }
            })
            this.orignalAmount = this.totalAmount + this.allPrice
            console.log(`----getSum-----${this.allPrice}`)
            console.log(`----getSum-----`)
            console.log(this.merList)
        },
        // 去结算
        btnToCheck() {
            // let orderId = this.$route.query.orderId
            this.getAppendOrder()
            // this.$router.push({ path: 'confirmpayment', query: {'orderId': orderId} })
        },
        cancelBill(orderId) {
            let self = this
            self.$axios.post('order_deleteOrder', { orderId }).then(
                res => {
                    self.$alertCallBack('取消成功', function(cancelRes) {
                        self.$router.push({ path: '/home', query: {} })
                    })
                },
                err => {
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        dealExipirtBill() {
            console.log('实现过期订单处理逻辑。。。。')
            let self = this
            self.$alertCallBack('订单已超时', function(cancelRes) {
                let orderId = self.$route.query.orderId
                self.$axios.post('order_deleteOrder', { orderId }).then(
                    res => {
                        self.$router.push({ path: '/home', query: {} })
                    },
                    err => {
                        console.log(err)
                        self.$MessageAlert(err.msg)
                    }
                )
            })
        }
    },
    // beforeRouteEnter(to, from, next) {
    //     next()
    // },
    // beforeRouteLeave(to, from, next) {
    //     if (to.path === '/buySeat') {
    //         let self = this
    //         self.$MsgConfirm(
    //             '返回后，已选座位将不会保留',
    //             function(cancelRes) {
    //                 let orderId = self.$route.query.orderId
    //                 self.$axios.post('order_deleteOrder', { orderId }).then(
    //                     res => {
    //                         next()
    //                     },
    //                     err => {
    //                         console.log(err)
    //                         self.$MessageAlert(err.msg)
    //                     }
    //                 )
    //             },
    //             function() {
    //                 next(false)
    //             }
    //         )
    //     } else {
    //         next()
    //     }
    // },
    components: { CountDown }
}
</script>

<style lang="scss">
.order {
    .hall_detaile {
        width: 750px;
        // height: 520px;
        background: #fff;
        padding: 48px 30px 0 30px;
        box-sizing: border-box;
        text-align: left;
        margin-bottom: 24px;
        p {
            font-size: 28px;
            color: #262628;
            margin-bottom: 14px;
            .hallName {
                font-size: 36px;
                font-weight: bold;
                margin-right: 20px;
            }
            .hallNum {
                font-size: 36px;
            }
        }
        .saleTime {
            color: #598cff;
        }
        .seatInformation {
            margin-bottom: 36px;
        }
        div {
            width: 690px;
            height: 80px;
            line-height: 80px;
            font-size: 28px;
            border-bottom: 1px solid #dfdfdf;
        }
    }
    .hallCombo {
        width: 750px;
        text-align: left;
        padding: 32px 30px 0 30px;
        box-sizing: border-box;
        background: #fff;
        .comboNum {
            color: #262628;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 24px;
        }
        ul {
            padding-bottom: 188px;
            li {
                height: 182px;
                padding-bottom: 48px;
                .comboImg {
                    width: 180px;
                    height: 180px;
                    float: left;
                    margin-right: 34px;
                    img {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .combo_details {
                    h4 {
                        font-size: 32px;
                        color: #262628;
                        margin-bottom: 14px;
                    }
                    p {
                        font-size: 32px;
                        color: #9b9b9b;
                        margin-bottom: 24px;
                    }
                    .combo_price {
                        height: 66px;
                        line-height: 66px;
                        .price {
                            float: left;
                            .presentPrice {
                                font-size: 48px;
                                color: #f43933;
                                margin-right: 6px;
                            }
                            .originalPrice {
                                font-size: 28px;
                                color: #9b9b9b;
                                text-decoration: line-through;
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
        }
    }
    .order-mask {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 10;
    }
    .fonter {
        position: fixed;
        z-index: 20;
        bottom: 0;
        left: 0;
        .payment {
            width: 750px;
            height: 100px;
            border: 0;
            display: flex;
            font-size: 34px;
            color: #fff;
            line-height: 100px;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
                -124.3deg,
                rgba(111, 133, 255, 1),
                rgba(84, 170, 255, 1)
            );
        }
        .continuePayment {
            width: 750px;
            height: 100px;
            border: 0;
            display: flex;
            font-size: 34px;
            color: #fff;
            .paymentItem1 {
                flex: 1;
                line-height: 100px;
                background: #ccc;
            }
            .paymentItem2 {
                flex: 1;
                line-height: 100px;
                background: linear-gradient(
                    -124.3deg,
                    rgba(111, 133, 255, 1),
                    rgba(84, 170, 255, 1)
                );
            }
        }
        .paymentPrice {
            height: 88px;
            line-height: 88px;
            padding: 0 30px;
            background: #fafafc;
            border-top: 1px solid #dfdfdf;
            text-align: left;
            font-size: 28px;
            color: #7a797b;
            display: flex;
            justify-content: space-between;
        }
        .real_payment {
            display: flex;
            align-items: center;
            .real {
                font-size: 48px;
                color: #f43933;
                margin-right: 32px;
            }
            img {
                width: 20px;
                height: 20px;
            }
        }
        .order_detail {
            border-top: 1px solid #dfdfdf;
            background: #fafafc;
            text-align: left;
            ul {
                padding: 0 30px;
                li {
                    height: 85px;
                    line-height: 85px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #dfdfdf;
                    font-size: 30px;
                    color: #7a797b;
                    .productName {
                        margin-right: 30px;
                    }
                    .productPrice {
                        color: #262628;
                    }
                }
            }
        }
    }
}

.fr {
    float: right;
}
.c_bg {
    color: #f43933;
}

.fade-transition {
    transition: 2s all ease;
}
.fade-enter {
    opacity: 0;
}
.fade-leave {
    opacity: 0;
    transform: translate(200px);
}
.br {
    border-bottom: 0 !important;
}
</style>
