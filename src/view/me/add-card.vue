<template lang="html">
    <div class="all-page">
        <div class="card-page">
            <div class="changeCinema bottom-line" @click="selectCin">
                影院名称：
                <span class="cinema22">{{comp_cinema.cinemaName}}</span>
                <img class="right-img" src="static/image/arrow-right.png" alt="">
            </div>
            <mt-field class="bottom-line" label="会员卡号：" type="tel" placeholder="请输入会员卡号" v-model="cardNo"></mt-field>
            <mt-field label="会员密码：" placeholder="请输入密码" type="password" v-model="memberPassword"></mt-field>
            <!-- <mt-field label="会员密码：" :attr="{ maxlength: 6 }" placeholder="请输入密码" type="password" v-model="memberPassword"></mt-field> -->
        </div>
        <div class="cellLeft">
            <input type="checkbox" id="isSelect" name="sex" v-model="toggle"/>
            <label for="isSelect">设为默认卡</label>
            <!-- <label></label> -->
        </div>
        <div class="bindBtn" @click='addCard'>
            确认绑定
        </div>
        <transition name='slideDown'>
            <SelectCinema ref='SelectCinema' :addCard='true' :currentCinema='comp_cinema' :cinemaList='comp_cinemaList' :selector='isSelector' @upCloseCinemaSelector="closeCinemaSelector"></SelectCinema>
        </transition>
    </div>
</template>

