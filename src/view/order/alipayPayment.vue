<template>
    <div>
        <div v-if="showPic" class="mask">
            <img class="tip" src="../../../static/image/alipayTip.png">
        </div>
    </div>
</template>
<script>
import { isWeiXin } from '@/js/util.js'
export default {
    data() {
        return {
            showPic: false
        }
    },
    created() {
        setTitle('订单支付')
        this.getAlipayHtml()
    },
    methods: {
        getAlipayHtml() {
            let self = this
            isWeiXin(
                function() {
                    self.showPic = true
                },
                function() {
                    self.showPic = false
                    let orderId = self.$route.query.orderId
                    self.$axios
                        .post('order_aliPayment', { orderId: orderId })
                        .then(
                            res => {
                                const div = document.createElement('div')
                                div.innerHTML = res.data
                                document.body.appendChild(div)
                                document.forms.alipaysubmit.submit()
                            },
                            err => {
                                self.$MessageAlert(err.msg)
                                // const div = document.createElement('div')
                                // div.innerHTML = '<div>获取支付页面失败，请刷新页面重试</div>'
                                // document.body.appendChild(div)
                                // document.forms.alipaysubmit.submit()
                            }
                        )
                }
            )
        }
    }
}
</script>
<style lang="scss">
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background:rgba(51,51,51,0.93);
}
.tip{
    position: absolute;
    left: 140px;
    top:0;
    width: 570px;
    height: 262px;
}
</style>
