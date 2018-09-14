<template lang="html">
    <div class="member-rechange">
        <div class="rechange-cell">
            <div class="card-top">{{jsonData.cinemaName}}</div>
            <div class="card-info">
                <p class="card-info-p1">会员卡号：{{jsonData.cardNo}}（{{jsonData.cardLevelName}}）</p>
                <p class="card-info-p1">卡余额：{{jsonData.remainMoneyCash}}元 </p>
                <p class="card-info-p2">(基本余额:{{jsonData.remainMoneyCash}}元,赠送余额{{jsonData.remainMoneyCift}}元)</p>
            </div>
        </div>
        <div style="margin-top: 20px;" class="rechange-cell">
            <p class="rechange-top-p">充值金额</p>
            <div class="rechange-top">
                <div class="rechange-top-text">
                    ￥
                </div>
                <input placeholder="请输入金额" v-model="money" class="rechange-top-ipt" type="number">
            </div>
            <div class="rechange-bottom">(单次充值限额¥100-500)</div>
        </div>
        <div>
            <mt-radio align="right" v-model="value" :options="options"></mt-radio>
        </div>
        <div @click="rechangeBtn" class="rechange-btn">
            充值
        </div>
    </div>
</template>

<script>
import { Radio } from 'mint-ui'
import wx from 'weixin-js-sdk'
export default {

    data() {
        return {
            jsonData: {},
            money: NaN,
            value: 'wechat',
            options: [
                {
                    label: '微信支付',
                    value: 'wechat'
                },
                {
                    label: '支付宝支付',
                    value: 'alipay'
                }
            ],
            order: {}
        }
    },
    created() {
        setTitle('会员卡充值')
        // this.getRechargeOrder()
        console.log('支付--')
        console.log(this.$route.query.jsonStr)
        this.jsonData = JSON.parse(this.$route.query.jsonStr)
    },
    methods: {
        getRechargeOrder() {
            let self = this
            let pars = {}
            console.log('----参数---')
            console.log(this.value)
            // 当前影院编码
            let currentCinema = JSON.parse(sessionStorage.getItem('currentCinema'))
            pars.cardNo = self.jsonData.cardNo
            pars.cinemaCode = currentCinema.cinemaCode
            pars.cardCinemaCode = self.jsonData.cinemaCode
            pars.rechargeAmount = self.money
            console.log(pars)
            // if (window.isNaN(self.money) === true || self.money === '' || self.money === 0) {
            //     self.$MessageAlert('请输入充值金额！')
            //     return false
            // }
            self.$axios.post('order_recharge', pars).then(
                res => {
                    console.log('充值成功')
                    console.log(res)
                    self.order = res.data
                    if (self.value === 'wechat') {
                        console.log('微信充值')
                        self.weixinPayConfig()
                    } else if (self.value === 'alipay') {
                        console.log('支付宝充值')
                        let paymentData = {}
                        paymentData.orderId = self.order.orderId
                        this.$router.push({
                            name: 'alipayPayment',
                            query: paymentData
                        })
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 点击充值
        rechangeBtn() {
            this.getRechargeOrder()
        },
        weixinPayConfig() {
            let self = this
            let cinemaCode = self.jsonData.cinemaCode
            let url = encodeURIComponent(location.href.split('#')[0])
            let paramData = { cinemaCode: cinemaCode, url: url }
            console.log('weixinPayConfig,paramData-->', paramData)
            self.$axios.post('weixin_getConfig', paramData).then(
                res => {
                    console.log(res)
                    wx.config({
                        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        debug: false,
                        // 必填，公众号的唯一标识
                        appId: res.data.appId,
                        // 必填，生成签名的时间戳
                        timestamp: res.data.timestamp,
                        // 必填，生成签名的随机串
                        nonceStr: res.data.noncestr,
                        // 必填，签名
                        signature: res.data.signature,
                        // 必填，需要使用的JS接口列表，所有JS接口列表
                        jsApiList: ['checkJsApi', 'chooseWXPay']
                    })
                    wx.ready(function() {
                        self.getWeixinPay()
                    })
                    wx.error(function(res) {
                        // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                        self.$MessageAlert('wxConfig出错:' + res.errMsg)
                    })
                },
                err => {
                    console.log('错误。。')
                    console.log(err)
                    self.$MessageAlert('jssdk请求出错:' + err.msg)
                }
            )
        },
        getWeixinPay() {
            let self = this
            let paramData = {}
            paramData.orderId = this.order.orderId
            console.log('getWeixinPay,paramData-->', paramData)
            this.$axios.post('pay_weiXinPay', paramData).then(
                res => {
                    console.log('调起支付---res')
                    console.log(res)
                    self.wxPay(res.data)
                },
                err => {
                    console.log('调起支付---err')
                    self.$MessageAlert('出错:' + err.msg)
                }
            )
        },
        // 微信支付--调用支付接口要求返回option信息
        wxPay(option) {
            let self = this
            console.log('wxPay')
            wx.chooseWXPay({
                appId: option.appId,
                nonceStr: option.nonceStr,
                package: option.packageStr,
                paySign: option.paySign,
                signType: option.signType,
                timestamp: option.timeStamp,
                success: function(res) {
                    console.log('支付成功88')
                    console.log(res)
                    if (res.errMsg === 'chooseWXPay:ok') {
                        alert('支付成功')
                        // 支付成功处理逻辑
                        let param = {}
                        param.orderId = self.order.orderId
                        param.payType = '2'
                        self.$router.push({
                            path: 'paymentSuccess',
                            query: param
                        })
                    } else if (res.errMsg === 'chooseWXPay:cancel') {
                        alert('取消支付')
                    } else if (res.errMsg === 'chooseWXPay:fail') {
                        alert('支付失败')
                    }
                }
            })
        }
    },
    components: {
        Radio
    }
}
</script>

<style lang="scss">
.mint-cell-title{
    text-align: left;
}
.member-rechange {
    .rechange-cell{
        width: 750px;
        padding-left: 30px;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
        .card-top{
            width: 720px;
            height: 104px;
            border-bottom: 1px dashed #ccc;
            display: flex;
            align-items: center;
            font-size: 30px;
            color: #262628;
        }
        .card-info{
            width: 720px;
            height: 197px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 24px 0;
            box-sizing: border-box;
            .card-info-p1{
                font-size: 32px;
                color: #262628;
                text-align: left;
            }
            .card-info-p2{
                font-size: 28px;
                color: #ccc;
                text-align: left;
            }
        }
        .rechange-top{
            height: 82px;
            display: flex;
            border-bottom: 1px dashed #ccc;
            // justify-content: space-around;
            .rechange-top-text{
                font-size: 60px;
                color: #000;
            }
        }
        .rechange-top-p{
            height: 70px;
            display: flex;
            align-items: center;
            font-size: 28px;
            color: #262628;
        }
        .rechange-top-ipt{
            height: 62px;
            width: 500px;
            display: flex;
            align-items: center;
            border: none;
            outline: none;
            color: #999999;
            font-size: 36px;
        }
        .rechange-bottom{
            height: 90px;
            padding-top: 25px;
            box-sizing: border-box;
            text-align: left;
        }
    }
    .rechange-btn{
        width: 750px;
        height: 100px;
        background:linear-gradient(304deg,rgba(111,133,255,1) 0%,rgba(84,170,255,1) 100%);
        font-size: 34px;
        color: #fff;
        line-height: 100px;
        text-align: center;
        position: fixed;
        left: 0;
        bottom: 0;
    }
}
</style>
