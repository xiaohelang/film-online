<template>
    <div class="allLogin">
        <p>登录会员，享受会员优惠</p>
        <div class="phone">
            <img src="static/image/login-phone.png" alt="">
            <input max="99999999999" type="number" placeholder="请输入手机号码" v-model="phoneInput" v-on:input="phone($event)">
        </div>
        <div class="phone" style="margin-bottom: 1.2rem;">
            <img src="static/image/login-lock.png" alt="">
            <input type="number" placeholder="请输入验证码" v-model="verCode">
            <div v-if="checkCode" class="checkCode" @click="sendCode">发送验证码</div>
            <div v-else-if="!checkCode" class="checkTime">剩下{{sumTime}}s</div>
        </div>
        <div class="loginBtn" @click="login">
            登录
        </div>
    </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers'
export default {
    data() {
        return {
            checkCode: true,
            phoneInput: '',
            timer: null,
            sumTime: 99,
            verCode: '',
            cinemaCode: '',
            path: ''
        }
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         console.log('--from--1--')
    //         console.log(from)
    //         console.log(to)
    //         vm.path = from.path
    //     })
    // },
    created() {
        this.$nextTick(() => {
            setTitle('会员登录')
            this.path = this.$route.query.path
            console.log(`path:${this.path}`)
        })
    },
    methods: {
        // 发送验证码
        sendCode() {
            let self = this
            let paramData = {}
            paramData.mobile = self.phoneInput
            paramData.type = 0
            self.$axios.post('sms_send', paramData).then(
                res => {
                    console.log('--------发送短信----res------')
                    console.log(res)
                },
                err => {
                    console.log('--------发送短信----err------')
                    console.log(err)
                }
            )
            self.checkCode = false
            self.setTimer()
        },
        // 登录
        login() {
            let self = this
            self.cinemaCode = this.$route.query.cinemaCode
            let paramData = {}
            paramData.cinemaCode = self.cinemaCode
            paramData.mobile = self.phoneInput
            paramData.verCode = self.verCode
            // 用于测试
            // let cinemaCode = self.$route.query.cinemaCode
            // let planShowId = self.$route.query.planShowId
            // let movieCode = self.$route.query.movieCode
            // // self.$router.push({path: '/login'})
            // // this.$router.push({path: '/login', query: {'cinemaCode': cinemaCode}})
            // if (self.path === 'filmplan') {
            //     self.$router.push({
            //         path: '/filmplan',
            //         query: {
            //             cinemaCode: cinemaCode,
            //             movieCode: movieCode
            //         }
            //     })
            // } else if (self.path === 'buySeat') {
            //     self.$router.push({
            //         path: '/buySeat',
            //         query: {
            //             planShowId: planShowId,
            //             cinemaCode: cinemaCode
            //         }
            //     })
            // } else if (self.path === 'me') {
            //     self.$router.push({
            //         path: '/me',
            //         query: {
            //             cinemaCode: cinemaCode
            //         }
            //     })
            // } else if (self.path === 'shop') {
            //     self.$router.push({
            //         path: '/shop',
            //         query: {
            //             cinemaCode: cinemaCode
            //         }
            //     })
            // } else if (self.path === 'sell') {
            //     self.$router.push({
            //         path: '/sell',
            //         query: {
            //             cinemaCode: cinemaCode
            //         }
            //     })
            // }
            self.$axios.post('member_bind', paramData).then(
                res => {
                    console.log('--------登录----res------')
                    console.log(res)
                    if (res.status.status === 0) {
                        let cinemaCode = self.$route.query.cinemaCode
                        let planShowId = self.$route.query.planShowId
                        let movieCode = self.$route.query.movieCode
                        // self.$router.push({path: '/login'})
                        // this.$router.push({path: '/login', query: {'cinemaCode': cinemaCode}})
                        if (self.path === 'filmplan') {
                            self.$router.push({
                                path: '/filmplan',
                                query: {
                                    cinemaCode: cinemaCode,
                                    movieCode: movieCode
                                }
                            })
                        } else if (self.path === 'buySeat') {
                            self.$router.push({
                                path: '/buySeat',
                                query: {
                                    planShowId: planShowId,
                                    cinemaCode: cinemaCode
                                }
                            })
                        } else if (self.path === 'me') {
                            self.$router.push({
                                path: '/me',
                                query: {
                                    cinemaCode: cinemaCode
                                }
                            })
                        } else if (self.path === 'shop') {
                            self.$router.push({
                                path: '/shop',
                                query: {
                                    cinemaCode: cinemaCode
                                }
                            })
                        } else if (self.path === 'sell') {
                            self.$router.push({
                                path: '/sell',
                                query: {
                                    cinemaCode: cinemaCode
                                }
                            })
                        }
                    }
                },
                err => {
                    console.log('--------登录----err------')
                    console.log(err)
                    self.$MessageAlert(err.msg)
                }
            )
        },
        phone(e) {
            let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
            if (this.phoneInput.length === 11) {
                if (myreg.test(this.phoneInput)) {
                    console.log('正确电话号码')
                } else {
                    console.log('不正确电话号码')
                }
            }
        },
        setTimer() {
            let self = this
            clearInterval(self.timer)
            self.timer = setInterval(() => {
                if (self.sumTime === 0) {
                    self.checkCode = true
                    self.sumTime = 99
                    clearInterval(self.timer)
                } else {
                    self.sumTime--
                }
            }, 1000)
        }
    },
    components: {}
}
</script>

<style lang="scss">
.allLogin {
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    box-sizing: border-box;
    > p {
        font-size: 40px;
        color: #598cff;
        margin-top: 180px;
        font-weight: 550;
        margin-bottom: 112px;
    }
    .phone {
        display: flex;
        width: 690px;
        align-items: center;
        border-bottom: 1px solid rgba(223, 223, 223, 1);
        padding: 10px 0;
        margin-bottom: 70px;
        img {
            height: 36px;
        }
        input[type='number'] {
            outline: none;
            border: none;
            margin-left: 10px;
            font-size: 30px;
            width: 500px;
            height: 50px;
        }
        .checkCode {
            padding: 10px 12px;
            box-sizing: border-box;
            border-radius: 8px;
            color: #fff;
            background: -webkit-linear-gradient(
                -124.3deg,
                rgba(111, 133, 255, 1),
                rgba(84, 170, 255, 1)
            );
        }
        .checkTime {
            padding: 10px 12px;
            box-sizing: border-box;
            border-radius: 8px;
            color: #fff;
            background: #ccc;
        }
    }
    .loginBtn {
        width: 690px;
        height: 84px;
        color: #fff;
        line-height: 84px;
        text-align: center;
        font-size: 34px;
        border-radius: 8px;
        margin-top: 20px;
        background: -webkit-linear-gradient(
            -124.3deg,
            rgba(111, 133, 255, 1),
            rgba(84, 170, 255, 1)
        );
    }
}
</style>
