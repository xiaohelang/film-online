<template>
    <div>
        <div class="mask">copy地址</div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
    // mounted() {
    // if (location.hash.indexOf('error') != -1) {
    //     alert('参数错误，请检查')
    // } else {
    //     var ua = navigator.userAgent.toLowerCase()
    //     let tip = this.$refs.myWeixinTip
    //     let tipImg = this.$refs.myWeixinTipContent
    //     if (ua.indexOf('micromessenger') != -1) {
    //         tip.style.display = 'block'
    //         tipImg.style.display = 'block'

    //         if (
    //             ua.indexOf('iphone') != -1 ||
    //             ua.indexOf('ipad') != -1 ||
    //             ua.indexOf('ipod') != -1
    //         ) {
    //             tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone'
    //         } else {
    //             tipImg.className = 'J-weixin-tip-img weixin-tip-img android'
    //         }
    //     } else {
    //         var getQueryString = function(url, name) {
    //             var reg = new RegExp(
    //                 '(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)',
    //                 'i'
    //             )
    //             if (reg.test(url)) return RegExp.$2.replace(/\+/g, ' ')
    //         }
    //         var param = getQueryString(location.href, 'goto') || ''
    //         location.href =
    //             param != '' ? _AP.decode(param) : 'pay.htm#error'
    //     }
    // }
    // }
}
</script>
<style lang="scss">
.alert {
    width: 750px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
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
        background: rgba(0, 0, 0, 0.5);
    }
    .content {
        width: 500px;
        height: 436px;
        background: #fff;
        border-radius: 8px;
        margin-top: 220px;
        position: absolute;
        z-index: 999999;
        > p {
            height: 89px;
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #262628;
            border-bottom: 1px solid #dfdfdf;
            span {
                position: absolute;
                left: 30px;
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
            display: flex;
            flex-wrap: wrap;
            left: 0;
            bottom: 0;
            background: rgba(237, 238, 245, 1);
            padding-top: 12px;
            box-sizing: border-box;
            li {
                width: 234px;
                height: 92px;
                margin-left: 12px;
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
