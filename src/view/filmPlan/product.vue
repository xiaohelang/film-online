<template lang="html">
    <Panel title="正在热映" :class="$style.panel">
        <section :class="$style.content" class="hh">
            <!-- <Slider :options="options" :items="items" cname="product-slider"> -->
                <!-- <template slot-scope="slotProps">
                    <h5 class="h5">复仇者联盟</h5>
                    <Btn @click="btnClick">购票</Btn>
                </template> -->
            <!-- </Slider> -->
            <!-- <div ref="scrollContainer" :class="$style.scrollContainer">
                <div ref="scrollBoxRef" :class="$style.scrollBox" >
                    <img @click="tabImg(index)" :class='{bigImg : index===activeImg}' v-for="(item, index) in showImg" :src="item.img" alt="" :key="index">
                </div>
            </div> -->
            <swiper ref="mySwiper" :options="swiperOption" >
                <swiper-slide v-for="(item, index) in showImg" :key="index">
                    <img @click="slideClick(item)" :src="item.img">
                </swiper-slide>
                <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            </swiper>
        </section>
        <div :class="$style.sliderTitle">
            <p>{{selectItem.name}}</p>
            <p>{{selectItem.name}}</p>
        </div>
    </Panel>
</template>

<script>
import Panel from '@/components/base/panel.vue'
import Slider from '@/components/base/slider.vue'
import BScroll from 'better-scroll'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Btn from '@/components/base/btn.vue'
export default {
    data() {
        let self = this
        return {
            items: [
                {
                    href: 'home',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t13963/267/2355123229/48850/254f797a/5a3c59aeN9cb550f6.jpg?width=335&height=421'
                },
                {
                    href: 'movie',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t13021/306/1996997425/21953/bda69db3/5a2f6a17N9da099b1.jpg?width=335&height=421'
                },
                {
                    href: 'shop',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t14125/310/1997192193/46667/3c910f8b/5a2f6a36Nad95b650.jpg?width=335&height=421'
                },
                {
                    href: 'me',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t15784/188/381232069/39444/8878571d/5a2f6a4aNbd5a574c.jpg?width=335&height=421'
                },
                {
                    href: 'me1',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t15784/188/381232069/39444/8878571d/5a2f6a4aNbd5a574c.jpg?width=335&height=421'
                },
                {
                    href: 'me2',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t15784/188/381232069/39444/8878571d/5a2f6a4aNbd5a574c.jpg?width=335&height=421'
                },
                {
                    href: 'me3',
                    src:
                        '//img12.360buyimg.com/jrpmobile/jfs/t15784/188/381232069/39444/8878571d/5a2f6a4aNbd5a574c.jpg?width=335&height=421'
                }
            ],
            options: {
                slidesPerView: 3.8,
                spaceBetween: 15,
                freeMode: true
            },
            activeImg: 0,
            selectItem: {},
            showImg: [
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影1'
                },
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影2'
                },
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影3'
                },
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影4'
                },
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影5'
                },
                {
                    img:
                        'http://ww1.sinaimg.cn/large/9dfd21afgy1frw7z7ib6oj20u0160ajw.jpg',
                    name: '小电影6'
                }
            ],
            swiperOption: {
                slidesPerView: 4,
                centeredSlides: true,
                spaceBetween: 30,
                grabCursor: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                // mySwiper.slideTo(index, speed, runCallbacks)
                // 点击哪张
                slideToClickedSlide: true,
                on: {
                    // 切换到哪张
                    slideChangeTransitionEnd: function() {
                        console.log(this.activeIndex)
                        self.selectItem = self.showImg[this.activeIndex]
                    }
                }

            }
        }
    },
    created() {
        let self = this
        // self.selectItem = self.showImg[0]
        // self.swiper.slideTo(3, 550, false)
        setTimeout(() => {
            // self._initPic2(self.showImg.length)
            self.refs.mySwiper.slideTo(3, 900)
        }, 200)
    },
    mounted() {
        // 可以使用swiper这个对象去使用swiper官网中的那些方法
        console.log('this is current swiper instance object', this.swiper)
        this.swiper.slideTo(1, 500, false)
        this.selectItem = this.showImg[1]
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    methods: {
        // 指定切换到哪张
        selectIndex() {
            this.swiper.slideTo(0, 500, false)
        },
        slideClick(item) {
            console.log('点击哪张')
            console.log(item)
            this.selectItem = item
        },
        btnClick() {
            console.log('购票按钮')
        },
        _initPic2(length) {
            let picWidth = 132
            let margin = 26
            let width = (picWidth + margin * 2) * length + 8
            this.$refs.scrollBoxRef.style.width = width / 100 + 'rem'
            if (!this.picScroll) {
                this.picScroll = new BScroll(this.$refs.scrollContainer, {
                    scrollX: true,
                    click: true
                })
            } else {
                this.picScroll.refresh()
            }
        },
        tabImg(index) {
            this.activeImg = index
        }
    },
    components: {
        Panel,
        Slider,
        Btn,
        swiper,
        swiperSlide
    }
}
</script>

<style lang="scss">
@import 'swiper/dist/css/swiper.css';
.product-slider {
    .h5 {
        margin-top: 18px;
        margin-bottom: 18px;
        font-size: 32px;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        color: #4a4a4a;
    }
    // .swiper-container {
    //     box-sizing: border-box;
    //     padding: 0 24px;
    //     .swiper-slide {
    //         section {
    //             display: inline-block;
    //             width: 100%;
    //             img {
    //                 width: 100%;
    //                 display: block;
    //                 height: 260px;
    //                 border: 1px solid #fafafa;
    //             }
    //         }
    //     }
    // }
}

.hh {
    // box-sizing: border-box;
    // padding: 0 24px;
    .swiper-container {
        width: 750px;
        height: 266px;
        .swiper-slide {
            width: 132px;
            height: 198px;
            margin-left: 13px !important;
            margin-right: 13px !important;
            img {
                width: 132px;
                height: 198px;
            }
        }
    }
}
// .swiper-slide-active {
//     width: 188px !important;
//     height: 284px !important;
//     img {
//         width: 188px !important;
//         height: 284px !important;
//     }
// }
// .swiper-slide {
//     width: 60%;
// }
// .swiper-slide:nth-child(2n) {
//     width: 40%;
// }
// .swiper-slide:nth-child(3n) {
//     width: 20%;
// }
// .bigImg {
//     width: 188px !important;
//     height: 284px !important;
// }
</style>

<style lang="scss" module>
@import '../../components/scss/element.scss';
.panel {
    @include panel;
    h4 {
        font-size: 32px;
        display: none;
    }
    .content {
        padding-bottom: 40px;
        position: relative;
        .scrollContainer {
            height: 266px;
            background: pink;
            overflow: hidden;
            width: 750px;
            .scrollBox {
                white-space: nowrap;
                height: 250px;
                background: blue;
                width: 750px;
                img {
                    width: 132px;
                    height: 198px;
                    margin: 0 13px;
                }
            }
        }
    }
    .sliderTitle {
        height: 80px;
        background: pink;
        margin-top: 5px;
        & p:nth-child(1) {
            font-size: 34px;
            color: #262628;
            line-height: 40px;
        }
        & p:nth-child(2) {
            font-size: 24px;
            color: #7a797b;
            line-height: 40px;
        }
    }
}
</style>
