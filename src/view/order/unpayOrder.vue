<template>
    <div class="order">
        <CountDown v-if="autoUnlockDatetimeStr" :expireTime="autoUnlockDatetimeStr" :callback="dealExipirtBill"></CountDown>
        <!-- 影片信息 -->
        <div v-if="ticketDetail.orderType == 5" class="location">
            <div class="locationArea">
                <span>{{ticketDetail.deliveryAddress}}</span>
                <span>{{ticketDetail.deliverySubAddress}}</span>
                <span v-if="ticketDetail.deliverySubAddress">(影院影厅)</span>
            </div>
            <div class="locationTime">
                <div style="color: #262628;">送达时间</div>
                <div style="color: #666666;">尽快送达</div>
            </div>
        </div>
        <div v-if="ticketDetail.ticket" class="ticket">
            <div class="ticket-title">影票</div>
            <p style="margin-bottom: 0.3rem;">
                <span class="hallName">{{ ticketDetail.ticket ? ticketDetail.ticket.movieName : '' }}</span>
                <span class="hallNum">{{ ticketDetail.ticket ? ticketDetail.ticket.ticketNum : '' }}张 </span>
            </p>
            <p class="saleTime">
                <!-- <span>周六</span> -->
                <span>{{ ticketDetail.ticket.startPlanShow| filterDate }}</span>
                <span>（{{ ticketDetail.ticket ? ticketDetail.ticket.language : ''}}{{ ticketDetail.ticket ? ticketDetail.ticket.showEffect : ''}}）</span>
            </p>
            <p class="seatInformation"> {{ ticketDetail.cinemaName }} </p>
            <p class="seatInformation"> {{ ticketDetail.ticket ? ticketDetail.ticket.hallName : '' }} {{ticketDetail.ticket ? ticketDetail.ticket.ticketDescribe : ''}}</p>
        </div>
        <!-- 套餐信息 -->
        <ul v-if="merchaiseList.length != 0" class="mersell">
            <div v-if="!isSellPath" class="mersell-title">卖品</div>
            <div v-if="isSellPath" class="mersell-title2">{{cinemaName}}</div>
            <li v-for="(item, index) in merchaiseList" :key="index" class="merLi">
                <div class="merLi-box">
                    <div class="boxLeft">{{item.merName}} </div>
                    <div class="boxCenter">数量：{{item.merNum}}</div>
                    <div class="boxRight">¥{{item.merAmount}}</div>
                </div>
                <p>{{item.children|filterComb}}</p>
                <!-- <p>哈根达斯单球 +哈根达斯单球杯 x 1</p> -->
            </li>
        </ul>
        <div class="middle-phone">
            <span style="color: #262628;"> 手机号码 </span>
            <span style="color: #9B9B9B;"> {{ ticketDetail.mobile }} </span>
        </div>
        <!-- 确认按钮 -->
        <div class="fonter">
            <div class="paymentPrice">
                <span class="rule"></span>
                <div class="real_payment">
                    <span>应付：</span>
                    <span class="real"> &yen;{{ticketDetail.totalAmount}}</span>
                    <!-- <img @click="btnShowOrder" src="../../../static/image/show.png" alt=""> -->
                </div>
            </div>
            <div v-if="continuePay" class="continuePayment">
                <div class="paymentItem1" @click="cancelBill(ticketDetail.orderId)">取消</div>
                <div class="paymentItem2" @click="btnToCheck">去结算</div>
            </div>
            <div v-else class="payment" @click="btnToCheck">去结算</div>
        </div>
    </div>
</template>

