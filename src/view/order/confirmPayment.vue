<template>
    <div class="payment">
        <CountDown v-if="expireTime" :expireTime="expireTime" :callback="dealExipirtBill"></CountDown>
        <!-- 支付金额 -->
        <div class="totalAmount">
            <span>支付金额：</span>
            <span style="color: #F43933">&yen;</span>
            <h2 class="price">{{order.totalAmount}}</h2>
        </div>
        <!-- 支付方式 -->
        <div class="parmentMethod">
            <ul>
                <li v-for="(data, index) in payType" :key="index" :class="{ 'br': payType.length - 1 === index }">
                    <div>
                        <div class="url"> <img :src="data.url" alt=""> </div>
                        <div class="method">
                            <span :class="{ 'lh': data.value != 'vip'}"> {{ data.name }} </span>
                            <span v-show="data.value=='vip'" class="vipPrice"> {{ memberCardBanlance }} </span>
                        </div>
                    </div>
                    <div class="checked">
                        <span class="radio" :class="{ 'checkOn': data.isChecked }"></span>
                        <input class="input_radio" type="radio" name="payType" :value="data.value" :checked="data.isChecked" @change="payTypeChange(index)">
                    </div>
                </li>
            </ul>
        </div>
        <!-- 确认支付按钮 -->
        <div class="foter">
            <button @click="btnPayment">确认支付</button>
        </div>

        <!-- 支付确认弹框 -->
        <MemberPay v-if="openMemberPay" :isSellPath="isSellPath" :memberData="memberData" @memberPayClose="closeMemberPay"></MemberPay>
    </div>
</template>

<script>
import MemberPay from './memberPay'
import CountDown from './reverseTime'
import wx from 'weixin-js-sdk'
export default {
    data() {
        return {
            openMemberPay: false,
            order: {},
            expireTime: '',
            memberCardBanlance: '',
            payType: [],
            alertData: {
                url: '../../../static/image/warning.png',
                contetn: '返回后，已选座位将不会保留',
                leftBtn: '重新选座',
                rightBtn: '内容继续下单'
            },
            memberData: {},
            isSellPath: false
        }
    },
    created() {
        setTitle('支付')
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
                        if (res.data.orderStatus === 2) {
                            self.$alertCallBack('订单已结束', function(
                                cancelRes
                            ) {
                                if (self.isSellPath === true) {
                                    self.$router.push({path: '/sell', query: { path: 'sellPath' }})
                                } else {
                                    self.$router.push({ path: '/home', query: {} })
                                }
                            })
                        }
                        if (res.data.ticket) {
                            self.expireTime =
                                res.data.ticket.autoUnlockDatetimeStr
                        }
                        self.order = res.data
                        this.getPayType()
                        console.log('self.order--->', self.order)
                    },
                    err => {
                        console.log('查询订单详情---err')
                        console.log(err)
                        self.$MessageAlert(err.msg)
                    }
                )
        },
        // 支付方式
        getPayType() {
            let self = this
            let cinemaCode = self.order.cinemaCode
            self.payType = []
            self.payType.push({
                value: 'vip',
                name: '会员卡支付',
                isChecked: true,
                url: '../../../static/image/vip.png'
            })
            self.$axios.post('pay_getPayType', { cinemaCode: cinemaCode }).then(
                res => {
                    console.log('pay_getPayType,res.data--->', res.data)
                    if (
                        res.data &&
                        res.data.payTypeList &&
                        res.data.payTypeList.length > 0
                    ) {
                        let payTypeList = res.data.payTypeList
                        for (let i in payTypeList) {
                            if (payTypeList[i] === 2) {
                                self.payType.push({
                                    name: '微信支付',
                                    value: 'wechat',
                                    isChecked: false,
                                    url: '../../../static/image/wechat.png'
                                })
                            }
                            if (payTypeList[i] === 1) {
                                self.payType.push({
                                    value: 'alipay',
                                    name: '支付宝支付',
                                    isChecked: false,
                                    url: '../../../static/image/alipay.png'
                                })
                            }
                        }
                    }
                },
                err => {
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        getMemberInfo() {
            console.log('会员信息')
            let self = this
            if (
                typeof self.order === 'undefined' &&
                typeof self.order.paymentAmount === 'undefined'
            ) {
                self.$MessageAlert('找不到订单')
                return
            } else if (self.order.paymentAmount <= 0) {
                self.$MessageAlert('结算金额需大于零')
                return
            }
            let paramData = {}
            self.$axios.post('member_getInfo', paramData).then(
                res => {
                    console.log(res)
                    if (res.data.mobile == null || res.data.mobile === '') {
                        self.needBindingPhone = true
                    } else {
                        self.needBindingPhone = false
                    }
                    if (res.data.cardList && res.data.cardList.length > 0) {
                        res.data.cardCount = res.data.cardList.length
                        let defaultCard = res.data.cardList[0]
                        for (let i in res.data.cardList) {
                            if (res.data.cardList[i].isDefaultCard === 1) {
                                defaultCard = res.data.cardList[i]
                                break
                            }
                        }
                        if (
                            typeof defaultCard === 'undefined' ||
                            defaultCard === null
                        ) {
                            self.$MessageAlert('手机号没有默认会员卡')
                            return
                        } else if (defaultCard.consumptionType === '1') {
                            // 会员卡消费类型限制 0：全部，1：影票,2：卖品
                            if (
                                self.order.merchaiseList &&
                                self.order.merchaiseList.length > 0
                            ) {
                                self.$MessageAlert('默认会员卡只能购买影票')
                                return
                            }
                        } else if (defaultCard.consumptionType === '2') {
                            if (self.order.ticket) {
                                self.$MessageAlert('默认会员卡只能购买卖品')
                                return
                            }
                        }
                        self.openMemberPay = true
                        let paymentData = {}
                        paymentData.cinemaCode = self.order.cinemaCode
                        paymentData.orderId = self.order.orderId
                        paymentData.paymentAmount = self.order.totalAmount
                        paymentData.cardNo = defaultCard.cardNo
                        paymentData.cardBanlance = defaultCard.remainMoney
                        paymentData.cardLevelName = defaultCard.cardLevelName
                        // self.memberCardBanlance = '(钻卡：当前余额：10元)'
                        this.memberData = paymentData
                    } else {
                        self.$MessageAlert('手机号没有默认会员卡')
                    }
                    // console.log('memberInfo-->', res.data)
                    // sessionStorage.setItem('memberInfo', JSON.stringify(res.data))
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    alert('获取会员信息失败')
                    self.$MessageAlert(err.msg)
                }
            )
        },
        /**
         * 支付方式更改
         */
        payTypeChange(index) {
            this.payType.map((v, i) => {
                if (i === index) {
                    v.isChecked = true
                } else {
                    v.isChecked = false
                }
            })
        },
        /**
         * 确认支付操作
         */
        btnPayment() {
            this.payType.map((v, i) => {
                if (v.isChecked) {
                    console.log('被选中的值为:' + v.value)
                    if (v.value === 'vip') {
                        //  会员支付
                        this.getMemberInfo()
                    } else if (v.value === 'wechat') {
                        this.weixinPayConfig()
                    } else if (v.value === 'alipay') {
                        // 支付宝支付
                        // alert('开发中')
                        // this.$MessageAlert('开发中')
                        // return
                        let paymentData = {}
                        paymentData.orderId = this.$route.query.orderId
                        this.$router.push({
                            name: 'alipayPayment',
                            query: paymentData
                        })
                    }
                }
            })
        },
        weixinPayConfig() {
            let self = this
            let cinemaCode = self.order.cinemaCode
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
            paramData.orderId = this.$route.query.orderId
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
                        if (self.isSellPath === true) {
                            param.path = 'sellPath'
                            self.$router.push({
                                path: 'paymentSuccess',
                                query: param
                            })
                        } else {
                            self.$router.push({
                                path: 'paymentSuccess',
                                query: param
                            })
                        }
                    } else if (res.errMsg === 'chooseWXPay:cancel') {
                        alert('取消支付')
                    } else if (res.errMsg === 'chooseWXPay:fail') {
                        alert('支付失败')
                    }
                }
            })
        },
        /**
         * 关闭弹框
         */
        closeMemberPay(memParam) {
            this.openMemberPay = false
        },
        btnTrue(...data) {
            // 下一步操作
            if (data[0].alertNum === 1) {
                this.$router.push({ name: 'success', params: {} })
                this.alertFalse = false
            }
        },
        getParams() {
            this.console.log(this.$route.params, 'params')
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
    watch: {
        // 监听路由变化 获取路由参数
        $route: 'getParams'
    },
    components: {
        CountDown,
        MemberPay
    }
}
</script>

