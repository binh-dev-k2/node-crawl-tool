<template>
  <div>
    <div>
      <div v-if="alert.message" :class="`alert ${alert.type}`">{{ alert.message }}</div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    })
  },
  watch: {
    $route(to, from) {
      this.clearAlert();
      console.log(from, to);
    }
  }
};
</script>
