<template>
    <ul class="orderCom-ul">
        <li class="orderCom-li" v-for="(item, index) in completeOrderData" :key="index" @click="btnDetails(item)">
            <div v-if="item.orderType == 1">
                <div class="movie"> {{ item.cinemaName }} </div>
                <!-- 单品详情 -->
                <div class="film">
                    <div class="filmImg"> <img :src="item.icon" alt=""> </div>
                    <!-- 影票详情 -->
                    <div class="filmContetn">
                        <div class="movieName">
                            <span> {{ item.orderMap.movieName }} </span>
                            <span> {{ item.orderMap.ticketNum}}张 </span>
                        </div>
                        <div class="movieDate">
                            <span>{{transPlanShowDate(item.orderMap.startPlanShow)}}</span>
                            <span>{{transPlanShowTime(item.orderMap.startPlanShow,item.orderMap.endPlanShow)}}</span>
                        </div>
                        <div class="seat">
                            <span>{{ item.orderMap.hallName }}</span>
                            <span>{{ item.orderMap.ticketDescribe }}</span>
                        </div>
                    </div>
                </div>
                <div class="totalPrice">
                    <div class="price">
                        <span>总价:</span>
                        <span class="total">{{ item.totalAmount }}</span>
                        <span> 元 </span>
                    </div>
                    <div class="complete" :class="{'pickUp': item.orderStatus == 2}"> {{ statusData(item.orderStatus) }} </div>
                </div>
            </div>
            <div v-if="item.orderType == 2">
                <div class="movie"> {{ item.cinemaName }} </div>
                <div class="filmB">
                    <div class="filmImgB"> <img :src="item.icon" alt=""> </div>
                    <!-- 影票详情 -->
                    <div class="filmContetn">
                        <div class="movieName">
                            <span> {{ item.orderMap.movieName }} </span>
                            <span> {{ item.orderMap.ticketNum }}张 </span>
                        </div>
                        <div class="movieDate">
                            <span>{{transPlanShowDate(item.orderMap.startPlanShow)}}</span>
                            <span>{{transPlanShowTime(item.orderMap.startPlanShow,item.orderMap.endPlanShow)}}</span>
                        </div>
                        <div class="seat">
                            <span>{{ item.orderMap.hallName }}</span>
                            <span>{{ item.orderMap.ticketDescribe }}</span>
                        </div>
                        <div class="combo">
                            {{ item.orderMap.merDescribe }}
                        </div>
                    </div>
                </div>
                <div class="totalPrice">
                    <div class="price">
                        <span>总价:</span>
                        <span class="total">{{ item.totalAmount }}</span>
                        <span> 元 </span>
                    </div>
                    <div class="complete" :class="{'pickUp': item.orderStatus == 2}"> {{ statusData(item.orderStatus) }} </div>
                </div>
            </div>
            <div v-if="item.orderType == 3">
                <div class="movie"> {{ item.cinemaName }} </div>
                <div class="film">
                    <div class="filmImg"> <img :src="item.icon" alt=""> </div>
                    <!-- 套餐详情 -->
                    <div class="filmCombe">
                        {{ item.orderMap.merDescribe }}
                    </div>
                </div>
                <div class="totalPrice">
                    <div class="price">
                        <span>总价:</span>
                        <span class="total">{{ item.totalAmount }}</span>
                        <span> 元 </span>
                    </div>
                    <div class="complete" :class="{'pickUp': item.orderStatus == 2}"> {{ statusData(item.orderStatus) }} </div>
                </div>
            </div>
            <div v-if="item.orderType == 4">
                <div class="movie"> {{ item.cinemaName }} </div>
                <div class="film">
                    <div class="filmImg"> <img :src="item.icon" alt=""> </div>
                    <!-- 套餐详情 -->
                    <div class="filmCombe">
                        {{ item.orderMap.merDescribe }}
                    </div>
                </div>
                <div class="totalPrice">
                    <div class="price">
                        <span>总价:</span>
                        <span class="total">{{ item.totalAmount }}</span>
                        <span> 元 </span>
                    </div>
                    <div class="complete" :class="{'pickUp': item.orderStatus == 2}"> {{ statusData(item.orderStatus) }} </div>
                </div>
            </div>
            <div v-if="item.orderType == 5">
                <div class="movie"> {{ item.cinemaName }} </div>
                <div class="film">
                    <div class="filmImg"> <img :src="item.icon" alt=""> </div>
                    <!-- 套餐详情 -->
                    <div class="filmCombe">
                        {{ item.orderMap.merDescribe }}
                    </div>
                </div>
                <div class="totalPrice">
                    <div class="price">
                        <span>总价:</span>
                        <span class="total">{{ item.totalAmount }}</span>
                        <span> 元 </span>
                    </div>
                    <div class="complete" :class="{'pickUp': item.orderStatus == 2}"> {{ statusData(item.orderStatus) }} </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