<style lang="scss">
.payment {
    .totalAmount {
        width: 750px;
        height: 176px;
        line-height: 176px;
        background: #fff;
        font-size: 32px;
        color: #4a4a4a;
        display: flex;
        justify-content: center;
        margin-bottom: 32px;
        .price {
            font-size: 56px;
            color: #f43933;
        }
    }
    .parmentMethod {
        width: 750px;
        // height: 408px;
        background: #fff;
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        text-align: left;
        ul {
            width: 750px;
            padding-left: 30px;
            box-sizing: border-box;
            li {
                width: 720px;
                height: 136px;
                padding-right: 30px;
                box-sizing: border-box;
                align-items: center;
                display: flex;
                justify-content: space-between;
                font-size: 32px;
                color: #262628;
                border-bottom: 1px solid #dfdfdf;
                div {
                    display: flex;
                    align-items: center;
                    .url {
                        width: 52px;
                        height: 52px;
                        margin-right: 28px;
                        img {
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                        }
                    }
                    .method {
                        display: flex;
                        flex-flow: column;
                        align-items: flex-start;
                        .vipPrice {
                            font-size: 24px;
                            color: #9b9b9b;
                        }
                    }
                }
                .checked {
                    // margin-right: 30px;
                    position: relative;
                    .radio {
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        vertical-align: middle;
                        cursor: pointer;
                        background: url('./static/image/default.png') no-repeat
                            center;
                        background-size: cover;
                    }
                    .checkOn {
                        background: url('./static/image/normal.png') no-repeat
                            center;
                        background-size: cover;
                        background-position: 6px 0px;
                        width: 56px;
                        height: 56px;
                    }
                    .input_radio {
                        display: inline-block;
                        position: absolute;
                        opacity: 0;
                        width: 40px;
                        height: 40px;
                        left: 12px;
                        cursor: pointer;
                        outline: none;
                        -webkit-appearance: none;
                    }
                }
            }
        }
    }
    .foter {
        position: fixed;
        bottom: 0;
        left: 0;
        button {
            width: 750px;
            height: 100px;
            border: 0;
            font-size: 34px;
            color: #fff;
            background: linear-gradient(
                -124.3deg,
                rgba(111, 133, 255, 1),
                rgba(84, 170, 255, 1)
            );
        }
    }
}

.lh {
    height: 48px;
    line-height: 48px;
    display: inline-block;
}
.dr {
    display: none !important;
}
.br {
    border-bottom: 0 !important;
}
</style>
