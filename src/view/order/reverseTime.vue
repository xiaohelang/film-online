<template>
    <div class="time">
        <span>支付剩余时间：</span>
        <span :expireTime="expireTime" :callback="callback">{{content}}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            content: ''
        }
    },
    props: {
        expireTime: {
            type: String,
            default: ''
        },
        endText: {
            type: String,
            default: '已超时！'
        },
        callback: {
            type: Function,
            default: function() {
                console.log('支付已超！')
            }
        }
    },
    created() {
        this.countdowm(this.expireTime)
    },
    methods: {
        // 倒计时
        countdowm(expireTime) {
            let self = this
            let timer = setInterval(function() {
                let nowTime = new Date()
                // let endTime = new Date(expireTime.replace(/\s+/g, 'T'))
                let endTime = new Date(Date.parse(expireTime.replace(/-/g, '/')))
                let t = endTime.getTime() - nowTime.getTime()
                if (t > 0) {
                    let day = Math.floor(t / 86400000)
                    let hour = Math.floor((t / 3600000) % 24)
                    let min = Math.floor((t / 60000) % 60)
                    let sec = Math.floor((t / 1000) % 60)
                    hour = hour < 10 ? '0' + hour : hour
                    min = min < 10 ? '0' + min : min
                    sec = sec < 10 ? '0' + sec : sec
                    let format = ''
                    if (day > 0) {
                        format = `${day}:${hour}:${min}:${sec}`
                    }
                    if (day <= 0 && hour > 0) {
                        format = `${hour}:${min}:${sec}`
                    }
                    if (day <= 0 && hour <= 0) {
                        format = `${min}:${sec}`
                    }
                    if (day <= 0 && hour <= 0 && min <= 0) {
                        format = `${sec}`
                    }
                    self.content = format
                } else {
                    clearInterval(timer)
                    self.content = self.endText
                    self._callback()
                }
            }, 1000)
        },
        countdowm2(expireTime) {
            let self = this
            let timer = setInterval(function() {
                // 时间戳差
                let timestamp = Date.parse(new Date()) / 1000
                let date = new Date(Date.parse(expireTime.replace(/-/g, '/')))
                // 设定时间的时间戳
                let timestampSet = parseInt(date.getTime() / 1000)
                let chaTimestamp = timestampSet - timestamp
                // 剩余天数
                let syDay = parseInt(chaTimestamp / (3600 * 24))
                // 剩余小时
                let syHour = parseInt((chaTimestamp - syDay * 3600 * 24) / 3600)
                // 剩余分钟
                let syMin = parseInt(
                    (chaTimestamp - syHour * 3600 - syDay * 24 * 3600) / 60
                )
                // 剩余秒数
                let syMiao =
                    chaTimestamp -
                    syDay * 3600 * 24 -
                    syHour * 3600 -
                    syMin * 60
                if (syMiao < 0) {
                    clearInterval(timer)
                    self.content = self.endText
                    self._callback()
                } else {
                    self.content = syDay + syHour + syMin + syMiao
                }
            }, 1000)
        },

        _callback() {
            if (this.callback && this.callback instanceof Function) {
                this.callback(...this)
            }
        }
    }
}
</script>

<style lang="scss">
.time {
    width: 750px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    background: rgba(253, 252, 236, 1);
    span {
        color: rgba(248, 110, 33, 1);
        font-size: 28px;
    }
}
</style>
