<template>
    <div v-if="completeOrderData.length>0">
        <orderComponent :isSellPath="isSellPath" :completeOrderData="completeOrderData" />
    </div>
    <div class="noBill" v-else>
        <img class='noBillImg' src="/static/image/default/noBill.png" alt="">
        <span class="noBillSpan">{{noBillSpanText}}</span>
    </div>
</template>

<script>
import orderComponent from './order-component'
export default {
    data() {
        return {
            noBillSpanText: '',
            completeOrderData: [],
            isSellPath: false
        }
    },
    created: function() {
        if (this.$route.query.path === 'sellPath') {
            this.isSellPath = true
        }
        this.queryOrderList()
    },
    methods: {
        queryOrderList() {
            let self = this
            let paramData = {}
            // 待取货
            let orderStatus = parseInt(self.$route.query.orderStatus)
            paramData.orderStatus = orderStatus

            if (paramData.orderStatus === 1) {
                self.noBillSpanText = '无待处理订单'
                setTitle('待处理')
            } else if (paramData.orderStatus === 2) {
                setTitle('待取货')
                self.noBillSpanText = '暂无待取货'
            } else if (paramData.orderStatus === 3) {
                paramData.orderStatus = undefined
                self.noBillSpanText = '暂无订单'
                setTitle('我的订单')
            }
            self.$axios.post('order_queryOrderList', paramData).then(
                res => {
                    console.log('成功。。。')
                    console.log('--->', res)
                    self.completeOrderData = res.data
                },
                err => {
                    console.log('错误。。。')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        }
    },
    components: { orderComponent }
}
</script>

<style lang="scss">
.noBill {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.noBillImg {
    width: 360px;
    margin-top: 180px;
    display: block;
}
.noBillSpan {
    margin-top: 90px;
    color: #7a797b;
    font-size: 32px;
}
</style>