import { strDateFormat } from '@/js/dateUtils.js'
export default {
    name: 'order',
    props: {
        isSellPath: false,
        completeOrderData: Array,
        default: () => {
            return []
        }
    },
    data() {
        return {}
    },
    methods: {
        statusData(data) {
            if (data === 1) {
                return '待支付'
            } else if (data === 2) {
                return '待取货'
            } else if (data === 3) {
                return '完结'
            } else {
                return '失败'
            }
        },
        // 放映日期
        transPlanShowDate(startPlanShow) {
            return strDateFormat(startPlanShow, 'MM月dd日')
        },
        // 放映开始时间 、结束时间
        transPlanShowTime(startPlanShow, endPlanShow) {
            let starTime = strDateFormat(startPlanShow, 'hh:mm')
            if (typeof endPlanShow === 'undefined') {
                endPlanShow = startPlanShow
            }
            let endTime = strDateFormat(endPlanShow, 'hh:mm')
            return starTime + ' - ' + endTime
        },
        btnDetails(item) {
            let orderStatus = item.orderStatus
            let orderType = item.orderType
            if (orderType === 4) {
                return false
            }
            if (orderStatus === 1) {
                if (this.isSellPath === true) {
                    this.$router.push({
                        name: 'unpayorder',
                        query: { orderId: item.orderId, continuePay: 1, path: 'sellPath' }
                    })
                } else {
                    this.$router.push({
                        name: 'unpayorder',
                        query: { orderId: item.orderId, continuePay: 1 }
                    })
                }
            } else {
                this.$router.push({
                    name: 'orderDetail',
                    query: { orderId: item.orderId }
                })
            }
        }
    },
    components: {}
}
</script>

<style lang="scss">
.orderCom-ul {
    margin-top: 30px;
    .orderCom-li {
        // height: 326px;
        padding: 0 30px;
        background: #fff;
        margin-bottom: 20px;
        text-align: left;
        .movie {
            height: 78px;
            line-height: 78px;
            font-size: 28px;
            color: #4a4a4a;
        }
        .film {
            height: 168px;
            display: flex;
            .filmImg {
                width: 168px;
                height: 168px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .filmContetn {
                width: 522px;
                height: 100%;
                padding: 24px 0 24px 20px;
                box-sizing: border-box;
                background: #f8f8f8;
                .movieName {
                    font-size: 32px;
                    color: #262628;
                    height: 44px;
                    line-height: 44px;
                }
                .movieDate {
                    font-size: 24px;
                    color: #9b9b9b;
                    height: 34px;
                    line-height: 34px;
                }
                .seat {
                    font-size: 24px;
                    color: #9b9b9b;
                    height: 34px;
                    line-height: 34px;
                }
            }
            .filmCombe {
                padding: 46px 0 34px 22px;
                box-sizing: border-box;
                width: 522px;
                height: 100%;
                background: #f8f8f8;
                font-size: 32px;
                color: #262628;
                display: flex;
                align-items: center;
            }
        }
        .filmB {
            height: 210px;
            display: flex;
            .filmImgB {
                width: 168px;
                height: 210px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .filmContetn {
                height: 100%;
                width: 522px;
                background: #f8f8f8;
                padding: 24px 0 12px 20px;
                box-sizing: border-box;
                .movieName {
                    font-size: 32px;
                    color: #262628;
                    height: 44px;
                    line-height: 44px;
                }
                .movieDate {
                    font-size: 24px;
                    color: #9b9b9b;
                    height: 34px;
                    line-height: 34px;
                }
                .seat {
                    font-size: 24px;
                    color: #9b9b9b;
                    height: 34px;
                    line-height: 34px;
                }
                .combo {
                    margin-top: 14px;
                    font-size: 28px;
                    color: #262628;
                    line-height: 40px;
                    height: 40px;
                }
            }
        }
        .totalPrice {
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .price {
                height: 34px;
                font-size: 24px;
                color: #000000;
                .total {
                    font-size: 32px;
                }
            }
            .complete {
                font-size: 28px;
                color: #9b9b9b;
            }
        }
    }
}

.pickUp {
    color: #0035a4 !important;
}
</style>
