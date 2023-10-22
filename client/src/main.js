import { createApp } from 'vue'
import './assets/css/style.css'
import App from './App.vue'
import router from '@/routes/router'
import * as VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import { store } from '@/store';
import { Http } from '@/helpers/http'

const app = createApp(App)

app.config.productionTip = false
Http.init()

app.use(router)
app.use(store)
app.use(VeeValidate)
app.use(Vuex)
app.mount('#app')