<template>
  <div>
    <div class="page-content space-top p-b65" v-cloak>
      <div class="container">
        <div class="demo__card-cont dz-gallery-slider">
          <h3 v-if="listUsers.length == 0" class=" text-center mt-5">Hết rùi. Quay lại sau vài phút để tìm được ghệ iu nha 💕💕</h3>
          <CardTinder v-on:mousedown="startDrag" v-on:mouseup="endDrag" v-for="user in listUsers.slice().reverse()"
            :currentUser="user" :key="user.id"></CardTinder>
        </div>
      </div>
    </div>
    <div class="footer fixed">
      <div class="dz-icon-box">
        <button :disabled="!statusButton" class="icon dz-flex-box dislike" @click="handleEvent(0)"><i
            class="flaticon flaticon-cross font-18"></i></button>
        <button class="icon dz-flex-box like" :disabled="!statusButton" @click="handleEvent(1)"><i class="fa-solid fa-heart"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import CardTinder from './CardTinder.vue';

const statusButton = ref(true)
const store = useStore();

store.dispatch("user/getUsers")
let listUsers = computed(() => {
  let list = store.getters['user/getAllUsers'];
  if (list && list.length > 0) {
    return list;
  }
  return [];
});
setInterval(()=> {
  if(listUsers.value.length == 0) {
    store.dispatch("user/getUsers")
  }
},10000)

watch(listUsers, (newVal) => {
  if (newVal.length > 0) {
    console.log(newVal);
    statusButton.value = true;
  }
})
const handleEvent = (status) => {
  if (listUsers.value && listUsers.value.length > 0 && statusButton.value) {
    let userHandelID = listUsers.value[0].id;
    statusButton.value = false;
    store.dispatch("user/handle", { id: userHandelID, status: status })
  }
}
</script>

<style lang="scss" scoped></style>