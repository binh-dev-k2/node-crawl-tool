<template>
  <div>
    <div class="hello">
      Hello
    </div>
    <p>
      <button @click="Logout">Logout</button>
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    Logout() {
      this.logout();
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