<script>
import { Field } from 'mint-ui'
import SelectCinema from '@/components/common/selectCinema.vue'
export default {
    data() {
        return {
            toggle: false,
            isSelector: false,
            cardNo: '',
            memberPassword: '',
            comp_cinemaList: [],
            comp_cinema: {
                cinemaAddress: '',
                cinemaCode: '',
                cinemaName: '请选择影院'
            },
            cardList: [
                //     {cinemaName: '广州超级万达国际影城(天河店9999999)',
                //     cardLevelName: '金卡',
                //     cardLevelType: 0,
                //     cardNo: '4002 8888 3455',
                //     remainMoneyCash: 3000,
                //     remainMoneyCift: 400,
                //     cardValidDate: '2019-08-09',
                //     isDefaultCard: 0,
                //     overdue: 0
                // }
            ]
        }
    },
    created() {
        setTitle('添加会员卡')
        if (this.$omsCacheInfo.getCinemaInfo()) {
            this.comp_cinema = this.$omsCacheInfo.getCinemaInfo()
        }
        this.getCinemaList()
        // this.getCards()
    },
    methods: {
        selectCin() {
            this.isSelector = true
        },
        closeCinemaSelector(e) {
            console.log('关闭页面---')
            console.log(e)
            if (e !== undefined) {
                this.comp_cinema = e
            }
            this.isSelector = false
        },
        getCinemaList() {
            let self = this
            let paramData2 = {}
            paramData2.displayStyle = 2
            self.$axios.post('home_getComponentContent', paramData2).then(
                res => {
                    self.comp_cinemaList = res.data
                    // self.$omsCacheInfo.setCinemaList(self.comp_cinemaList)
                },
                err => {
                    self.comp_cinemaList = {}
                    // self.$omsCacheInfo.setCinemaList('')
                    console.log(err)
                }
            )
        },
        // 绑定卡
        addCard() {
            let self = this
            console.log('------------绑定卡--------------------')
            console.log(this.toggle)
            if (this.comp_cinema.cinemaCode === '') {
                this.$MessageAlert('请选择影院~')
                return false
            }
            if (this.cardNo === '') {
                this.$MessageAlert('请填写会员卡号~')
                return false
            }
            if (this.memberPassword === '') {
                this.$MessageAlert('请输入会员卡密码~')
                return false
            }
            // let psw = parseInt(self.memberPassword)

            // if (isNaN(psw) || psw.toString().length !== 6) {
            //     this.$MessageAlert('请输入6位数字密码~')
            //     return false
            // }
            this.bindMemberCard(this.cardNo, this.comp_cinema.cinemaCode, this.memberPassword, () => {
                if (self.toggle === true) {
                    self.setCard()
                }
            })
        },
        bindMemberCard(cardNo, cinemaCode, memberPassword, successFn) {
            let self = this
            self.$axios.post('member_bindMemberCard', {
                cardNo,
                cinemaCode,
                memberPassword
            }).then(res => {
                console.log('绑定成功')
                console.log(res)
                if (res.status.status === 0) {
                    if (self.toggle === false) {
                        // self.$MessageAlert(res.status.msg2Client)
                        self.$alertCallBack(
                            res.status.msg2Client,
                            function() {
                                self.$router.go(-1)
                            }
                        )
                    }
                }
                successFn && successFn()
            }, err => {
                console.log('绑定失败')
                console.log(err)
                self.$MessageAlert(err.msg)
            })
        },
        // 设置默认卡
        setCard() {
            let self = this
            let cardNo = self.cardNo
            self.$axios.post('member_setDefaultCard', { cardNo }).then(
                res => {
                    console.log('设置默认卡--res')
                    console.log(res)
                    if (res.status.status === 0) {
                        self.$alertCallBack(
                            res.status.msg2Client,
                            function() {
                                // self.$router.replace({path: 'membercode'})
                                self.$router.go(-1)
                            }
                        )
                    }
                },
                err => {
                    self.$MessageAlert(err.msg)
                }
            )
        }
    },
    filters: {
        filterTime(timestamp) {
            var date = new Date(timestamp)
            let Y = date.getFullYear() + '-'
            let M =
                (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + '-'
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            return Y + M + D
        }
    },
    components: {
        Field,
        SelectCinema
    }
}
</script>

<style lang="scss">
.all-page {
    width: 750px;
    padding-top: 20px;
    box-sizing: border-box;
}
.bottom-line{
    position: relative;
    font-size: 28px;
}
.bottom-line::before{
    content: '';
    width: 700px;
    height: 1px;
    background: rgba(223,223,223,1);;
    position: absolute;
    right: 0;
    bottom: 1px;
}
.test{
    display: flex;
    align-items: center;
    justify-content: center;
}
.changeCinema{
    height: 90px;
    background: #fff;
    display: flex;
    line-height: 90px;
    font-size: 32px;
    padding-left: 50px;
    box-sizing: border-box;
    position: relative;
    .cinema22{
        margin-left: 20px;
    }
    .right-img{
        width: 15px;
        height: 20px;
        position: absolute;
        top: 35px;
        right: 35px;
    }
}
.bindBtn{
    width: 530px;
    height: 84px;
    color: #fff;
    line-height: 84px;
    text-align: center;
    background:linear-gradient(-124.3deg,rgba(111,133,255,1),rgba(84,170,255,1));
    border-radius:8px;
    font-size: 34px;
    margin:120px auto;

}
.cellLeft{
    height: 100%;
    display: flex;
    align-items: center;
    margin-top: 40px;
    margin-left: 40px;
    font-size: 24px;
    align-items: center;
    // background: green;
    &>input[type="checkbox"] + label::before {
        content: ""; /*不换行空格*/
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        width: 40px;
        height: 40px;
        margin-right: .4em;
        border:2px solid rgba(208,208,208,1);
        border-radius: 8px;
        border: 2px solid rgba(194,196,202,1);
        text-indent: .15em;
        line-height: 1;
    }
    &>input[type="checkbox"]:checked + label::before {
        // background-color: #5B8EFF;
        // background-clip: content-box;
        // padding: .25em;
        // box-sizing: border-box;
        background: url('static/image/check.png') no-repeat center center;
    }
    &>input[type="checkbox"] {
        position: absolute;
        clip: rect(0, 0, 0, 0);
        // opacity: 0;
    }
}

.slideDown-enter-active,
.slideDown-leave-active {
    transition: transform 0.2s ease-out;
}
.slideDown-enter,
.slideDown-leave-active {
    transform: translate3d(0, -100%, 0);
}
</style>
