<template lang="html">
    <swipe class="my-swipe">
        <swipe-item class="slide1" v-for="(item, index) in swiperProps" :key="index" >
            <a class="slide1-a" :href="item.link">
                <img :src="item.url" alt="">
            </a>
        </swipe-item>
    </swipe>
</template>

<script>
export default {
    props: {
        swiperProps: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            panelClass: 'panel'
        }
    }
}
</script>

<style lang="scss">
@import 'vue-swipe/dist/vue-swipe.css';
@import '../scss/element.scss';
.panel {
    @include panel;
}
.my-swipe {
    height: 200px;
    color: #fff;
    font-size: 30px;
    text-align: center;
}

.slide1 {
    background-color: #0089dc;
    color: #fff;
}

.slide1-a{
    width: 100%;
    img{
        width: 100%;
    }
}

.slide2 {
    background-color: #ffd705;
    color: #000;
}

.slide3 {
    background-color: #ff2d4b;
    color: #fff;
}
</style>
