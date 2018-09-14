<template>
    <div>
        <div class="meDetail">
            <div class="info">
                <div @click="switchTo" class="qiehuan"><span>切换会员</span>
                    <img src="../../../static/image/white-right.png" alt="">
                </div>
                <div class="url"> <img :src="member.icon" alt=""> </div>
                <p> {{ member.nickName }} </p>
                <div class="accountInfo">
                    <div>
                        <span class="fn14"> 票券</span>
                        <span class="fn40"> {{ member.ticketCount}} </span>
                    </div>
                    <div>
                        <span class="fn14"> 会员卡 </span>
                        <span class="fn40"> {{ member.cardCount }} </span>
                    </div>
                    <div>
                        <span class="fn14"> 积分 </span>
                        <span class="fn40"> {{ member.integral }} </span>
                    </div>
                </div>
            </div>
            <div class="meOrder">
                <ul>
                    <li v-for="(item, index) in funAreaData" :key="index" @click="btnOrder(item)">
                        <div class="icon-item">
                            <span v-if="item.isTip" class="tip">99</span>
                            <img :src="item.url" alt="">
                            <i v-bind:style="item.boxShadow"></i>
                        </div>
                        <span> {{ item.name }} </span>
                    </li>
                </ul>
            </div>
            <div class="meSelect">
                <div>
                    <p @click="btnMenberCode">
                        <span> 会员码 </span>
                        <span class="img"> <img src="../../../static/image/arrow-right.png" alt=""> </span>
                    </p>
                    <!-- <p>
                        <span> 积分明细 </span>
                        <span class="img"> <img src="../../../static/image/arrow-right.png" alt=""> </span>
                    </p> -->
                    <div class="cart" @click="toMemberCard">
                        <span> 会员卡 </span>
                        <div>
                            <span class="carting"> {{member.defaultCard.cardLevelName}} </span>
                            <span class="img"> <img src="../../../static/image/arrow-right.png" alt=""> </span>
                        </div>
                    </div>
                    <!-- <p>
                        <span> 我的资料 </span>
                        <span class="img"> <img src="../../../static/image/arrow-right.png" alt=""> </span>
                    </p>
                    <span class="bar"></span>
                    <p class="feedback">
                        <span> 意见反馈 </span>
                        <span class="img"> <img src="../../../static/image/arrow-right.png" alt=""> </span>
                    </p> -->
                </div>
            </div>
        </div>
        <navbar/>
        <navbar :navData='navData' @upNavClick="testClick"></navbar>
    </div>
</template>

