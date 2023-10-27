<template>
    <div>
        <HeaderVue></HeaderVue>
        <div class="page-content space-top p-b65" v-coak>
            <div class="container">
                <div class="row g-2">
                    <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" class="col-6" v-for="user in listUsers" :key="user.id" v-on:click="getDetailLover(user)">
                        <div class="dz-media-card">
                            <div>
                                <div class="dz-media">
                                    <img :src="'http://localhost:3000' + user?.images[0]" alt="">
                                </div>
                                <div class="dz-content">
                                    <h6 class="title">{{ user?.user_name }}</h6>
                                    <span class="about">{{ user?.phone }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="listUsers?.length == 0" class=" text-center">
                        <h4>Danh sách rỗng</h4>
                    </div>
                </div>
               <CardDetail  :user="selectUsers"></CardDetail>
              
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import HeaderVue from '../partials/HeaderVue.vue';
import CardDetail from './CardDetail.vue'
import { computed, ref } from 'vue';

const selectUsers = ref(null)
const store = useStore();
store.dispatch("user/getLoveUser")
let listUsers = computed(() => {
    let list = store.getters['user/getLoveUser'];
    if (list && list.length > 0) {
        return list;
    }
    return [];
});
const getDetailLover = (lover) => {
    console.log(lover);
    selectUsers.value = lover
}

</script>

<style lang="scss" scoped></style>