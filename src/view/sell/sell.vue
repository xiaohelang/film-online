<template>
    <div :class="$style.shops">
        <div class="sell-banner">
            <p class="sell-title">{{customerLocation}}</p>
            <img class="sb-banner" src="static/image/SBanner.png" alt="">
        </div>
        <div class="sell-tab">
            <div @click="toOrder(1)" class="sell-tab-item">
                <img src="static/image/sell-wating.png" alt="">
                待付款
            </div>
            <div @click="toOrder(3)" class="sell-tab-item">
                <img src="static/image/sell-order.png" alt="">
                我的订单
            </div>
        </div>
        <div v-if="sell.length !== 0" :class="$style.shop">
            <ul>
                <li @click="tabBtn(index)" v-for="(item, index) in sell" :key="item.id" v-bind:class="{ 'select': selectIndex == index }">{{item.categoryName}}</li>
            </ul>
            <div ref="foodsWrapper" style="overflow: auto;">
                <!-- <ShopProduct></ShopProduct> -->
                <section :class="$style.content">
                    <div :class="$style.shopCell" v-for="(item, index) in sells" :key="index">
                        <dl>
                            <dt>
                                <img v-if="item.merchaiseIcon" :src="item.merchaiseIcon" alt="">
                                <img v-else src="static/image/default/goods-poster.png" alt="">
                            </dt>
                            <dd>
                                <p :class="$style.sellTitle">{{item.merchaiseName}}</p>
                                <p :class="$style.subSellTitle">{{item.merDesc}}</p>
                                <div>
                                    <span>
                                        <span>&yen;{{item.discountPrice}}</span>
                                        <del v-if="item.discountPrice!= item.originalPrice">&yen; {{item.originalPrice}}</del>
                                    </span>
                                    <div :class="$style.combo_num">
                                        <span v-show="item.sum" :class="$style.reduce" @click="btnPlus(item)"> <img src="../../../static/image/plus.png" alt=""> </span>
                                        <span v-show="item.sum" :class="$style.num"> {{ item.sum }} </span>
                                        <span :class="$style.reduce" @click="btnReduce(item)"> <img src="../../../static/image/reduce.png" alt=""></span>
                                    </div>
                                </div>
                            </dd>
                        </dl>
                        <div v-if="item.children" :class="$style.shopCellBot">
                            <div :class="$style.shopCellTitle">
                                <div :class="$style.shopCellLeft">包含
                                    <span style="color:#ED9400;">{{item.number}}</span> 件商品</div>
                                <div @click="detailBtn(item.merchaiseId)" :class="$style.shopCellRight">
                                    <img :class="[{shopCellRightIcon: item.isDetail == true}, {shopCellRightIcon2: item.isDetail == false}]" src="static/image/arrow-up.png" alt="">
                                    <span>详情</span>
                                </div>
                            </div>
                            <ul v-show="item.isDetail" :class="$style.titleUl">
                                <li :class="$style.titleLi" v-for="citem in item.children" :key="citem.merchaiseId">
                                    <img v-if="!citem.merchaiseIcon" :class="$style.titleLiLeft" src="static/image/default/goods-poster.png" alt="">
                                    <img v-if="citem.merchaiseIcon" :class="$style.titleLiLeft" :src="citem.merchaiseIcon" alt="">
                                    <div :class="$style.titleLiRight">
                                        <div :class="$style.titleLiRightP1">{{citem.merchaiseName}}</div>
                                        <div :class="$style.titleLiRightP2">x{{citem.number}}</div>
                                    </div>
                                </li>
                                <!-- <li :class="$style.titleLi">
                                    <img :class="$style.titleLiLeft" src="static/image/default/goods-poster.png" alt="">
                                    <div :class="$style.titleLiRight">
                                        <div :class="$style.titleLiRightP1">汉根达斯单球杯</div>
                                        <div :class="$style.titleLiRightP2">x1</div>
                                    </div>
                                </li> -->
                            </ul>
                        </div>
                    </div>

                    <!-- <ul :class="$style.shopFooter">
                    <li><span style="font-size: 0.32rem;">&yen;</span>166
                        <div>
                            <span>8</span>
                        </div>
                        </li>
                        <li>去结算</li>
                    </ul> -->
                </section>
            </div>
        </div>
        <ul v-if="sell.length !== 0" :class="$style.shopFooter">
            <li>
                <span style="font-size: 0.32rem;">&yen;</span>{{allPrice}}
                <div>
                    <span>{{allSum}}</span>
                </div>
            </li>
            <li @click="getCreateMerOrder" :class="[{'no-point': allSum == 0}]">去结算</li>
        </ul>
        <img v-if="sell.length === 0" class="no-shop" src="static/image/no-shop.png" alt="">
        <p v-if="sell.length === 0" class="no-shopText">还没有选购商品</p>
    </div>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