<script>
import navbar from '@/components/base/navbar.vue'
// import Vue from 'vue'
export default {
    data() {
        return {
            needBindingPhone: true,
            navData: [
                {
                    href: '/home',
                    imgSrc: '../../static/image/nav-icon/home.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/homeSeleted.png',
                    navName: '首页',
                    isSelector: false
                },
                {
                    href: '/movie',
                    imgSrc: '../../static/image/nav-icon/film.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/filmSeleted.png',
                    navName: '电影',
                    isSelector: false
                },
                {
                    href: '/shop',
                    imgSrc: '../../static/image/nav-icon/shoppingMall.png',
                    selectedImgSrc:
                        '../../static/image/nav-icon/shoppingMallSeleted.png',
                    navName: '商城',
                    isSelector: false
                },
                {
                    href: '/me',
                    imgSrc: '../../static/image/nav-icon/mySeleted.png',
                    selectedImgSrc: '../../static/image/nav-icon/mySeleted.png',
                    navName: '我的',
                    isSelector: true
                }
            ],
            funAreaData: [
                {
                    url: '../../../static/image/pickUp.png',
                    name: '待取货',
                    boxShadow: {
                        boxShadow: '0px 8px 16px 0px rgba(252,91,151,0.3)'
                    },
                    isTip: false
                },
                {
                    url: '../../../static/image/handle.png',
                    name: '待付款',
                    boxShadow: {
                        boxShadow: '0px 8px 16px 0px rgba(75,204,213,0.4)'
                    },
                    isTip: false
                },
                {
                    url: '../../../static/image/order.png',
                    name: '我的订单',
                    boxShadow: {
                        boxShadow: '0px 8px 16px 0px rgba(140,99,233,0.3)'
                    },
                    isTip: false
                },
                {
                    url: '../../../static/image/pointer.png',
                    name: '一键积分',
                    boxShadow: {
                        boxShadow: '0px 8px 16px 0px rgba(253,169,41,0.3)'
                    },
                    isTip: false
                }
            ],
            member: {
                nickName: '',
                icon: '../../../static/image/success.png',
                integral: 0,
                mobile: '',
                cardCount: 0,
                ticketCount: 0,
                defaultCard: {
                    isDefaultCard: 0,
                    uidCardLevel: '',
                    cardLevelName: '',
                    cardNo: ''
                },
                cardList: []
            }
        }
    },
    created() {
        setTitle('我的')
        // let cinemaCode = this.$route.query.cinemaCode
        console.log('------this.$omsCacheInfo.getCinemaInfo().cinemaCode')
        console.log(this.$omsCacheInfo.getCinemaInfo().cinemaCode)
        this.getMemberInfo()
        console.log('测试---me')
        console.log(this.hlTest)
        // Vue.prototype.hlTest = {'id': 2, 'name': '电影院2'}
    },
    methods: {
        navClick() {
            console.log('点击了我的页面')
        },
        // 会员切换
        switchTo() {
            console.log('切换---')
            let paramData = {}
            paramData.cinemaCode = this.$omsCacheInfo.getCinemaInfo().cinemaCode
            paramData.path = 'me'
            this.$router.push({ path: '/login', query: paramData })
        },
        getMemberInfo() {
            console.log('会员信息')
            let self = this
            let paramData = {}
            self.$axios.post('member_getInfo', paramData).then(
                res => {
                    console.log(res)
                    if (res.data.mobile === null || res.data.mobile === '') {
                        self.needBindingPhone = true
                    } else {
                        self.needBindingPhone = false
                    }
                    res.data.ticketCount = res.data.ticketCount
                        ? res.data.ticketCount
                        : 0
                    res.data.icon = res.data.icon
                        ? res.data.icon
                        : '../../../static/image/success.png'
                    if (res.data.cardList && res.data.cardList.length > 0) {
                        res.data.cardCount = res.data.cardList.length
                        let defaultCard = res.data.cardList[0]
                        for (let i in res.data.cardList) {
                            if (res.data.cardList[i].isDefaultCard === 1) {
                                defaultCard = res.data.cardList[i]
                            }
                        }
                        res.data.defaultCard = defaultCard
                    } else {
                        res.data.defaultCard = {}
                        res.data.defaultCard.cardLevelName = ''
                        res.data.cardCount = 0
                    }
                    console.log(res)
                    this.member = res.data
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        btnOrder(data) {
            if (data.name === '一键积分') {
                this.$MessageAlert('敬请期待')
                // this.$router.push({ name: 'order', params: {} })
            }
            if (data.name === '待付款') {
                this.$router.push({
                    name: 'orderList',
                    query: { orderStatus: 1 }
                })
            }
            if (data.name === '我的订单') {
                this.$router.push({
                    name: 'orderList',
                    query: { orderStatus: 3 }
                })
            }
            if (data.name === '待取货') {
                this.$router.push({
                    name: 'orderList',
                    query: { orderStatus: 2 }
                })
            }
        },
        // 会员码
        btnMenberCode() {
            if (this.needBindingPhone === true) {
                this.switchTo()
                return false
            }
            // 会员码跳转路由
            this.$router.push({ name: 'memberCode', params: {} })
        },
        testClick(nav) {
            let paramData = {}
            paramData.cinemaCode = this.$omsCacheInfo.getCinemaInfo().cinemaCode
            if (nav.href === '/movie') {
                paramData.clickType = 0
            }
            this.$router.push({
                path: nav.href,
                query: paramData
            })
        },
        // 会员卡
        toMemberCard() {
            if (this.needBindingPhone === true) {
                this.switchTo()
                return false
            }
            this.$router.push({ path: '/membercard' })
        }
    },
    components: {
        navbar
    }
}
</script>

<style lang="scss" >
.meDetail {
    .info {
        height: 440px;
        width: 750px;
        background: url('/../static/image/Pattern.png') no-repeat;
        background-size: 750px 440px;
        color: #fff;
        padding-top: 72px;
        box-sizing: border-box;
        position: relative;
        .qiehuan{
            width: 186px;
            height: 56px;
            display: flex;
            align-items: center;
            background:rgba(39,36,176,0.3);
            border-radius: 29px;
            font-size: 30px;
            color: #fff;
            justify-content: space-around;
            padding: 0 12px;
            box-sizing: border-box;
            position: absolute;
            left: 30px;
            top: 32px;
            &>img{
                width: 30px;
                height: 30px;
            }
        }
        .url {
            width: 156px;
            height: 156px;
            border-radius: 50%;
            overflow: hidden;
            display: inline-block;
            border: 4px solid #fff;
            margin-bottom: 12px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        p {
            height: 40px;
            line-height: 40px;
            font-weight: bold;
            font-size: 34px;
        }
        .accountInfo {
            height: 158px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            div {
                display: flex;
                flex-flow: column;
            }
        }
    }
    .meOrder {
        margin: 20px 0;
        height: 240px;
        background: #fff;
        ul {
            display: flex;
            justify-content: space-around;
            align-items: center;
            li {
                width: 128px;
                padding-top: 36px;
                display: flex;
                flex-flow: column;
                align-items: center;
                .icon-item {
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    margin-bottom: 36px;
                    position: relative;
                    .tip{
                        position: absolute;
                        right: -10px;
                        top: 0;
                        display: inline-block;
                        background: red;
                        color: #fff;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        border: 3px solid #fff;
                        line-height: 42px;
                        text-align: center;
                        font-size: 24px;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    i {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        // opacity: 0;
                    }
                }
                span {
                    font-size: 32px;
                    color: #262628;
                    font-weight: 450;
                    display: inline-block;
                    height: 44px;
                    line-height: 44px;
                    white-space: nowrap;
                }
            }
        }
    }
    .meSelect {
        div {
            background: #fff;
            p {
                width: 720px;
                margin-left: 30px;
                box-sizing: border-box;
                text-align: left;
                height: 88px;
                line-height: 88px;
                background: #fff;
                border-bottom: 1px solid #dfdfdf;
                box-sizing: border-box;
                font-size: 30px;
                justify-content: space-between;
                display: flex;
                .img {
                    margin-right: 34px;
                    img {
                        vertical-align: middle;
                        width: 12px;
                        height: 20px;
                    }
                }
            }
            .cart {
                margin-left: 30px;
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;
                font-size: 30px;
                text-align: left;
                height: 88px;
                line-height: 88px;
                background: #fff;
                border-bottom: 1px solid #dfdfdf;
                box-sizing: border-box;
                div {
                    border-bottom: 1px solid #dfdfdf;
                    .carting {
                        font-size: 30px;
                        color: #9b9b9b;
                        margin-right: 14px;
                    }
                    .img {
                        margin-right: 34px;
                        img {
                            vertical-align: middle;
                            width: 12px;
                            height: 20px;
                        }
                    }
                }
            }
            .feedback {
                margin-bottom: 120px;
            }
        }
    }
}
.fn14 {
    font-size: 28px;
    height: 40px;
    line-height: 40px;
}
.fn40 {
    font-size: 40px;
    height: 48px;
    line-height: 48px;
}
.bar {
    height: 20px !important;
    background: #f7f7f7;
    display: flex;
}
</style>
