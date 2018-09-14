<template lang="html">
    <ul class="all-card">
        <li class="card-li">
            <div class="card-title">
                <div class="card-left">
                    <img style="width: 0.3rem; height: 0.3rem; margin-right: 0.1rem;" src="static/image/card/card-move.png" alt="">
                    <p>广州超级万达国际影城(天河店9999999)</p>
                    <div>金卡</div>
                </div>
                <div class="card-right">储值卡</div>
            </div>
            <p class="card-p1">4002 8888 3455</p>
            <p class="card-p2">500元</p>
            <p class="card-p3">（基本余额：400元，赠送余额：100元）</p>
            <div class="card-but">
                <div class="but-left">2019-12-12到期</div>
                <div class="but-right">默认</div>
                <div class="but-warp"></div>
            </div>
            <div v-if="false" class="li-warp">
                <img src="static/image/card/card-com.png" alt="">
            </div>
        </li>
        <div class="money-detail">
            <div class="detail-title">余额明细</div>
            <div class="detail-cell">
                <p style="font-weight:550;">
                    <span style="color: #262628; font-size: 0.32rem;">APP缤纷桶、后来的我们</span>
                    <span style="color: #F43933; font-size: 0.32rem;">-114</span>
                </p>
                <p>
                    <span style="color: #9B9B9B; font-size: 0.24rem;">万达国际影城（天河店）</span>
                    <span style="color: #9B9B9B; font-size: 0.24rem;">2018-5-21</span>
                </p>
            </div>
            <div class="detail-cell">
                <p style="font-weight:550;">
                    <span style="color: #262628; font-size: 0.32rem;">APP缤纷桶、后来的我们</span>
                    <span style="color: #4CD05D; font-size: 0.32rem;">+300</span>
                </p>
                <p>
                    <span style="color: #9B9B9B; font-size: 0.24rem;">万达国际影城（天河店）</span>
                    <span style="color: #9B9B9B; font-size: 0.24rem;">2018-5-21</span>
                </p>
            </div>
        </div>
    </ul>
</template>

<script>
export default {
    methods: {
        sliderClick(item) {
            this.$emit('upSliderClick', item)
        }
    }
}
</script>

<style lang="scss">
.all-card {
    width: 750px;
    padding: 30px;
    box-sizing: border-box;
    .card-li {
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
        .li-warp{
            position: absolute;
            width: 690px;
            height: 414px;
            background: rgba(0,0,0,0.5);
            left: 0;
            top: 0;
            >img{
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
                    width: 90px;
                    border-radius: 2px;
                    height: 36px;
                    font-size: 22px;
                    line-height: 36px;
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
                background:rgba(255,255,255,1);
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
            // margin-top: 20px;
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
            align-items: center;
            width: 690px;
            height: 50px;
            padding: 0 30px;
            font-size: 28px;
            box-sizing: border-box;
            position: relative;
            .but-warp{
                position: absolute;
                left: 0;
                top: 0;
                width: 690px;
                height: 50px;
                background: rgba(0,0,0,0.3);
            }
        }
    }
    .money-detail{
        width: 690px;
        background: #Fff;
        margin-top: 32px;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.08);
        .detail-title{
            width: 690px;
            height: 78px;
            border-bottom: 1px solid rgba(223,223,223,1);
            padding-left: 40px;
            box-sizing: border-box;
            line-height: 78px;
            color: #7A797B;
            font-size: 30px;
            text-align: left;
        }
        .detail-cell{
            width: 630px;
            height: 120px;
            margin-left: 30px;
            border-bottom: 1px dashed #ccc;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px 0;
            box-sizing: border-box;
            p{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
</style>
