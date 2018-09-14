<template lang="html">
    <article class="">
        <section :class="$style.list">
            <div :class="$style.item" v-for="item in items" :key="item.img">
                <section :class="$style.iconItem" @click="funcBtnClick(item)">
                    <span v-if="item.isTip && waitingOrderCount > 0" :class="$style.tip">{{waitingOrderCount}}</span>
                    <img :src="item.img" :alt="item.title">
                    <h4>{{ item.title }}</h4>
                </section>
            </div>
        </section>
    </article>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default() {
                return []
            }
        },
        waitingOrderCount: {
            type: Number,
            default() {
                return 0
            }
        }
    },
    methods: {
        /**
         * 点击btn主动触发funcBtnClick方法，item 为向父组件传递的数据
         */
        funcBtnClick(item) {
            this.$emit('upFuncBtnClick', item)
        }
    }
}
</script>

<style lang="scss" module>
@import '../../components/scss/element.scss';
.list {
    @include list(row);
    background: #fff;
    padding-top: 36px;
    padding-bottom: 40px;
    justify-content: space-around;
    a {
        text-decoration: none;
    }
    .item {
        text-align: center;
        .iconItem {
            position: relative;
            .tip {
                position: absolute;
                right: -10px;
                top: 0;
                display: inline-block;
                background: red;
                color: #fff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                border: 3px solid #fff;
                line-height: 42px;
                text-align: center;
                font-size: 24px;
            }
            img {
                display: inline-block;
                width: 84px;
                height: 84px;
                margin-bottom: 16px;
            }
            h4 {
                font-size: 32px;
                margin-top: 12px;
                color: #000;
            }
        }
    }
}
</style>