<script>
import CountDown from './reverseTime'
import { transDay, strDateFormat } from '@/js/dateUtils.js'
export default {
    data() {
        return {
            continuePay: false,
            orderDetailFlag: false,
            expireTime: '',
            ticketDetail: {
                ticket: {
                    movieName: '',
                    ticketNum: 0,
                    startPlanShow: '',
                    language: '',
                    showEffect: '',
                    hallName: '',
                    ticketDescribe: ''
                },
                cinemaName: '',
                mobile: '',
                totalAmount: ''
            },
            comp_merInfo: [],
            allPrice: 0,
            orignalAmount: 0,
            totalAmount: 0,
            autoUnlockDatetimeStr: '',
            seatList: [],
            merList: [],
            merchaiseList: [],
            isSellPath: false,
            cinemaName: ''
        }
    },
    created() {
        setTitle('结算')
        if (this.$route.query.continuePay) {
            this.continuePay = true
        }
        if (this.$route.query.path === 'sellPath') {
            this.isSellPath = true
        }
        this.getQueryOrderDetail()
    },
    methods: {
        btnShowOrder() {
            this.orderDetailFlag = !this.orderDetailFlag
        },
        // 根据订单ID查询订单
        getQueryOrderDetail() {
            let self = this
            let orderId = this.$route.query.orderId
            self.$axios
                .post('order_queryOrderDetail', { orderId: orderId })
                .then(
                    res => {
                        console.log('查询订单详情---res')
                        console.log(res)
                        self.ticketDetail = res.data
                        self.totalAmount = res.data.totalAmount
                        if (res.data.cinemaName) {
                            self.cinemaName = res.data.cinemaName
                        }
                        if (res.data.ticket) {
                            self.autoUnlockDatetimeStr =
                                res.data.ticket.autoUnlockDatetimeStr
                            res.data.ticket.seatCodeList.map((item, index) => {
                                self.seatList.push({
                                    seatCode: item
                                })
                            })
                        }
                        if (res.data.merchaiseList) {
                            self.merchaiseList = res.data.merchaiseList
                        }
                    },
                    err => {
                        console.log('查询订单详情---err')
                        console.log(err)
                        self.$MessageAlert(err.msg)
                    }
                )
        },
        // 去结算
        btnToCheck() {
            // this.getAppendOrder()
            let orderId = this.$route.query.orderId
            if (this.isSellPath === true) {
                this.$router.push({
                    path: 'confirmpayment',
                    query: { orderId: orderId, path: 'sellPath' }
                })
            } else {
                this.$router.push({
                    path: 'confirmpayment',
                    query: { orderId: orderId }
                })
            }
        },
        cancelBill(orderId) {
            let self = this
            self.$axios.post('order_deleteOrder', { orderId }).then(
                res => {
                    self.$alertCallBack('取消成功', function(cancelRes) {
                        if (self.isSellPath === true) {
                            self.$router.push({ path: '/sell', query: {} })
                        } else {
                            self.$router.push({ path: '/home', query: {} })
                        }
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
        }
    },
    filters: {
        filterDate(dates) {
            let dateStr = ''
            if (dates) {
                let dayObj = transDay(dates)
                let timerStr = strDateFormat(dates, 'hh:mm')
                dateStr = dayObj.week + ' ' + dayObj.dayAli + ' ' + timerStr
            }
            return dateStr
        },
        // 套餐组成
        filterComb(children) {
            let combStr = ''
            if (children) {
                for (let i in children) {
                    if (combStr !== '') {
                        combStr += ','
                    }
                    combStr += children[i].merName + ' X ' + children[i].merNum
                }
            }
            return combStr
        }
    },
    components: { CountDown }
}
</script>

<style lang="scss">
.order {
    margin-bottom: 200px;
    .location{
        width: 750px;
        height: 200px;
        background: #fff;
        margin-bottom: 24px;
        padding-left: 30px;
        box-sizing: border-box;
        .locationArea{
            width: 720px;
            height: 120px;
            border-bottom: 1px solid rgba(223,223,223,1);
            display: flex;
            align-items: center;
            & span:nth-child(1){
                color: #262628;
                font-size: 36px;
                font-weight: 550;
                margin-right: 28px;
            }
            & span:nth-child(2){
                color: #262628;
                font-size: 36px;
            }
            & span:nth-child(3){
                color: #7A797B;
                font-size: 28px;
            }
        }
        .locationTime{
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 80px;
            font-size: 32px;
            padding: 0 30px 0 5px;
            box-sizing: border-box;
        }
    }
    .ticket {
        // overflow: hidden;
        background: #fff;
        width: 750px;
        padding-bottom: 40px;
        box-sizing: border-box;
        text-align: left;
        padding: 25px 30px;
        box-sizing: border-box;
        .ticket-title {
            position: relative;
            padding-left: 20px;
            box-sizing: border-box;
            color: #262628;
            font-size: 28px;
            margin-bottom: 30px;
            &:before {
                position: absolute;
                left: 0;
                top: 0;
                content: '';
                width: 8px;
                height: 28px;
                border-radius: 3px;
                background: #598cff;
            }
        }
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
            color: #f43933;
            margin-bottom: 30px;
        }
        .seatInformation {
            margin-bottom: 20px;
        }
    }
    .mersell {
        // width: 690px;
        background: #fff;
        width: 750px;
        padding-bottom: 40px;
        box-sizing: border-box;
        border-top: 1px solid #dfdfdf;
        text-align: left;
        padding: 25px 30px;
        box-sizing: border-box;
        .mersell-title {
            border-bottom: 1px solid #dfdfdf;
            position: relative;
            padding-left: 20px;
            // line-height: 50px;
            padding-bottom: 20px;
            box-sizing: border-box;
            color: #262628;
            font-size: 28px;
            margin-bottom: 30px;
            &:before {
                position: absolute;
                left: 0;
                top: 0;
                content: '';
                width: 8px;
                height: 28px;
                border-radius: 3px;
                background: #598cff;
            }
        }
        .mersell-title2 {
            border-bottom: 1px solid #dfdfdf;
            position: relative;
            // line-height: 50px;
            padding-bottom: 20px;
            color: #598CFF;
            font-size: 30px;
            margin-bottom: 30px;
        }
        .merLi {
            width: 690px;
            border-bottom: 2px dashed #dfdfdf;
            padding: 10px 0 15px 0;
            box-sizing: border-box;
            .merLi-box {
                color: #262628;
                font-size: 32px;
                display: flex;
                line-height: 60px;
                .boxLeft {
                    width: 380px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .boxCenter {
                    width: 180px;
                }
                .boxRight {
                    width: 120px;
                    text-align: right;
                }
            }
            p {
                color: #9b9b9b;
                font-size: 24px;
                line-height: 35px;
            }
        }
    }
    .middle-phone {
        height: 80px;
        width: 750px;
        background: #fff;
        margin-top: 30px;
        font-size: 28px;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }
    // .hall_detaile {
    //     width: 750px;
    //     background: #fff;
    //     padding: 48px 0 0 30px;
    //     box-sizing: border-box;
    //     text-align: left;
    //     .ticket{
    //         // overflow: hidden;
    //         width: 720px;
    //         padding-bottom: 40px;
    //         box-sizing: border-box;
    //         p {
    //             font-size: 28px;
    //             color: #262628;
    //             margin-bottom: 14px;
    //             .hallName {
    //                 font-size: 36px;
    //                 font-weight: bold;
    //                 margin-right: 20px;
    //             }
    //             .hallNum {
    //                 font-size: 36px;
    //             }
    //         }
    //         .saleTime {
    //             color: #598cff;
    //             margin-bottom: 30px;
    //         }
    //         .seatInformation {
    //             margin-bottom: 20px;
    //         }
    //     }
    //     .mersell{
    //         width: 690px;
    //         .merLi{
    //             width: 690px;
    //             border-bottom: 2px dashed #DFDFDF;
    //             padding: 20px 0 30px 0;
    //             box-sizing: border-box;
    //             .merLi-box{
    //                 color: #262628;
    //                 font-size: 32px;
    //                 display: flex;
    //                 line-height: 60px;
    //                 .boxLeft{
    //                     width: 380px;
    //                     text-overflow: ellipsis;
    //                     overflow: hidden;
    //                     white-space: nowrap;
    //                 }
    //                 .boxCenter{
    //                     width: 180px;
    //                 }
    //                 .boxRight{
    //                     width: 120px;
    //                     text-align: right;
    //                 }
    //             }
    //             p{
    //                 color: #9B9B9B;
    //                 font-size: 24px;
    //                 line-height: 35px;
    //             }
    //         }
    //     }
    //     // div {
    //     //     width: 690px;
    //     //     height: 80px;
    //     //     // line-height: 80px;
    //     //     font-size: 28px;
    //     //     border-bottom: 1px solid #dfdfdf;
    //     // }
    // }
    .fonter {
        position: fixed;
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
