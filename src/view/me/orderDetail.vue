<template>
    <div class="details">
        <div class="top_details">
            <div class="top_hall">
                <span>{{orderDetail.cinemaName}}</span>
                <span v-if="orderDetail.orderType == 5" style="display: block;">{{orderDetail.deliveryAddress}}{{orderDetail.deliverySubAddress}}</span>
            </div>
            <!-- <canvas ref="canvas1" class="qrcode"></canvas> -->
            <div class="pick_code">
                <span>取货码：</span>
                <span>{{orderDetail.takeNo}}</span>
            </div>
            <div class="pick_code">
                <span>验证码：</span>
                <span>{{orderDetail.vertifyCode}}</span>
            </div>
            <div class="ticket-detail">
                <div class="detail-title">
                    <div class="detail-title2">订单详情</div>
                </div>
                <div v-if="orderDetail.ticket" class="movie_details">
                    <div class="movie">
                        <span class="name">{{orderDetail.ticket.movieName}}</span>
                        <span>{{orderDetail.ticket.ticketNum}}张</span>
                    </div>
                    <div class="time3">
                        <span>{{transPlanShowDate(orderDetail.ticket.startPlanShow)}}</span>
                        <span>{{transPlanShowTime(orderDetail.ticket.startPlanShow,orderDetail.ticket.endPlanShow)}}</span>
                    </div>
                    <div class="hall">
                        <span>{{orderDetail.ticket.hallName}}</span>
                        <span>{{orderDetail.ticket.ticketDescribe}}</span>
                    </div>
                </div>
                <ul v-if="orderDetail.merchaiseList" class="mersell">
                    <li v-for="(item, index) in orderDetail.merchaiseList" :key="index" class="merLi">
                        <div class="merLi-box">
                            <div class="boxLeft">{{item.merName}} </div>
                            <div class="boxCenter">数量：{{item.merNum}}</div>
                            <div class="boxRight">¥{{item.merAmount}}</div>
                        </div>
                        <p>{{item.children|filterComb}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="orderDetail.ticket" class="centent_details">
            <div class="order_code">
                <span>订单编码：</span>
                <span>{{orderDetail.orderId}}</span>
                <!-- <span class="copy" :data-clipboard-text="orderDetail.orderId" @click="copy">复制</span> -->
            </div>
            <div class="sale_time">
                <span>交易时间：</span>
                <span>{{orderDetail.tradeTime}}</span>
            </div>
            <div class="total_price">
                <span>总价：</span>
                <span>{{orderDetail.totalAmount}}元</span>
            </div>
        </div>
        <div class="footer_details">
            <div class="left_footer">
                <span class="footer_hall">{{ orderDetail.cinemaName}}</span>
                <span class="footer_addrss">地址：{{cinemaInfo.address}}</span>
                <span class="footer_phone">电话：{{cinemaInfo.contactTel}}</span>
            </div>
            <div class="right_footer">
                <img src="../../../static/image/iphone.png" alt="" @click="phoneCall">
                <span>致电商家</span>
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'
import Clipboard from 'clipboard'
import { strDateFormat } from '@/js/dateUtils.js'
export default {
    data() {
        return {
            orderDetail: {},
            cinemaInfo: {},
            isSellPath: false
        }
    },
    created: function() {
        if (this.$route.query.path === 'sellPath') {
            // 扫码点餐
            this.isSellPath = true
        }
        this.queryOrderDetail()
    },
    methods: {
        queryOrderDetail() {
            let self = this
            let orderId = this.$route.query.orderId
            self.$axios
                .post('order_queryOrderDetail', { orderId: orderId })
                .then(
                    res => {
                        if (res.data) {
                            if (res.data.takeNo) {
                                res.data.takeNo = res.data.takeNo.substring(
                                    10,
                                    16
                                )
                            }
                            if (res.data.vertifyCode) {
                                res.data.vertifyCode = res.data.vertifyCode.substring(
                                    10,
                                    16
                                )
                            }
                            // if (res.data.takeNo && res.data.vertifyCode) {
                            //     res.data.qrCodeStr =
                            //         res.data.takeNo + res.data.vertifyCode
                            // }
                        }
                        self.orderDetail = res.data
                        self.getCinemaInfoByCode(res.data.cinemaCode)
                    },
                    err => {
                        self.$MessageAlert(err.msg)
                    }
                )
        },
        getCinemaInfoByCode(cinemaCode) {
            let self = this
            self.$axios.post('cinema_getCinemaInfoByCode', { cinemaCode }).then(
                res => {
                    self.cinemaInfo = res.data
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 放映日期
        transPlanShowDate(startPlanShow) {
            return strDateFormat(startPlanShow, 'MM月dd日')
        },
        // 放映开始时间 、结束时间
        transPlanShowTime(startPlanShow, endPlanShow) {
            let starTime = strDateFormat(startPlanShow, 'hh:mm')
            let endTime = strDateFormat(endPlanShow, 'hh:mm')
            return starTime + ' - ' + endTime
        },
        qrCode(takeNo) {
            let self = this
            if (takeNo) {
                QRCode.toCanvas(
                    self.$refs.canvas1,
                    takeNo,
                    {
                        width: 150,
                        height: 150
                        // color: {
                        // dark: '#aaa' // Blue dots
                        // // light: '#0000', // Transparent background
                        // // background: "#ffffff" //背景颜色
                        // }
                    },
                    function(error) {
                        if (error) console.error(error)
                        console.log('success!')
                    }
                )
            }
        },
        phoneCall: function() {
            let contactTel = this.cinemaInfo.contactTel
            if (contactTel) {
                window.location.href = 'tel:' + contactTel
            }
        },
        copy() {
            let self = this
            let clipboard = new Clipboard('.copy')
            clipboard.on('success', e => {
                console.log('复制成功', e.text)
                // 这里你如果引入了elementui的提示就可以用，没有就注释即可
                // success(e)
                // console.log('e-->', e)
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                console.log('该浏览器不支持自动复制')
                self.$MessageAlert('复制失败')
                // 释放内存
                clipboard.destroy()
            })
        }
    },
    filters: {
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
    components: {
        QRCode
    }
}
</script>

<style lang="scss">
.details {
    padding: 30px 30px 46px 30px;
    box-sizing: border-box;
    .top_details {
        width: 690px;
        background: #fff;
        // background: url('./static/image/CombinedShape.png') no-repeat;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
        // background-size: 100% 100%;
        margin-bottom: 20px;
        .top_hall {
            width: 690px;
            // height: 80px;
            line-height: 80px;
            color: #fff;
            font-size: 32px;
            background: linear-gradient(
                -131.8deg,
                rgba(99, 134, 255, 1),
                rgba(84, 170, 255, 1)
            );
        }
        .qr_code {
            margin-top: 40px;
            display: inline-block;
            margin-bottom: 26px;
        }
        .pick_code {
            margin-top: 30px;
            // height: 60px;
            line-height: 60px;
            font-size: 44px;
            color: #262628;
            margin-bottom: 30px;
        }
        .ticket-detail {
            width: 650px;
            border-bottom: 1px solid #dfdfdf;
            margin-left: 20px;
            .detail-title {
                height: 50px;
                border-bottom: 1px solid #dfdfdf;
                .detail-title2 {
                    text-align: left;
                    border-left: 8px solid #598cff;
                    padding-left: 10px;
                    line-height: 30px;
                    height: 30px;
                    font-size: 28px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    color: #262628;
                }
            }
            .movie_details {
                box-sizing: border-box;
                margin: 35px 20px 0 20px;
                text-align: left;
                .movie {
                    height: 44px;
                    line-height: 44px;
                    font-size: 32px;
                    color: #262628;
                    margin-bottom: 12px;
                    .name {
                        font-weight: 550;
                    }
                }
                .time3 {
                    font-size: 28px;
                    height: 40px;
                    line-height: 40px;
                    color: #f43933;
                }
                .hall {
                    font-size: 28px;
                    height: 40px;
                    line-height: 40px;
                    color: #7a797b;
                }
            }
            .mersell {
                width: 650px;
                .merLi {
                    width: 650px;
                    border-top: 2px dashed #dfdfdf;
                    padding: 20px 0 30px 0;
                    box-sizing: border-box;
                    .merLi-box {
                        color: #262628;
                        font-size: 32px;
                        display: flex;
                        line-height: 60px;
                        .boxLeft {
                            width: 360px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            padding-left: 20px;
                            text-align: left;
                            box-sizing: border-box;
                        }
                        .boxCenter {
                            width: 180px;
                            text-align: left;
                        }
                        .boxRight {
                            width: 100px;
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
        }
    }
    .centent_details {
        width: 690px;
        background: #fff;
        padding: 30px 0;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
        .order_code {
            font-size: 28px;
            color: #7a797b;
            margin-left: 60px;
            text-align: left;
            span {
                height: 40px;
                line-height: 40px;
            }
            .copy {
                margin-left: 16px;
                color: #0035a4;
            }
        }
        .sale_time {
            font-size: 28px;
            color: #7a797b;
            margin-left: 60px;
            text-align: left;
            span {
                height: 40px;
                line-height: 40px;
            }
        }
        .total_price {
            font-size: 28px;
            color: #7a797b;
            margin-left: 60px;
            text-align: left;
            span {
                height: 40px;
                line-height: 40px;
            }
        }

        .title {
            height: 80px;
            line-height: 80px;
            margin-left: 40px;
            text-align: left;
            box-sizing: border-box;
            border-bottom: 1px solid #dfdfdf;
        }
    }
    .combo_details {
        background: #fff;
        text-align: left;
        ul {
            margin-top: 0;
            li {
                // height: 121px;
                border-top: 1px dashed #dfdfdf;
                margin: 0 20px;
                padding: 30px 0 30px 20px;
                box-sizing: border-box;
                .combo {
                    font-size: 32px;
                    color: #262628;
                    height: 44px;
                    line-height: 44px;
                }
                .detail {
                    font-size: 24px;
                    color: #9b9b9b;
                    height: 40px;
                    line-height: 28px;
                }
            }
        }
    }
    .footer_details {
        margin-top: 20px;
        height: 280px;
        background: #fff;
        display: flex;
        padding: 46px 48px 40px 40px;
        box-sizing: border-box;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
        .left_footer {
            display: flex;
            flex-flow: column;
            text-align: left;
            width: 416px;
            padding-right: 28px;
            border-right: 1px solid #dfdfdf;
            .footer_hall {
                font-size: 32px;
                color: #262628;
                height: 44px;
                line-height: 44px;
                margin-bottom: 18px;
            }
            .footer_addrss {
                font-size: 28px;
                color: #7a797b;
                margin-bottom: 12px;
                line-height: 44px;
            }
            .footer_phone {
                font-size: 28px;
                color: #7a797b;
            }
        }
        .right_footer {
            display: flex;
            flex-flow: column;
            margin-left: 45px;
            justify-content: center;
            align-items: center;
            img {
                width: 50px;
                height: 50px;
                margin-bottom: 52px;
            }
            span {
                font-size: 28px;
                color: #7a797b;
                height: 40px;
                line-height: 40px;
            }
        }
    }
}
</style>
