<template lang="html">
    <section :class="cname">
        <swiper :options="options" :not-next-tick="options.notNextTick">
            <swiper-slide v-for="item in items" :key="item[transPropertiy.jumpHref]">
                <section @click="sliderClick(item)">
                    <img id="silderImg1" v-if="item[transPropertiy.imageSrc]" :src="item[transPropertiy.imageSrc]" alt="">
                    <img id="silderImg2" v-else :src="transPropertiy.defualtImageSrc" alt="">
                    <slot v-bind:item="item">
                    </slot>
                </section>
            </swiper-slide>
            <div class="swiper-pagination" v-if="options.pagination" slot="pagination"/>
        </swiper>
    </section>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        cname: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
            default() {
                return {
                    autoplay: true,
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination'
                    },
                    notNextTick: false
                }
            }
        },
        items: {
            type: Array,
            default() {
                return []
            }
        },
        /**
         * 适配属性值
         * jumpHref：点击跳转路径
         * imageSrc：图片显示地址
         */
        transPropertiy: {
            type: Object,
            default() {
                return {jumpHref: 'href', imageSrc: 'src', defualtImageSrc: ''}
            }
        }
    },
    methods: {
        /**
         * 点击slider主动触发upSliderClick方法，item 为向父组件传递的数据
         */
        sliderClick(item) {
            this.$emit('upSliderClick', item)
        }
    }
}
</script>

<style lang="css">
@import 'swiper/dist/css/swiper.css';
.imgBox {
    overflow: hidden;
}
#silderImg1 {
    height: 260px!important;
    width: 100%!important;
}
#silderImg2 {
    height: 260px!important;
    width: 100%!important;
}
</style>
<style lang="css" modules>
@import 'swiper/dist/css/swiper.css';

</style>
