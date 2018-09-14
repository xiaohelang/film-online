<template lang="html">
    <div :class="$style.allSeat">
        <div :class="$style.buyHeader">
            <p>{{moviePlanShow.movieName}}<span :class="$style.tipBox"><span v-show="moviePlanShow.showEffect != null">{{moviePlanShow.showEffect}}</span><span v-show="moviePlanShow.movieTag != null">{{moviePlanShow.movieTag}}</span></span></p>
            <p> <span>{{moviePlanShow.startShowDate | filterShowDate}} </span>（{{moviePlanShow.language}}／{{moviePlanShow.movieVersion}}）</p>
        </div>
        <div :class="$style.buyHint">
            <ul>
                <li :class="$style.buyHintLi0">普通座</li>
                <li :class="$style.buyHintLi1">已售</li>
                <li :class="$style.buyHintLi2">选中</li>
                <li :class="$style.buyHintLi3">最佳观影区</li>
            </ul>
            <div @click="knowBtn" :class="$style.buyHintTip">
                图示>
            </div>
        </div>

        <div :class="$style.seatTitleBox">
            <p :class="$style.seatTitle"><span>{{moviePlanShow.hallName}}银屏</span></p>
        </div>
        <!-- 选座模块 -->
        <div  v-finger:pinch="pinch" :class="[$style.seatBox, {hlTest: isTest}, {hlTest2: !isTest}]" ref="seatBox">
            <!-- <div :class="$style.seatIn">
                <p><span>屏幕中央</span></p>
            </div> -->
            <div :class="[$style.seatsList]" ref="seatList">
                <!-- 排数模块 -->
                <div :class="$style.seatRowBox" :style="{left: listLeft + 'rem',top: listTop + 'rem'}" >
                    <div :class="$style.seatRow"  :key="index" v-for="(item, index) in listItem">{{index+1}}</div>
                </div>
                <!-- 座位模块 -->
                <div @click="selectSeat(seat)" :class="[{seatsItem0: seat.resSeatLevelCode == 'seatLevel0'}, {seatsItem1: seat.resSeatLevelCode == 'seatLevel1'}, {seatsItem2: seat.resSeatLevelCode == 'seatLevel2'}, {seatsItem3: seat.resSeatLevelCode == 'seatLevel3'}, {seatsItem4: seat.resSeatLevelCode == 'seatLevel4'}, {seatsItem5: seat.resSeatLevelCode == 'seatLevel5'}, {seatsItem6: seat.resSeatLevelCode == 'seatLevel6'}, {seatsItem6: seat.resSeatSaleStatus == '-2'},  {seatsItem7: seat.resSeatSaleStatus != 0 && seat.resSeatSaleStatus != '-2' }, ]" v-for="(seat, index) in seats" :key="index" :style="{left: seat.resSeatX/100+'rem',top: seat.resSeatY/100 +'rem'}">
                    <p :class="$style.seatName">
                        <span>  </span>
                    </p>
                </div>
            </div>
        </div>

        <div :class="$style.seatFooter">
            <div :class="$style.seatSelected">
                <p><span>已选座位：</span> <span>最多选5个座位</span></p>
                <ul>
                    <div :class="$style.seactItem" v-for="(item, index) in selectedSeat" :key="index">
                        <span>{{item.resSeatRow}}排{{item.resSeatCol}}座</span>
                        <span>&yen;{{item.price}}</span>
                        <div @click="delectSeat(item)">x</div>
                    </div>
                </ul>
            </div>
            <div :class="$style.seatSelectedUp">
                <p>
                    <span>合计:</span>
                    <span>&yen;{{allPrice}}</span>
                </p>
                <Btn :class="$style.buy" @upBtnClick="lockSeat">确认选座</Btn>
            </div>
        </div>
        <div v-show="isKnow" :class="$style.swrap">
            <div :class="$style.swrapIn">
                <ul :class="$style.swrapInSeat">
                    <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat0.png" alt="">
                         <span>普通座</span>
                    </li>
                    <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat1.png" alt="">
                         <span>一等座</span>
                    </li>
                    <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat2.png" alt="">
                         <span>二等座</span>
                    </li>
                </ul>
                <ul :class="$style.swrapInSeat">
                   <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat3.png" alt="">
                         <span>三等座</span>
                    </li>
                    <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat4.png" alt="">
                         <span>四等座</span>
                    </li>
                    <li :class="$style.swrapInSeatLi">
                         <img style="width: 0.36rem; height: 0.36rem; margin-right: 0.1rem;" class='noBillImg' src="/static/image/seatIcon/iconseat5.png" alt="">
                         <span>五等座</span>
                    </li>
                </ul>
                <div :class="$style.knowBtn" @click="knowBtn">知道了</div>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import Btn from '@/components/base/btn.vue'
