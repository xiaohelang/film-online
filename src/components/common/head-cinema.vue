<template>
    <div :class="$style.cinema">
        <div :class="$style.cinemaLeft">
            <span>当前影院：</span>
            <span>{{ currentCinema.cinemaName}}</span>
            <span>></span>
        </div>
        <btn :class="$style.change" @upBtnClick="openCinemaSelector">切换</btn>
    </div>
</template>
<script>
import btn from '@/components/base/btn.vue'
export default {
    props: {
        currentCinema: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {
        // 打开切换影院页面
        openCinemaSelector() {
            this.$emit('upOpenCinemaSelector')
        }
    },
    components: {
        btn
    }

}
</script>
<style lang="scss" module>
@import '../../components/scss/element.scss';
.cinema {
    display: flex;
    justify-content: space-between;
    padding: 12px 32px;
    box-sizing: border-box;
    background: #F8F8F8;
    align-items: center;
}
.cinemaLeft {
    display: flex;
    color: #262628;
    font-size: 28px;
}
.change {
    width: 110px !important;
    height: 48px !important;
    border-radius: 8px !important;
    line-height: 48px !important;
    font-size: 24px !important;
    // background: linear-gradient(right bottom, #6F85FF , #54AAFF) !important;
    background: -webkit-linear-gradient(right bottom, #6F85FF , #54AAFF) !important;
    // background: -o-linear-gradient(right bottom,#6F85FF , #54AAFF) !important;
    // background: -moz-linear-gradient(right bottom, #6F85FF , #54AAFF) !important;
}
</style>
