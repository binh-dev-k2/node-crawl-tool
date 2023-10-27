<template>
    <div>
<button @click="home">Test</button>
    </div>
</template>

<script setup>
import router from '@/routes/router';
const home = () => {
    router.push('/')
}
</script>

<style lang="scss" scoped>

</style>