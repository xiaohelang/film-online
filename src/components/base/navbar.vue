/* eslint-disable */
<template lang="html">
    <Panel title="导航条" :class="$style.panel">
        <ul :class="$style.content">
            <li v-for="(item,index) in navData" :key="index" @click="navClick(item)">
                <section>
                    <img :src="item.imgSrc" alt="">
                    <p :class="{'selectText': item.isSelector}">{{item.navName}}</p>
                </section>
            </li>
        </ul>
    </Panel>
</template>

<script>
import Panel from './panel.vue'
export default {
    props: {
        navData: {
            type: Array,
            default() {
                return []
            }
        },
        currentCinema: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {
        // 点击导航按钮
        navClick(item) {
            console.log(item)
            this.$emit('upNavClick', item)
        }
    },
    components: {
        Panel
    }
}
</script>
<style lang="scss">
    .selectText{
        color: #598CFF!important;
    }
</style>
<style lang="scss" module>
@import '../scss/element.scss';
.router-link-active p {
    color: pink;
}
.panel {
    @include panel;
    position: fixed;
    background: rgba(250,250,252,1);
    border-top: 1px solid rgba(237,237,237,1);
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
    margin: 0 !important;
    > h4 {
        display: none;
    }
    .content {
        @include flex(row);
        justify-content: space-around;
        li {
            text-align: center;
            section {
                text-decoration: none;
            }
            img {
                width: 44px;
                height: 44px;
                display: inline-block;
                margin: 12px auto 6px;
            }
            p {
                font-size: 22px;
                color: #656565;
            }
        }
    }
}
</style>
