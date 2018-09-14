<template lang="html">
    <div @click="btnClick" :class="[btnClass,cname]">
        <slot/>
    </div>
</template>

<script>
export default {
    props: {
        cname: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            btnClass: 'btn'
        }
    },
    methods: {
        btnClick(id) {
            console.log('超级按钮')
            this.$emit('upBtnClick', id)
        }
    }
}
</script>

<style lang="scss">
@import "../scss/element.scss";
.btn{
    @include btn;
}
</style>
