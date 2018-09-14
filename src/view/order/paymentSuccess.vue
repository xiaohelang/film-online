<template>
    <div class="success">
        <div class="paymentPrice">
            <div class="img"> <img src="../../../static/image/success.png" alt=""> </div>
            <p> 支付成功 </p>
            <p>&yen;{{ order.totalAmount}}</p>
            <!-- <p class="gary">
                <span>本次消费成功积分:</span>
                <span> {{ order.pointer }} </span>
            </p> -->
        </div>
        <div class="paymentInfo">
            <!-- <p>
                <span>优惠明细</span>
                <span> {{ order.discountName }} </span>
                <span class="red"> &yen;{{ order.discountPrice }} </span>
            </p> -->
            <p>
                <span>付款方式</span>
                <span> {{ transPayType() }} </span>
                <span> &yen;{{ order.totalAmount }} </span>
            </p>
        </div>
        <div class="details">
            <!-- <canvas  ref="canvas" class="qrcode"></canvas> -->
            <div class="pick_code"> 取货码：{{ order.takeNo }} </div>
            <div class="pick_code"> 验证码：{{ order.vertifyCode }} </div>
        </div>
        <!-- 完成buttom -->
        <div class="forter" @click="goHome">
            <button>返回首页</button>
        </div>
        <div class="forter2" @click="goOrderDetail">
            <button>订单详情</button>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
    data() {
        return {
            order: {},
            isSellPath: false
        }
    },
    created() {
        if (this.$route.query.path === 'sellPath') {
            this.isSellPath = true
        }
        this.getQueryOrderDetail()
    },
    methods: {
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
                            if (res.data.takeNo && res.data.vertifyCode) {
                                res.data.qrCodeStr =
                                    res.data.takeNo + res.data.vertifyCode
                            }
                            res.data.totalAmount = parseFloat(
                                res.data.totalAmount
                            ).toFixed(2)
                        }
                        self.order = res.data
                        self.qrCode(res.data.takeNo)
                        console.log('self.order--->', self.order)
                    },
                    err => {
                        console.log('查询订单详情---err')
                        console.log(err)
                        self.$MessageAlert(err.msg)
                    }
                )
        },
        transPayType() {
            let payType = this.$route.query.payType
            console.log('payType', payType)
            if (payType === '1') {
                return '会员支付'
            } else if (payType === '2') {
                return '微信支付'
            } else if (payType === '3') {
                return '支付宝支付'
            }
        },
        goHome() {
            if (this.isSellPath === true) {
                this.$router.push({path: '/sell', query: { path: 'sellPath' }})
            } else {
                this.$router.push({ path: '/home', query: {} })
            }
        },
        goOrderDetail() {
            let orderId = this.order.orderId
            if (orderId) {
                if (this.isSellPath === true) {
                    this.$router.push({path: '/orderDetail', query: { orderId: orderId, path: 'sellPath' }})
                } else {
                    this.$router.push({ path: '/orderDetail', query: { orderId: orderId } })
                }
            }
        },
        qrCode(takeNo) {
            let self = this
            if (takeNo) {
                QRCode.toCanvas(
                    self.$refs.canvas,
                    takeNo,
                    {
                        width: 180,
                        height: 180
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
        }
    },
    components: { QRCode }
}
</script>

<style lang="scss">
.success {
    width: 750px;
    height: 100%;
    background: #fff;
    padding: 0 30px;
    box-sizing: border-box;
    .paymentPrice {
        height: 470px;
        padding-top: 80px;
        box-sizing: border-box;
        font-size: 32px;
        color: #262628;
        .img {
            width: 170px;
            height: 170px;
            display: inline-block;
            margin-bottom: 30px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        p {
            margin-bottom: 8px;
        }
        .gary {
            font-size: 28px;
            color: #9b9b9b;
        }
    }
    .paymentInfo {
        height: 121px;
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        padding: 20px 0;
        box-sizing: border-box;
        font-size: 28px;
        display: flex;
        align-items: center;
        p {
            height: 45px;
            line-height: 45px;
            display: flex;
            align-items: center;
            margin-left: 34px;
            span {
                width: 230px;
                text-align: left;
            }
        }
    }
    .details {
        height: 449px;
        font-size: 36px;
        color: #598cff;
        .qrcode {
            height: 351px;
        }
    }
    .pick_code {
        margin-top: 30px;
        // height: 60px;
        line-height: 60px;
        font-size: 44px;
        color: #262628;
        margin-bottom: 30px;
    }
    .forter {
        height: 100px;
        button {
            width: 690px;
            height: 84px;
            background: linear-gradient(
                -124.3deg,
                rgba(111, 133, 255, 1),
                rgba(84, 170, 255, 1)
            );
            border-radius: 8px;
            border: 0;
            font-size: 34px;
            color: #ffffff;
        }
    }
    .forter2 {
        height: 100px;
        button {
            width: 690px;
            height: 84px;
            background: #fff;
            border-radius: 8px;
            border: 0;
            border: 1px solid #d9d9d9;
            font-size: 34px;
            color: #262628;
        }
    }
}
.red {
    color: #f43933;
}
</style>