export default {
    data() {
        return {
            isSelector: false,
            comp_cinema: {},
            comp_cinemaList: [],
            selectIndex: 0,
            sell: [],
            cinemaCode: '20180001',
            comboNum: 0,
            allSum: 0,
            sells: [],
            allPrice: 0,
            merList: [],
            selectSell: [],
            // 是否有订单
            isOrder: true,
            unPayOrderId: '0',
            isDetail: false,
            needBindingPhone: false,
            customerLocation: '',
            bannerList: [],
            subLocation: '',
            locationId: ''
        }
    },
    created() {
        setTitle('点餐')
        let userToken = this.getQueryString('userToken')
        if (userToken) {
            console.log('userToken-->', userToken)
            sessionStorage.setItem('userToken', userToken)
        }
        let authCode = this.getQueryString('authCode')
        if (authCode) {
            console.log('authCode-->', authCode)
            sessionStorage.setItem('authCode', authCode)
        }
        var self = this
        this.cinemaCode = this.getQueryString('cinemaCode')
        if (this.cinemaCode === null) {
            this.cinemaCode = localStorage.getItem('cinemaCode')
        } else {
            localStorage.setItem('cinemaCode', self.cinemaCode)
        }
        this.subLocation = this.getQueryString('subLocation')
        if (this.subLocation === null) {
            this.subLocation = localStorage.getItem('subLocation')
        } else {
            localStorage.setItem('subLocation', self.subLocation)
        }
        this.locationId = this.getQueryString('locationId')
        if (this.locationId === null) {
            this.locationId = localStorage.getItem('locationId')
        } else {
            localStorage.setItem('locationId', self.locationId)
        }
        console.log(this.cinemaCode)
        console.log(this.subLocation)
        console.log(this.locationId)
        console.log(this.locationId)
        // debugger
        this.getMemberInfo()
        this.queryUnpayOrder(function() {
            self.getCinemaInfo()
            self.getCinemaList()
        })
        this.$nextTick(() => {
            this._initScroll()
        })
        // this.getCinemaInfo()
        // this.getCinemaList()
        // this.queryUnpayOrder()
        // this.$nextTick(() => {
        //     this.getCategory()
        // })
    },
    methods: {
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            } else {
                return null
            }
        },
        // 我的订单与待付款
        toOrder(index) {
            console.log('index')
            console.log(index)
            if (index === 1) {
                this.$router.push({
                    name: 'orderList',
                    query: { orderStatus: 1, path: 'sellPath' }
                })
            }
            if (index === 3) {
                this.$router.push({
                    name: 'orderList',
                    query: { orderStatus: 3, path: 'sellPath' }
                })
            }
        },
        // 获取个人绑定手机号码信息
        getMemberInfo() {
            console.log('会员信息')
            let paramData = {}
            let self = this
            self.$axios.post('member_getInfo', paramData).then(
                res => {
                    console.log(res)
                    if (res.data.mobile === null || res.data.mobile === '') {
                        self.needBindingPhone = true
                    } else {
                        self.needBindingPhone = false
                    }
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        detailBtn(merchaiseId) {
            console.log('------merchaiseId----')
            console.log(merchaiseId)
            let hhArr = this.sells
            hhArr.map((el, index) => {
                if (el.merchaiseId === merchaiseId) {
                    let oIsDetail = !el.isDetail
                    // el.number = 30
                    Vue.set(
                        this.sells,
                        index,
                        Object.assign(el, { isDetail: oIsDetail })
                    )
                }
            })
            // this.sells = hhArr
            console.log('----this.sells----')
            console.log(this.sells)
            // this.isDetail = !this.isDetail
        },
        // 获取影院信息
        getCinemaInfo() {
            let self = this
            // let paramData1 = {
            //     cinemaCode: this.cinemaCode
            // }
            // self.comp_cinema = self.$omsCacheInfo.getCinemaInfo(paramData1)
            self.getCategory()
        },
        // 获取影院列表信息
        getCinemaList() {
            let self = this
            let paramData2 = {
                displayStyle: 2
            }
            self.comp_cinemaList = self.$omsCacheInfo.getCinemaList(paramData2)
        },
        // 切换分类
        tabBtn(index) {
            let self = this
            console.log('切换卖品')
            console.log(index)
            this.selectIndex = index
            console.log('切换卖品---selectIndex')
            console.log(this.selectIndex)
            let item = this.sell[self.selectIndex].merchaiseList
            if (item.length !== 0) {
                if (item[0].children && item[0].children.length !== 0) {
                    item.forEach(el => {
                        el.isDetail = false
                        el.isTimer = 20
                    })
                }
            }
            // this.sells = this.sell[self.selectIndex].merchaiseList
            this.sells = item
        },
        // 总价格
        getSum() {
            this.allSum = 0
            this.allPrice = 0
            this.merList = []
            this.selectSell = []
            this.sell.map((item, index) => {
                item.merchaiseList.map((list, ind) => {
                    if (list.sum) {
                        this.allSum += list.sum
                        this.allPrice += list.discountPrice * list.sum
                        this.selectSell.push(list)
                        this.merList.push({
                            merAmount: list.discountPrice,
                            merGiftStatus: 0,
                            merName: list.merchaiseName,
                            merNum: list.sum,
                            merOriginal: list.originalPrice,
                            merchaiseId: list.merchaiseId
                        })
                    }
                })
            })
            // debugger
        },

        // 减一arg
        btnPlus(arg) {
            let self = this
            console.log('减一')
            console.log(arg)
            this.sell.map((item, index) => {
                if (arg.category === item.categoryName) {
                    item.merchaiseList.map((list, ind) => {
                        if (list.merchaiseId === arg.merchaiseId) {
                            list.sum--
                        }
                    })
                }
            })
            this.sells = this.sell[this.selectIndex]
            console.log('处理的数据1')
            console.log(this.sell)
            console.log('处理的数据2')
            this.sells = this.sell[self.selectIndex].merchaiseList
            console.log(this.sells)
            this.getSum()
        },
        // 加一
        btnReduce(arg) {
            let self = this
            console.log('加一')
            console.log(arg)
            console.log(self.unPayOrderId)
            if (self.unPayOrderId !== '0') {
                console.log('判断是否有订单')
                self.$alertCallBack('您有一笔订单尚未支付', function() {
                    self.$router.push({
                        name: 'unpayorder',
                        query: {orderId: self.unPayOrderId, continuePay: 1, path: 'sellPath'}
                    })
                })
                return
            }
            this.sell.map((item, index) => {
                if (arg.category === item.categoryName) {
                    item.merchaiseList.map((list, ind) => {
                        if (list.merchaiseId === arg.merchaiseId) {
                            if (list.sum === undefined) {
                                list.sum = 1
                            } else {
                                list.sum++
                            }
                        }
                    })
                }
            })
            this.sells = this.sell[this.selectIndex]
            console.log('处理的数据1')
            console.log(this.sell)
            console.log('处理的数据2')
            this.sells = this.sell[self.selectIndex].merchaiseList
            console.log(this.sells)
            this.getSum()
        },
        // 分类接口
        getCategory() {
            let self = this
            let paramData = {}
            paramData.cinemaCode = self.cinemaCode
            self.$axios.post('mer_QueryGoodsByScan', paramData).then(
                res => {
                    if (res.status.status === 0) {
                        if (res.data) {
                            self.customerLocation = res.data.customerLocation
                            self.bannerList = res.data.bannerList
                            self.sell = res.data.merchaiseCategoryList
                            if (res.data.merchaiseCategoryList.length > 0) {
                                self.sells = self.sell[self.selectIndex].merchaiseList
                            }
                        } else {
                            self.sell = []
                        }
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 去结算
        toBalance() {
            if (this.allSum === 0) return
            // let sellStr = JSON.stringify(this.selectSell)
            // window.localStorage.setItem('selectSell', sellStr)
            // this.$router.push({path: '/topay'})
            this.$router.push({
                path: '/topay',
                query: { cinemaCode: this.cinemaCode }
            })
        },
        _initScroll() {
            // this.meunScroll = new BScroll(this.$refs.menuWrapper, {click: true})
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3
            })
            this.foodsScroll.on('scroll', (pos) => {
                console.log(`scroll: ${pos}`)
                // if (pos.y <= 0) {
                //     this.scrollY = Math.abs(Math.round(pos.y));
                // }
            })
        },
        // 新创建卖品订单
        getCreateMerOrder() {
            console.log('创建订单')
            let self = this
            if (this.allSum === 0) return
            if (this.needBindingPhone === true) {
                let cinemaCode = this.cinemaCode
                this.$router.push({
                    path: '/login',
                    query: {
                        cinemaCode: cinemaCode,
                        path: 'sell'
                    }
                })
                return false
            }
            let paramData = {}
            paramData.merList = self.merList
            paramData.cinemaCode = self.cinemaCode
            paramData.actAmount = self.allPrice
            paramData.orignalAmount = self.allPrice
            // 扫码点餐类型为5
            paramData.orderType = 5
            paramData.subLocation = self.subLocation
            paramData.locationId = self.locationId
            self.$axios.post('order_createMerOrder', paramData).then(
                res => {
                    console.log('创建订单---res')
                    console.log(res)
                    // 有待验证
                    // debugger
                    let orderId = res.data.orderId
                    self.$router.push({
                        name: 'unpayorder',
                        query: {orderId: orderId, path: 'sellPath'}
                    })
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 查询未支付订单
        queryUnpayOrder(cbFn) {
            let self = this
            let paramData = {}
            self.$axios.post('order_queryUnsettleOrder', paramData).then(
                res => {
                    console.log('未支付---res')
                    console.log(res)
                    if (res.status.status === 0) {
                        self.unPayOrderId = res.data
                        cbFn && cbFn()
                    }
                },
                err => {
                    console.log('未支付---err')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        }
    },
    components: {}
}
</script>

<style lang="scss">
.select {
    background: #fff;
    color: #598cff !important;
    border-left: 8px solid #598cff !important;
}
.no-shop {
    width: 360px;
    margin-top: 180px;
}
.no-shopText {
    margin-top: 90px;
    color: #7a797b;
    font-size: 32px;
}
.no-point {
    background: #ccc !important;
    pointer-events: none;
}
.shopCellRightIcon {
    width: 30px;
    height: 20px;
    transform: rotate(0deg);
    margin-right: 10px;
    transition: 0.2s;
}
.shopCellRightIcon2 {
    width: 30px;
    height: 20px;
    transform: rotate(180deg);
    margin-right: 10px;
    transition: 0.2s;
}
.sell-banner{
    width: 750px;
    height: 240px;
    // background: pink;
    position: relative;
    .sell-title{
        width: 750px;
        text-align: center;
        height: 42px;
        line-height: 42px;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5)
    }
    .sb-banner{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.sell-tab{
    width: 750px;
    height: 68px;
    padding: 10px 0 14px;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #5B8EFF;
    .sell-tab-item{
        width: 370px;
        height: 68px;
        background:#fff;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
            margin-right: 14px;
        }
    }
}
</style>
<style lang="scss" module>
.shops {
    height: calc(100vh);
    .shop {
        width: 750px;
        overflow: hidden;
        position: absolute;
        height: 100%;
        left: 0;
        // top: 80px;
        // bottom: 100px;
        display: flex;
        // margin-bottom: 100px;
        ul {
            width: 160px;
            height: 100%;
            overflow: hidden;
            background: #f7f7fa;
            li {
                width: 100%;
                height: 88px;
                line-height: 88px;
                font-size: 30px;
                color: #7a797b;
                border-left: 8px solid #f7f7fa;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        div {
            // height: 100%;
            background: #fff;
            .content {
                margin-bottom: 100px;
                .shopCell {
                    dl {
                        display: flex;
                        box-sizing: border-box;
                        width: 590px;
                        padding: 20px 32px;
                        background: #fff;
                        dt > img {
                            width: 156px;
                            height: 156px;
                            object-fit: cover;
                        }
                        dd {
                            display: flex;
                            width: 390px;
                            margin-left: 16px;
                            flex-direction: column;
                            justify-content: space-between;
                            .sellTitle {
                                color: #262628;
                                font-size: 28px;
                                text-align: left;
                                margin-top: 5px;
                            }
                            .subSellTitle {
                                color: #9b9b9b;
                                font-size: 24px;
                                text-align: left;
                            }
                            & > div {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: center;
                                & > span {
                                    span {
                                        color: #f43933;
                                        font-size: 36px;
                                    }
                                    del {
                                        font-size: 32px;
                                        color: #9b9b9b;
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
                    .shopCellBot {
                        width: 590px;
                        .shopCellTitle {
                            display: flex;
                            justify-content: space-between;
                            color: #7a797b;
                            box-sizing: border-box;
                            width: 590px;
                            padding: 20px 32px;
                            font-size: 28px;
                            align-items: center;
                            position: relative;
                            &::before {
                                content: '';
                                border: 1px dashed rgba(223, 223, 223, 1);
                                width: 520px;
                                position: absolute;
                                left: 30px;
                                top: 0;
                            }
                            &::after {
                                content: '';
                                border: 1px solid rgba(223, 223, 223, 1);
                                width: 560px;
                                position: absolute;
                                left: 30px;
                                bottom: 0;
                            }
                            .shopCellLeft {
                                font-size: 28px;
                            }
                            .shopCellRight {
                                display: flex;
                                align-items: center;
                                .shopCellRightIcon {
                                    width: 30px;
                                    height: 20px;
                                    transform: rotate(180deg);
                                    margin-right: 10px;
                                }
                                .shopCellRightIcon2 {
                                    width: 30px;
                                    height: 20px;
                                    transform: rotate(0deg);
                                    margin-right: 10px;
                                }
                            }
                        }
                        .titleUl {
                            width: 590px;
                            background: #fff;
                            .titleLi {
                                width: 590px;
                                padding: 20px 32px;
                                box-sizing: border-box;
                                height: 107px;
                                background: #fff;
                                display: flex;
                                position: relative;
                                .titleLiLeft {
                                    width: 68px;
                                    height: 68px;
                                    object-fit: cover;
                                    margin-right: 32px;
                                }
                                .titleLiRight {
                                    .titleLiRightP1 {
                                        line-height: 40px;
                                        text-align: left;
                                        font-size: 32px;
                                        color: #262628;
                                    }
                                    .titleLiRightP2 {
                                        color: #9b9b9b;
                                        font-size: 24px;
                                        line-height: 30px;
                                        text-align: left;
                                    }
                                }
                                &::after {
                                    content: '';
                                    border: 1px solid rgba(223, 223, 223, 1);
                                    width: 560px;
                                    position: absolute;
                                    left: 30px;
                                    bottom: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .shopFooter {
        width: 750px;
        height: 100px;
        position: fixed;
        display: flex;
        left: 0;
        bottom: 0;
        & li:nth-child(1) {
            flex: 1;
            color: #fff;
            font-size: 48px;
            height: 100%;
            background: #37435e;
            text-align: left;
            line-height: 100px;
            padding-left: 160px;
            box-sizing: border-box;
            div {
                width: 104px;
                height: 104px;
                background: url('static/image/shopping-cart.png') no-repeat;
                background-size: 104px 104px;
                position: absolute;
                top: -28px;
                left: 30px;
                span {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    display: inline-block;
                    background: #ff001f;
                    border: 2px solid #fff;
                    right: -8px;
                    border-radius: 22px;
                    top: 0;
                    font-size: 24px;
                    line-height: 40px;
                    text-align: center;
                }
            }
        }
        & li:nth-child(2) {
            width: 200px;
            height: 100%;
            background: linear-gradient(
                -131.8deg,
                rgba(99, 134, 255, 1),
                rgba(84, 170, 255, 1)
            );
            font-size: 34px;
            line-height: 100px;
            text-align: center;
            color: #fff;
        }
    }
}
</style>
