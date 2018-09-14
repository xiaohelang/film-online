<template>
    <div class="menber_code">
        <div class="menberDetails">
            <div class="menberImg"> <img :src="member.icon" alt=""> </div>
            <div class="menber">
                <span class="menberName">{{ member.nickName }}</span>
                <div>
                    <span>会员积分：</span>
                    <span>{{ member.integral }}</span>
                    <span>分</span>
                </div>
                <div>
                    <span>会员手机：</span>
                    <span>{{ member.mobile }}</span>
                </div>
            </div>
        </div>
        <div class="menberCode">
            <div v-if="haveCard" class="menberContent">
                <div class="cart" @click="toSetCard">
                    <div class="cart-title">当前会员卡</div>
                    <div class="cart-list">
                        <span>{{defaultCard.cardLevelName}}</span>
                        <span v-show="isShowMemberCardSelect">></span>
                    </div>
                </div>
                <div class="box-space"></div>
                <img alt="条码" id="barCode" class="bar_code">
                <canvas id="canvas" ref="canvas" class="qrcode"></canvas>
                <p class="secrecy">该码可用于影院会员卡到店消费使用</p>
                <div class="notice"> <img src="" alt="">
                    <span>（请勿转发给他人）</span>
                </div>
            </div>
            <div v-else  class="defaultPage" > <img src="static/image/menberCode.png" alt="">
                <span>您还未开通会员卡，会员卡购票更优惠</span>
            </div>
        </div>
        <div v-if="isShow" @click="closeWrap" class="modeWarp">
            <div class="warpBox">
                <div class="warpBoxTitle">选择会员卡</div>
                <div class="warpBoxIn">
                    <div class="boxInAll" >
                        <div class="boxInAllCell" v-for="(item, index) in cardList" :key="index">
                            <div class="cellLeft">
                                <p class="cellLeft-p1">家庭优惠银卡(13544323776)</p>
                                <p class="cellLeft-p2">卡余额：6200元</p>
                                <p class="cellLeft-p2">(卡余额：6200元,卡余额：6200元)</p>
                            </div>
                            <div class="cellRight">
                                <input type="radio" :id="item.id" name="sex" />
                                <label :for="item.id"></label>
                                <!-- <label></label> -->
                            </div>
                        </div>
                        <!-- <div class="boxInAllCell">
                            <div class="cellLeft">
                                <p class="cellLeft-p1">家庭优惠银卡(13544323776)</p>
                                <p class="cellLeft-p2">卡余额：6200元</p>
                                <p class="cellLeft-p2">(卡余额：6200元,卡余额：6200元)</p>
                            </div>
                            <div class="cellRight">
                                <input type="radio" id="female2" name="sex" />
                                <label for="female2"></label>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'
