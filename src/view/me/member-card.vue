<template lang="html">
    <div>
        <ul class="all-card"  v-if="cardList.length !== 0">
            <li v-for="(item, index) in cardList" :key="index" @click="toDetail">
                <div class="card-title">
                    <div class="card-left">
                        <img style="width: 0.3rem; height: 0.3rem; margin-right: 0.1rem;" src="static/image/card/card-move.png" alt="">
                        <!-- <p>广州超级万达国际影城(天河店9999999)</p> -->
                        <p>{{item.cinemaName}}</p>
                        <!-- <div>金卡</div> -->
                        <div>{{item.cardLevelName}}</div>
                    </div>
                    <div class="card-right">{{item.cardLevelType == 0? '储值卡' : '权益卡'}}</div>
                </div>
                <!-- <p class="card-p1">4002 8888 3455</p> -->
                <p class="card-p1">{{item.cardNo}}</p>
                <!-- <p class="card-p2">500元</p> -->
                <p v-if="item.cardLevelType == 0" class="card-p2">{{item.remainMoneyCash +item.remainMoneyCift}}元 <span @click.stop="rechargeBtn(item)" class="rechargeBtn">充值</span> </p>
                <p v-if="item.cardLevelType == 0" class="card-p3">（基本余额：{{item.remainMoneyCash}}元，赠送余额：{{item.remainMoneyCift}}元）</p>
                <div class="card-but">
                    <div class="but-left" v-if="item.cardValidDate !=null">{{item.cardValidDate|filterTime}}到期</div>
                    <div class="but-left" v-if="item.cardValidDate ==null">长期有效</div>
                    <div v-if="item.isDefaultCard ==1" class="but-right">默认</div>
                    <div v-if="item.isDefaultCard ==0" @click="setCard(item)" class="but-right">设置为默认卡</div>
                    <div v-if="false" class="but-warp"></div>
                </div>
                <div v-if="item.overdue == 1 && item.reCardStatus != 0" class="li-warp">
                    <img src="static/image/card/over.png" alt="">
                </div>
                <!-- <div v-if="item.overdue == 0 && item.reCardStatus != 0" class="li-warp">
                    <img src="static/image/card/over.png" alt="">
                </div> -->
                <div v-if="item.reCardStatus == -1" class="li-warp">
                    <img src="static/image/card/card-off.png" alt="">
                </div>
                <div v-if="item.reCardStatus == -2" class="li-warp">
                    <img src="static/image/card/dong.png" alt="">
                </div>
            </li>
        </ul>
        <img v-if="cardList.length === 0" class="no-card" src="static/image/card/no-card.png" alt="">
        <p v-if="cardList.length === 0" class="no-text">您还未开通会员卡，会员卡购票更优惠</p>
        <img @click="addCard" class="addCard" src="static/image/addCard.png" alt="">
    </div>
</template>

