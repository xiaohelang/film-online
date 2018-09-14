<template>
    <div class="alert">
        <!-- <div class="mask"></div> -->
        <div class="content">
            <p class="pay-title">
                <span class="pay-title-close" @click="closeBtn">X</span>请输入支付密码</p>
            <div class="boxIn">
                <p>&yen;{{memberData.paymentAmount}}</p>
                <div class="memberCard">
                    <img src="static/image/vip.png" alt="">
                    <div>
                        <p>会员卡支付</p>
                        <p>({{memberData.cardNo}},{{memberData.cardLevelName}}:当前余额:{{memberData.cardBanlance}}元)</p>
                    </div>
                </div>
                <div class="boxInput">
                    <div class="passWord" v-for="i in items" :key="i">
                        <span v-if="password[i]"></span>
                    </div>
                </div>
                <div v-show='errorTip' class="errTip">
                    密码输入错误
                </div>
            </div>
            <ul class="keyBoard">
                <li class="keyBoardMunber" v-bind:class="{ noPoint: val === '' }" v-for="val in keys" :key="val" @click="keyUpHandle($event)">{{val}}</li>
                <li class="keyBoardMunber" @click="delHandle">X</li>
            </ul>
        </div>
    </div>
</template>

<script>
const keys = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0]
export default {
    props: {
        memberData: Object,
        isSellPath: false,
        default: () => {
            return {}
        }
    },
    data() {
        return {
            keys: keys(),
            items: [0, 1, 2, 3, 4, 5],
            password: [],
            noPoint: 'noPoint',
            errorTip: ''
        }
    },
    created: function() {
        console.log(this.memberData)
    },
    methods: {
        closeBtn() {
            // 关闭弹框
            this.$emit('memberPayClose')
        },
        // 点击输入
        keyUpHandle(e) {
            if (this.memberData.paymentAmount > this.memberData.cardBanlance) {
                this.$MessageAlert('当前卡余额不足，无法支付')
                return
            }
            let text = e.currentTarget.innerText
            console.log(`输入${text}`)
            let len = this.password.length
            if (!text || len >= 6) return
            this.password.push(text)
            this.getPay()
        },
        // 发送请求
        getPay() {
            if (this.password.length >= 6) {
                console.log(
                    parseInt(this.password.join(' ').replace(/\s/g, ''))
                )
                let self = this
                let paramData = {}
                paramData.cinemaCode = this.memberData.cinemaCode
                paramData.orderId = this.memberData.orderId
                paramData.cardNo = this.memberData.cardNo
                if (!paramData.cardNo) {
                    self.$MessageAlert('会员卡号为空')
                    return
                }
                paramData.cardPass = this.password.join('')
                self.$axios.post('pay_memberCardPay', paramData).then(
                    res => {
                        let param = {}
                        param.orderId = paramData.orderId
                        param.payType = '1'
                        if (self.isSellPath === true) {
                            param.path = 'sellPath'
                            self.$router.push({ path: 'paymentSuccess', query: param })
                        } else {
                            self.$router.push({ path: 'paymentSuccess', query: param })
                        }
                    },
                    err => {
                        this.$emit('memberPayClose')
                        self.$MessageAlert(err.msg)
                    }
                )
            }
            return false
        },
        // 退格
        delHandle() {
            if (this.password.length <= 0) return false
            this.password.pop()
        },
        // 全部清除密码
        clearPasswordHandle() {
            this.password = []
        }
    },
    components: {}
}
</script>

<style lang="scss" >
.alert {
    width: 750px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    // align-items: center;
    justify-content: center;
    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 10;
    }
    .content {
        width: 500px;
        height: 436px;
        background: #fff;
        border-radius: 8px;
        margin-top: 220px!important;
        margin-left: 30px!important;
        // position: absolute;
        // z-index: 999999;
        .pay-title {
            height: 89px;
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #262628;
            border-bottom: 1px solid #dfdfdf;
            .pay-title-close {
                position: absolute;
                left: 30px!important;
                top: 30px!important;
            }
        }
        .boxIn {
            padding: 0 35px;
            box-sizing: border-box;
            > p {
                width: 428px;
                height: 89px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 1px solid #dfdfdf;
                color: #f43933;
                font-size: 36px;
            }
            .memberCard {
                width: 428px;
                height: 128px;
                display: flex;
                align-items: center;
                img {
                    width: 52px;
                    margin-right: 26px;
                }
                div {
                    p:nth-child(1) {
                        color: #262628;
                        font-size: 32px;
                        float: left;
                        margin-bottom: 10px;
                    }
                    p:nth-child(2) {
                        color: #9b9b9b;
                        font-size: 24px;
                        float: left;
                    }
                }
            }
            .boxInput {
                display: flex;
                border: 1px solid #dfdfdf;
                width: 428px;
                border-radius: 8px;
                overflow: hidden;
                .passWord {
                    width: 70px;
                    height: 70px;
                    line-height: 70px;
                    border-right: 1px solid #dfdfdf;
                    text-align: center;
                    span {
                        width: 20px;
                        height: 20px;
                        border-radius: 10px;
                        display: inline-block;
                        background: #262628;
                    }
                }
                input {
                    width: 70px;
                    height: 70px;
                    border-left: 1px solid #dfdfdf;
                    border-width: 1px;
                    outline: none;
                    text-align: center;
                    font-size: 28px;
                }
            }
            .errTip {
                text-align: left;
                color: #f43933;
                margin-top: 10px;
                font-size: 24px;
            }
        }
        .keyBoard {
            width: 750px;
            height: 440px;
            position: fixed;
            z-index: 20;
            display: flex;
            flex-wrap: wrap;
            left: 0;
            bottom: 0;
            background: rgba(237, 238, 245, 1);
            padding-top: 12px;
            box-sizing: border-box;
            .keyBoardMunber {
                width: 234px;
                height: 92px;
                padding: 0!important;
                margin-left: 12px;
                text-align: center;
                margin-bottom: 0!important;
                border-radius: 10px;
                background: rgba(252, 252, 254, 1);
                color: #262628;
                font-size: 50px;
                line-height: 92px;
                &:active {
                    background: #ccc;
                }
            }
            .noPoint {
                background: rgba(237, 238, 245, 1) !important;
                pointer-events: none;
            }
        }
    }
}
</style>