import { formatDate } from '@/js/dateUtils.js'
import { mapGetters } from 'vuex'
// import { AlertModule } from 'vux'
export default {
    props: {},
    data() {
        return {
            isTest: false,
            isKnow: false,
            needBindingPhone: false, // 是否需要绑定会员卡
            memberDefaultCard: {},
            a: 88,
            listItem: 0,
            // 找出最右边列表
            maxList: [],
            // 找出最左边列表
            // minLeftList: [],
            minMarginLeft: 0,
            minMarginTop: 0,
            maxRightX: 0,
            maxBottomY: 0,
            seats: [
                // { resSeatX: 100, resSeatY: 50 },
                // { resSeatX: 150, resSeatY: 50 },
            ],
            listLeft: 1,
            listTop: 1.5,
            moviePlanShow: {},
            selectedSeat: [
                // { seat: '5排6号', price: 36 },
                // { seat: '5排7号', price: 36 },
                // { seat: '5排8号', price: 36 },
                // { seat: '5排9号', price: 36 },
                // { seat: '5排10号', price: 36 }
            ],
            selectedSeatLength: 0,
            priceList: [],
            allPrice: 0,
            currrentMemberLevel: null, // 当前会员等级
            unPayOrderId: '0'
        }
    },
    created() {
        setTitle('选座')
        var self = this
        self.queryUnpayOrder(function() {
            self.getMemberInfo()
            self.getPlanShowPrice(function() {
                self.getPlanShowSeat()
            })
        })
    },
    computed: {
        ...mapGetters(['test', 'name'])
    },
    methods: {
        getMemberInfo() {
            console.log('会员信息')
            let paramData = {}
            let self = this
            self.$axios.post('member_getInfo', paramData).then(
                res => {
                    console.log(res)
                    if (res.data.mobile == null || res.data.mobile === '') {
                        self.needBindingPhone = true
                    } else {
                        self.needBindingPhone = false
                    }
                    if (res.data.cardList) {
                        res.data.cardCount = res.data.cardList.length
                        let defaultCard = res.data.cardList[0]
                        for (let i in res.data.cardList) {
                            if (res.data.cardList[i].isDefaultCard === 1) {
                                defaultCard = res.data.cardList[i]
                            }
                        }
                        res.data.defaultCard = defaultCard
                        self.memberDefaultCard = defaultCard
                    }
                    console.log('memberInfo-->', res.data)
                    sessionStorage.setItem(
                        'memberInfo',
                        JSON.stringify(res.data)
                    )
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 获取座位图
        getPlanShowSeat() {
            let self = this
            let planShowId = this.$route.query.planShowId
            self.$axios.post('planSeat_getInfo', { planShowId }).then(
                res => {
                    console.log('座位图---res')
                    console.log(res)
                    self.moviePlanShow = res.data.moviePlanShow
                    if (res.data.moviePlanShow.startShowDate) {
                        self.planShowDateWarning(
                            res.data.moviePlanShow.startShowDate
                        )
                    }
                    let alSeats = res.data.seatDTOList
                    if (!alSeats || alSeats.length === 0) return
                    self.getSeatXY(res.data.seatDTOList)
                    alSeats.map(item => {
                        item.resSeatX =
                            window.parseInt(item.resSeatX) - self.minMarginLeft
                        item.resSeatY =
                            window.parseInt(item.resSeatY) - self.minMarginTop
                    })
                    self.seats = alSeats
                    self.listLeft = (100 - 70) / 100
                    self.listTop = 100 / 100

                    self.listItem = parseInt(
                        self.seats[self.seats.length - 1].resSeatRow
                    )
                    self._initSeat()
                },
                err => {
                    console.log('座位图---err')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        _initSeat(scale) {
            if (!scale) {
                scale = 1
            }
            let width = this.maxRightX - this.minMarginLeft
            // width = 1250
            let height = this.maxBottomY - this.minMarginTop
            // this.$refs.seatList.style.scaleX = 2
            // this.$refs.seatList.style.scaleY = 2
            this.$refs.seatList.style.width = (width * scale + 50) / 100 + 'rem'
            this.$refs.seatList.style.height =
                (height * scale + 50) / 100 + 'rem'
            if (!this.picScroll) {
                console.log('---init--')
                this.picScroll = new BScroll(this.$refs.seatBox, {
                    scrollX: true,
                    freeScroll: true,
                    eventPassthrough: '',
                    click: true
                })
            } else {
                this.picScroll.refresh()
                // console.log('---refresh---')
                // console.log(this.picScroll)
                // console.log(this.picScroll.prototype)
                // console.log(this.picScroll.__proto__)
            }
        },
        // 双指缩放
        pinch: function(evt) {
            console.log('onPinchscale', evt.zoom)
            let scale = evt.zoom.toFixed(2)
            if (scale < 1) {
                scale = 1
            } else if (scale > 1.5) {
                scale = 1.5
            }
            this.$refs.seatBox.style.transform =
                'scale(' + scale + ',' + scale + ')'
            this._initSeat(scale)
        },
        getSeatXY(seatDTOList) {
            console.log('getSeatXY--->')
            if (seatDTOList && seatDTOList.length > 0) {
                let minSeatX = parseInt(seatDTOList[0].resSeatX) // X轴最大最小
                let maxSeatX = parseInt(seatDTOList[0].resSeatX) // X轴最大最大
                let minSeatY = parseInt(seatDTOList[0].resSeatY) // y轴最大最小
                let maxSeatY = parseInt(seatDTOList[0].resSeatY) // y轴最大最大
                for (let i = 1; i < seatDTOList.length; i++) {
                    let curSeatX = parseInt(seatDTOList[i].resSeatX)
                    minSeatX =
                        curSeatX < minSeatX ? (minSeatX = curSeatX) : minSeatX
                    maxSeatX =
                        curSeatX > maxSeatX ? (maxSeatX = curSeatX) : maxSeatX

                    let curSeatY = parseInt(seatDTOList[i].resSeatY)
                    minSeatY =
                        curSeatY < minSeatY ? (minSeatY = curSeatY) : minSeatY
                    maxSeatY =
                        curSeatY > maxSeatY ? (maxSeatY = curSeatY) : maxSeatY
                }
                // 所有排中做多座位个数
                let maxRowCount = (maxSeatX - minSeatX) / 50 + 1
                // 所有列中做多的座位数
                let maxColCount = (maxSeatY - minSeatY) / 50 + 1
                // if (maxColumns < 15 && maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 4 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 4 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // } else if (maxColumns < 15 && !maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 5 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 5 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // } else if (16 < maxColumns < 21 && maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 6 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 6 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // } else if (16 < maxColumns < 21 && !maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 7 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 7 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // } else if (maxColumns > 21 && maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 8 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 8 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // } else if (maxColumns > 21 && !maxColumns % 2 == 0) {
                //     besttopseat = Math.round(maxRows / 3) //上边
                //     bestleftseat = Math.round(maxColumns / 2 - 9 / 2) //左边
                //     bestrows = Math.round(maxRows / 3) //最佳行数
                //     bestColumns = 9 //最佳列数
                //     var bestdiv = '<div class ="look-b"><div>'
                //     bestdiv = $(bestdiv).css({
                //         width: bestColumns * seatwidth,
                //         height: bestrows * seatheight,
                //         top: besttopseat * seatheight,
                //         left: bestleftseat * seatwidth
                //     })
                //     $('.seat-table').append(bestdiv)
                // }
                console.log('maxSeatX-->', maxSeatX)
                console.log('minSeatX-->', minSeatX)
                console.log('minSeatY-->', minSeatY)
                console.log('maxSeatY-->', maxSeatY)
                console.log('maxRowCount-->', maxRowCount)
                console.log('maxColCount-->', maxColCount)
                console.log(
                    'this.$refs.seatList.style.width-->',
                    this.$refs.seatList.style.width
                )
                console.log(
                    'this.$refs.seatList.style.height-->',
                    this.$refs.seatList.style.height
                )
                this.minMarginLeft = minSeatX - 100
                this.minMarginTop = minSeatY - 100
                this.maxRightX = maxSeatX
                this.maxBottomY = maxSeatY
            }
        },
        // 不是当前放映，提示购票具体的放映日期日期
        planShowDateWarning(startShowDate) {
            let curDate = formatDate(new Date(), 'yyyy-MM-dd')
            let startShowDateArr = startShowDate.substring(0, 10)
            if (startShowDateArr > curDate) {
                let showDate = new Date(
                    Date.parse(startShowDate.replace(/-/g, '/'))
                )
                let myDate = formatDate(showDate, 'MM月dd日 hh:mm')
                let msg = '您选的是' + myDate + '的场次，请仔细核对哦'
                this.$MessageAlert(msg)
            }
        },
        // 图示
        knowBtn() {
            this.isKnow = !this.isKnow
        },
        // 获取价格
        getPlanShowPrice(cb) {
            console.log('getPlanShowPrice-->')
            let self = this
            let planShowId = this.$route.query.planShowId
            self.$axios.post('planSeat_getPrice', { planShowId }).then(
                res => {
                    res.data.sort(function(a, b) {
                        if (a.price > b.price) {
                            return 1
                        } else if (a.price < b.price) {
                            return -1
                        } else {
                            return 0
                        }
                    })
                    console.log('self.priceList-->', res.data)
                    self.priceList = res.data
                    cb && cb()
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        },
        // 选座
        selectSeat(seat) {
            console.log('selectSeat', seat)
            let self = this
            if (self.unPayOrderId !== '0') {
                // console.log('判断是否有订单')
                self.$alertCallBack('您有一笔订单尚未支付', function() {
                    self.$router.push({
                        name: 'unpayorder',
                        query: { orderId: self.unPayOrderId, continuePay: 1 }
                    })
                })
                return
            }
            if (self.needBindingPhone === true) {
                // console.log('判断是否要登陆')
                let cinemaCode = this.$route.query.cinemaCode
                let planShowId = this.$route.query.planShowId
                this.$router.push({
                    path: '/login',
                    query: {
                        planShowId: planShowId,
                        cinemaCode: cinemaCode,
                        path: 'buySeat'
                    }
                })
                return false
            }
            // 获取已选中的座位数据并计算
            self.selectedSeat = []
            self.allPrice = 0
            for (let item2 of self.seats) {
                if (item2.resSeatSaleStatus === -2) {
                    self.selectedSeat.push(item2)
                    self.allPrice += item2.price
                }
            }
            self.selectedSeatLength = self.selectedSeat.length
            if (seat.resSeatSaleStatus === 0 && self.selectedSeatLength === 5) {
                self.$MessageAlert('最多选择5张')
                return
            }
            // 判断座位点击操作
            if (seat.resSeatSaleStatus === 0) {
                // console.log('可选座位操作')
                for (let item of self.seats) {
                    // console.log('循环数据次数，')
                    if (item.resSeatCode === seat.resSeatCode) {
                        item.resSeatSaleStatus = -2
                        let seatPrice = self.getSelectSetPrice(
                            item.resSeatLevelCode
                        )
                        item.price = seatPrice.price
                        item.priceId = seatPrice.priceId
                        self.selectedSeat.push(item)
                        self.allPrice += item.price
                        self.selectedSeatLength++
                        break
                    }
                }
            } else if (seat.resSeatSaleStatus === -2) {
                // console.log('删除已选座位操作')
                self.delectSeat(seat)
            }
        },
        // 获取座位价格
        getSelectSetPrice(resSeatLevelCode) {
            let selectSeatPrice = {}
            let memberCardLevel = ''
            if (this.memberDefaultCard) {
                memberCardLevel = this.memberDefaultCard.uidCardLevel
            }
            for (let ticketSeatPrice of this.priceList) {
                if (resSeatLevelCode === ticketSeatPrice.seatLevelCode) {
                    if (
                        ticketSeatPrice.ticketTypeName === '公众号' ||
                        ticketSeatPrice.memberCardLevel === '' ||
                        ticketSeatPrice.memberCardLevel === null ||
                        ticketSeatPrice.memberCardLevel === memberCardLevel
                    ) {
                        selectSeatPrice = ticketSeatPrice
                        break
                    }
                }
            }
            console.log('getSelectSetPrice-->', selectSeatPrice)
            return selectSeatPrice
        },
        // 删除一个座位
        delectSeat(seat) {
            console.log('delectSeat-->')
            let self = this
            for (let item of self.seats) {
                if (seat.resSeatCode === item.resSeatCode) {
                    item.resSeatSaleStatus = 0
                    self.selectedSeat = []
                    self.allPrice = 0
                    for (let item2 of self.seats) {
                        if (item2.resSeatSaleStatus === -2) {
                            self.selectedSeat.push(item2)
                            self.allPrice += item2.price
                        }
                    }
                    self.selectedSeatLength = self.selectedSeat.length
                    break
                }
            }
        },
        // 锁座按钮
        lockSeat() {
            console.log('锁座')
            let seatList = []
            if (this.selectedSeat.length === 0) {
                return
            }
            for (let item of this.selectedSeat) {
                seatList.push({
                    decribe: item.resSeatRow + '排' + item.resSeatCol + '座',
                    priceId: item.priceId,
                    seatCode: item.resSeatCode
                })
            }
            let self = this
            let param = {}
            param.cinemaCode = self.$route.query.cinemaCode
            param.planShowId = self.$route.query.planShowId
            param.uidTicketType = self.priceList[0].uidTicketType
            param.seatList = seatList
            self.$axios.post('order_lockSeat', param).then(
                res => {
                    this.$router.push({
                        path: '/confirmOrder',
                        query: {
                            orderId: res.data.orderId,
                            cinemaCode: this.$route.query.cinemaCode
                        }
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
    filters: {
        filterDate(dates) {
            let allDate = dates
            let monthDateArr = allDate.split('-')
            let monthDate = monthDateArr[1] + '-' + monthDateArr[2]
            let showDay = [
                '周日',
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六'
            ]
            let date = new Date()
            let today = Date.parse(date)
            today = parseInt(today / (1000 * 24 * 60 * 60))
            let upDate = new Date(dates)
            let upDateStr = upDate / (1000 * 24 * 60 * 60)
            let week = showDay[new Date(dates).getDay()]
            if (upDateStr - today === 0) {
                week = '今天'
            } else if (upDateStr - today === 1) {
                week = '明天'
            } else if (upDateStr - today === 2) {
                week = '后天'
            }
            // console.log('哪一天', week, dates, monthDate)
            return week + ' ' + monthDate
        },
        filterShowDate(startShowDate) {
            if (!startShowDate) return
            let arr = startShowDate.split(':')
            let dateStr = arr[0] + ':' + arr[1]
            return dateStr
        }
    },
    components: {
        Btn
    }
}
</script>

<style lang="scss">
.hlTest {
    // transform: scale(1.5, 1.5);
    // transform-origin: left top;
    transition-duration: 1.2s;
}
.hlTest2 {
    // transform: scale(1, 1);
    transform-origin: left top;
    transition-duration: 1.2s;
}
.seatsItem0 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat0.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem1 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat1.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem2 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat2.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem3 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat3.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem4 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat4.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem5 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat5.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem6 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat6.png') no-repeat;
    background-size: 36px 34px;
}
.seatsItem7 {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50px;
    top: 50px;
    background: url('static/image/seatIcon/iconseat7.png') no-repeat;
    background-size: 36px 34px;
}
.lockBtn {
    background: #ccc !important;
    pointer-events: none;
}
</style>
<style lang="scss" module>
@import '../../components/scss/element.scss';
.panel {
    @include panel;
}
.allSeat {
    .buyHeader {
        width: 750px;
        height: 120px;
        background: #fff;
        border-bottom: 1px solid #dfdfdf;
        display: flex;
        padding: 14px 0 14px 36px;
        justify-content: space-around;
        flex-direction: column;
        box-sizing: border-box;
        & p:nth-child(1) {
            color: #262628;
            font-size: 36px;
            text-align: left;
            font-weight: 550;
            display: flex;
            align-items: center;
            .tipBox {
                margin-left: 10px;
                overflow: hidden;
                font-size: 20px;
                border-radius: 8px;
                display: inline-block;
                border: 1px solid #9da9dc;
                & span:nth-child(1) {
                    padding: 4px;
                    color: #fff;
                    display: inline-block;
                    background: linear-gradient(
                        -128.9deg,
                        rgba(184, 198, 255, 1),
                        rgba(154, 166, 216, 1)
                    );
                }
                & span:nth-child(2) {
                    padding: 5px;
                    background: #fff;
                    color: #9da9dc;
                    display: inline-block;
                }
            }
        }
        & p:nth-child(2) {
            color: #598cff;
            font-size: 28px;
            text-align: left;
        }
    }
    .buyHint {
        width: 750px;
        height: 80px;
        border-bottom: 1px solid #dfdfdf;
        background: #fff;
        display: flex;
        align-items: center;
        ul {
            width: 600px;
            display: flex;
            justify-content: space-around;
            li {
                font-size: 28px;
                line-height: 40px;
                height: 40px;
                display: flex;
            }
            .buyHintLi0::before {
                content: '';
                background: url('static/image/seatIcon/iconseat0.png') no-repeat;
                background-size: 36px 34px;
                width: 36px;
                height: 34px;
                display: inline-block;
                margin-right: 5px;
            }
            .buyHintLi1::before {
                content: '';
                background: url('static/image/seatIcon/iconseat7.png') no-repeat;
                background-size: 36px 34px;
                width: 36px;
                height: 34px;
                display: inline-block;
                margin-right: 5px;
            }
            .buyHintLi2::before {
                content: '';
                background: url('static/image/seatIcon/iconseat6.png') no-repeat;
                background-size: 36px 34px;
                width: 40px;
                height: 40px;
                display: inline-block;
                margin-right: 5px;
            }
            .buyHintLi3::before {
                content: '';
                border-radius: 4px;
                border: 2px dashed rgba(254, 120, 108, 1);
                width: 36px;
                height: 32px;
                display: inline-block;
                margin-right: 5px;
            }
            .buyHintTip::after {
                content: '';
                background: url('static/image/arrow-right.png') no-repeat;
                background-size: 36px 34px;
                width: 40px;
                height: 40px;
                display: inline-block;
                margin-left: 5px;
            }
        }
        div {
            width: 150px;
        }
        div:::after
    }
    .seatTitleBox {
        .seatTitle {
            text-align: center;
            span {
                display: inline-block;
                height: 36px;
                width: 288px;
                line-height: 36px;
                background: #ced0da;
                border-bottom-left-radius: 40px;
                border-bottom-right-radius: 40px;
            }
        }
        .seatIn {
            text-align: center;
        }
        .seatInImg {
            width: 40px;
            height: 40px;
            background: url('static/image/seatSecleted.png') no-repeat;
            background-size: 40px 40px;
        }
    }
    .seatBox {
        width: 750px;
        overflow: hidden;
        height: 600px;
        min-width: 750px!important;
        // margin-top: 70px;
        .seatIn {
            p {
                text-align: center;
                span {
                    display: inline-block;
                    width: 100px;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 4px;
                    // border: 1px solid #9B9B9B;
                    border: 1px solid #000;
                    color: #9b9b9b;
                }
            }
        }
        .seatsList {
            color: #fff;
            position: relative;
            .seatRowBox {
                position: absolute;
                border-radius: 16px;
                background-color: #888;
                width: 32px;
                // padding: 95px 0;
                box-sizing: border-box;
                .seatRow {
                    width: 32px;
                    color: pink;
                    line-height: 50px;
                }
            }
            .seatsItem {
                position: absolute;
                width: 50px;
                height: 50px;
                left: 50px;
                top: 50px;
                background: url('static/image/seatSecleted.png') no-repeat;
                background-size: 40px 40px;
            }
        }
    }
    .seatFooter {
        width: 750px;
        height: 236px;
        border-top: 1px solid #dfdfdf;
        background: pink;
        position: fixed;
        left: 0;
        bottom: 0;
        .seatSelected {
            height: 134px;
            padding: 9px 30px 18px;
            box-sizing: border-box;
            background: #fff;
            p {
                text-align: left;
                margin-top: 3px;
                span:nth-child(1) {
                    color: #262628;
                }
                span:nth-child(2) {
                    color: #9b9b9b;
                }
            }
            ul {
                display: flex;
                margin-top: 6px;
                .seactItem {
                    position: relative;
                    width: 122px!important;
                    height: 64px!important;
                    background: url('static/image/seatIcon/selectSeat.png') no-repeat;
                    background-size: 122px 64px;
                    // border: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    color: #95b5ff;
                    margin: 0 8px;
                    & span:nth-child(1) {
                        display: inline-block;
                        text-align: center;
                        color: #262628;
                    }
                    & span:nth-child(2) {
                        display: inline-block;
                        color: #F43933;
                        text-align: center;
                    }
                    div {
                        position: absolute;
                        top: 0;
                        color: #000000;
                        right: 3px;
                    }
                }
            }
        }
        .seatSelectedUp {
            display: flex;
            align-items: center;
            padding: 0 30px;
            box-sizing: border-box;
            justify-content: space-between;
            width: 750px;
            height: 102px;
            background: #fafafc;
            border-top: 1px solid #dfdfdf;
            p {
                display: flex;
                align-items: center;
                & span:nth-child(1) {
                    font-size: 28px;
                    color: #7a797b;
                }
                & span:nth-child(2) {
                    font-size: 48px;
                    color: #f43933;
                }
            }
            .buy {
                width: 172px !important;
                height: 56px !important;
                border-radius: 28px !important;
            }
        }
    }

    .swrap{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 40;
        background: rgba(0, 0, 0, 0.5);
        .swrapIn{
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 8px;
            width: 500px;
            height: 310px;
            margin: auto;
            position: absolute;
            background: #fff;
            .swrapInSeat{
                display: flex;
                height: 110px;
                padding: 0 25px;
                box-sizing: border-box;
                justify-content: space-around;
                .swrapInSeatLi{
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }
            }
            .knowBtn{
                border-top: 1px solid rgba(223,223,223,1);
                height: 90px;
                line-height: 90px;
                color: #5B8EFF;
                font-size: 30px;
            }
        }
    }
}
</style>