// import '@/js/jquery.qrcode.min.js'
import '@/js/JsBarcode.all.min.js'
export default {
    data() {
        return {
            haveCard: true,
            member: {},
            defaultCard: {},
            isShow: false,
            cardList: [
                {id: 1},
                {id: 2},
                {id: 3},
                {id: 4},
                {id: 5}
            ]
        }
    },
    created() {
        setTitle('会员码')
        this.getMemberInfo()
    },
    computed: {
        isShowMemberCardSelect() {
            return (this.member && this.member.cardCount > 1)
        }
    },
    methods: {
        navClick() {
            console.log('点击了我的页面')
        },
        // 设置卡
        toSetCard() {
            // this.$router.push({
            //     path: 'membercard'
            // })
            this.isShow = true
        },
        // 关闭蒙层
        closeWrap(e) {
            if (e.target.className === 'modeWarp') {
                this.isShow = false
            }
        },
        getMemberInfo() {
            console.log('会员信息')
            let paramData = {}
            let self = this
            self.$axios.post('member_getInfo', paramData).then(
                res => {
                    console.log(res)
                    res.data.ticketCount = res.data.ticketCount
                        ? res.data.ticketCount
                        : 0
                    res.data.icon = res.data.icon
                        ? res.data.icon
                        : '../../../static/image/success.png'
                    if (res.data.cardList && res.data.cardList.length > 0) {
                        res.data.cardCount = res.data.cardList.length
                        self.defaultCard = res.data.cardList[0]
                        self.haveCard = true
                        for (let i in res.data.cardList) {
                            if (res.data.cardList[i].isDefaultCard === 1) {
                                self.defaultCard = res.data.cardList[i]
                                break
                            }
                        }
                        let cardNo = self.defaultCard.cardNo
                        if (cardNo) {
                            self.qrCode(cardNo)
                            self.barcode(cardNo)
                        }
                    } else {
                        res.data.cardCount = 0
                        self.defaultCard = {}
                        self.haveCard = false
                    }
                    console.log(res)
                    self.member = res.data
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        qrCode(cardNo) {
            let self = this
            if (cardNo) {
                QRCode.toCanvas(
                    self.$refs.canvas,
                    cardNo,
                    {
                        width: 250,
                        height: 250
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
        barcode(cardNo) {
            JsBarcode('#barCode', cardNo, {
                width: 88,
                height: 598,
                displayValue: false
            })
        }
    },
    components: {
        QRCode
    }
}
</script>

<style lang="scss">
.menber_code {
    .menberDetails {
        border-bottom: 1px solid #dfdfdf;
        height: 240px;
        background: #fff;
        display: flex;
        padding: 60px 0 60px 32px;
        margin-bottom: 20px;
        box-sizing: border-box;
        .menberImg {
            width: 120px;
            height: 120px;
            margin-right: 32px;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .menber {
            text-align: left;
            .menberName {
                font-size: 34px;
                color: #262628;
                font-weight: 550;
                height: 48px;
                line-height: 48px;
                display: block;
                margin-bottom: 8px;
            }
            div {
                font-size: 24px;
                color: #858486;
                span {
                    height: 34px;
                    line-height: 34px;
                }
            }
        }
    }
    .menberCode {
        background: #fff;
        height: 946px;
        .defaultPage {
            border-bottom: 1px solid #dfdfdf;
            display: flex;
            flex-flow: column;
            height: 100%;
            align-items: center;
            justify-content: center;
            img {
                width: 360px;
                height: 336px;
                margin-bottom: 80px;
            }
            span {
                font-size: 32px;
                color: #7a797b;
                height: 44px;
                line-height: 44px;
            }
        }
        .menberContent {
            .cart {
                height: 88px;
                border-bottom: 1px solid #dfdfdf;
                border-top: 1px solid #dfdfdf;
                display: flex;
                align-items: center;
                padding: 0 30px;
                box-sizing: border-box;
                justify-content: space-between;
                font-size: 32px;
                .cart-title{
                    color: #262628;
                }
                .cart-list{
                    color: #9B9B9B;
                }
            }
            .box-space{
                width: 750px;
                height: 20px;
                background: #f7f7f7;
                border-bottom: 1px solid #dfdfdf;
            }
            // .bar {
            //     height: 20px;
            //     background: #f7f7f7;
            // }
            .bar_code {
                height: 88px;
                width: 598px;
                margin-top: 80px;
            }
            .qrCoder {
                height: 614px;
                margin-bottom: 32px;
                margin-top: 84px;
            }
            .secrecy {
                font-size: 32px;
                color: #262628;
                font-weight: 550;
                height: 44px;
                line-height: 44px;
                margin-bottom: 14px;
            }
            .notice {
                font-size: 32px;
                color: #ff001f;
                font-weight: 550;
                height: 44px;
                line-height: 44px;
            }
        }
    }
    .modeWarp{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 9;
        background: rgba( 0, 0, 0, 0.5);
        .warpBox{
            width: 624px;
            height: 704px;
            overflow: hidden;
            background: #fff;
            margin: auto;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border-radius: 8px;
            .warpBoxTitle{
                width: 100%;
                height: 88px;
                text-align: center;
                line-height: 88px;
                font-size: 32px;
                color: #4A4A4A;
                border-bottom: 1px solid rgba(223,223,223,1);
            }
            .warpBoxIn{
                width: 100%;
                height: 614px;
                overflow: auto;
                .boxInAll{
                    width: 100%;
                    padding: 0 30px;
                    box-sizing: border-box;
                    min-height: 614px;
                    .boxInAllCell{
                        width: 100%;
                        height: 150px;
                        display: flex;
                        padding: 18px 0;
                        box-sizing: border-box;
                        border-bottom: 1px solid rgba(223,223,223,1);
                        .cellLeft{
                            width: 500px;
                            height: 100%;
                            display: flex;
                            justify-content: space-around;
                            flex-direction: column;
                            text-align: left;
                            .cellLeft-p1{
                                font-size: 32px;
                                color: #262628;
                            }
                            .cellLeft-p2{
                                font-size: 26px;
                                color: #9B9B9B;
                            }
                        }
                        .cellRight{
                            width: 65px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            // background: green;
                            &>input[type="radio"] + label::before {
                                content: ""; /*不换行空格*/
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 18px;
                                width: 40px;
                                height: 40px;
                                margin-right: .4em;
                                border-radius: 50%;
                                border: 2px solid rgba(194,196,202,1);
                                text-indent: .15em;
                                line-height: 1;
                            }
                            &>input[type="radio"]:checked + label::before {
                                background-color: #5B8EFF;
                                background-clip: content-box;
                                padding: .25em;
                                box-sizing: border-box;
                            }
                            &>input[type="radio"] {
                                position: absolute;
                                clip: rect(0, 0, 0, 0);
                                // opacity: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
