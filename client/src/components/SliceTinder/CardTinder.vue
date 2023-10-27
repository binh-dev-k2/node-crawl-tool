<template>
    <div class="demo__card no-select"   v-cloak>
              <div class="dz-media">
                <img :src="'http://localhost:3000'+currentUser.images[0]" alt="">
              </div>
              <div class="dz-content">
                <div class="left-content">
                  <h4 class="title"> <span class=" text-warning">{{ currentUser.user_name }}  </span>  Tuổi: {{ currentUser.age }}</h4>
                  <p class=" mb-2">{{ currentUser.description }}</p>
                  <p class="mb-0"><span v-for="hobbie in currentUser.hobbies" :key="hobbie.id" class="badge badge-danger ms-2">{{ hobbie.name }}</span></p>
                </div>
               
              </div>
              <div class="demo__card__choice m--reject">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <div class="demo__card__choice m--like">
                <i class="fa-solid fa-check"></i>
              </div>
              <div class="demo__card__choice m--superlike">
                <h5 class="title mb-0">Super Like</h5>
              </div>
              <div class="demo__card__drag"></div>
            </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  currentUser: Object  
})

const { currentUser } = toRefs(props)

</script>

<style lang="css" scoped>
.no-select {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>