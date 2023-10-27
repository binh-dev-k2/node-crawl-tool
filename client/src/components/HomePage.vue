<template>
  <div>
    <div class="page-wrapper" v-cloak>
      <!-- Preloader -->
	<div v-show="!loader" id="preloader">
		<div class="loader">
			<div class="load-circle"><div></div><div></div></div>
		</div>
	</div>
    <!-- Preloader end-->
      <HeaderVue></HeaderVue>
      <SliceTinderVueVue/>
      <!-- <MenuBarVue></MenuBarVue> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import HeaderVue from './partials/HeaderVue.vue';

import SliceTinderVueVue from './SliceTinder/SliceTinderVue.vue';
export default {
  components: {
    HeaderVue,
    SliceTinderVueVue
  },
  data() {
    return {
      loader: false,
    }
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    Logout() {
      this.logout();
    },
   
  },
  mounted() {
    setTimeout(()=> {
      this.loader = true;
    },1000)
  }
}
</script>

<style scoped>


</style>

