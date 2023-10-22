import { alert } from './modules/alert';
import { auth } from './modules/auth';
import { user } from './modules/user';
import { createStore } from "vuex"

export const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        alert,
        auth,
        user
    }
})