<script>
export default {
    data() {
        return {
            cardList: [
                //     {cinemaName: '广州超级万达国际影城(天河店9999999)',
                //     cardLevelName: '金卡',
                //     cardLevelType: 0,
                //     cardNo: '4002 8888 3455',
                //     remainMoneyCash: 3000,
                //     remainMoneyCift: 400,
                //     cardValidDate: '2019-08-09',
                //     isDefaultCard: 0,
                //     overdue: 0
                // }
            ]
        }
    },
    created() {
        setTitle('会员卡')
        this.getCards()
    },
    methods: {
        // 获取会员卡
        getCards() {
            let self = this
            self.$axios.post('member_getCards', {}).then(
                res => {
                    if (res.status.status === 0) {
                        self.cardList = res.data
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        setCard(card) {
            if (card.isDefaultCard === 0 || card.isDefaultCard === '0') {
                let self = this
                self.$MsgConfirm(
                    '确认设置为默认卡？',
                    function() {
                        let cardNo = card.cardNo
                        self.$axios
                            .post('member_setDefaultCard', { cardNo })
                            .then(
                                res => {
                                    console.log('设置默认卡--res')
                                    console.log(res)
                                    if (res.status.status === 0) {
                                        self.getCards()
                                        self.$alertCallBack(
                                            res.status.msg2Client,
                                            function() {
                                                // self.$router.replace({path: 'membercode'})
                                                self.$router.go(-1)
                                            }
                                        )
                                    }
                                },
                                err => {
                                    self.$MessageAlert(err.msg)
                                }
                            )
                    }
                )
            }
        },
        //  详情
        toDetail() {
            console.log('--待处理详情页面--')
            // alert('to卡详情')
            // this.$router.push({
            //     path: '/carddetail',
            //     query: { test: '2222' }
            // })
        },
        // 绑定卡
        addCard() {
            this.$router.push({
                path: '/addcard'
                // query: {
                //     cinemaCode: cinemaCode
                // }
            })
        },
        rechargeBtn(item) {
            console.log('--待处理充值业务逻辑--')
            let jsonStr = JSON.stringify(item)
            this.$router.push({
                path: '/memberrechange',
                query: {
                    jsonStr: jsonStr
                }
            })
        }
    },
    filters: {
        filterTime(timestamp) {
            var date = new Date(timestamp)
            let Y = date.getFullYear() + '-'
            let M =
                (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + '-'
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            return Y + M + D
        }
    }
}
</script>

<style lang="scss">
.all-card {
    width: 750px;
    padding: 30px;
    box-sizing: border-box;
    li {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 690px;
        height: 414px;
        background: url('static/image/card/card1.png') no-repeat;
        background-size: 690px 414px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 22px;
        .li-warp {
            position: absolute;
            width: 690px;
            height: 414px;
            background: rgba(0, 0, 0, 0.5);
            left: 0;
            top: 0;
            > img {
                float: right;
                margin: 66px 60px;
                width: 160px;
                // height: 124px;
            }
        }
        .card-title {
            display: flex;
            height: 40px;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            margin-top: 20px;
            box-sizing: border-box;
            .card-left {
                flex: 1;
                display: flex;
                align-items: center;
                > p {
                    font-size: 28px;
                    line-height: 40px;
                    max-width: 380px;
                    margin-right: 10px;
                    text-align: left;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                > div {
                    width: 150px;
                    border-radius: 2px;
                    height: 36px;
                    font-size: 22px;
                    line-height: 36px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background: linear-gradient(
                        -130.5deg,
                        rgba(255, 249, 225, 1),
                        rgba(255, 245, 196, 1),
                        rgba(255, 240, 137, 1)
                    );
                }
            }
            .card-right {
                width: 90px;
                height: 36px;
                border-radius: 2px;
                line-height: 36px;
                font-size: 22px;
                background: rgba(255, 255, 255, 1);
            }
        }
        .card-p1 {
            font-size: 44px;
            color: #fff;
            // margin-top: 50px;
        }
        .card-p2 {
            color: #fff;
            font-size: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            // margin-top: 20px;
            .rechargeBtn{
                width: 104px;
                height: 56px;
                // background: #fff;
                background:linear-gradient(-124.3deg,rgba(255,255,255,1),rgba(217,236,255,1));
                border-radius: 29px;
                font-size: 30px;
                color: #567BFF;
                display: inline-block;
                line-height: 56px;
                text-align: center;
                margin-left: 16px;
            }
        }
        .card-p3 {
            color: #fffabe;
            font-size: 24px;
            // margin-top: 20px;
        }
        .card-but {
            display: flex;
            justify-content: space-between;
            color: #fff;
            background: rgba(0, 0, 0, 0.3);
            align-items: center;
            width: 690px;
            height: 50px;
            padding: 0 30px;
            font-size: 28px;
            box-sizing: border-box;
            position: relative;
            .but-warp {
                position: absolute;
                left: 0;
                top: 0;
                width: 690px;
                height: 50px;
                background: rgba(0, 0, 0, 0.3);
            }
        }
    }
}
.no-card {
    width: 360px;
    margin-top: 180px;
}
.no-text {
    margin-top: 90px;
    color: #7a797b;
    font-size: 32px;
}
.no-cardIcon {
    background: url('static/image/card/no-card.png') no-repeat;
    background-size: 100px 50px;
}
.addCard{
    width: 84px;
    height: 84px;
    position: fixed;
    bottom: 90px;
    right: 30px;
    z-index: 10;
}
</style>
