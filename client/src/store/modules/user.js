import { Http } from '../../helpers'
import { LocalStorage } from '@/helpers/local-storage';

const state = {
    users: [],
    user: {}
}

const getters = {
    getAllUsers: (state) => state.users,
    getRandomUser: (state) => state.user
}

const actions = {
    getUsers(context) {
        
        return new Promise(() => {
            Http.get('/admin/api/users')
                .then(response => {
                    context.commit('setUsers', response.data.users);
                });
        })
    },
    createUser(context, obj) {
        return new Promise((res) => {
            Http.post('/api/users/create', obj)
                .then(response => {
                    res(response);
                })
        })
    },
    updateUser(context, obj) {
        let token = LocalStorage.getToken();
        console.log(token);
        console.log(obj);
        return new Promise((res) => {
            Http.post('/api/users/update/' + token, obj)
                .then(response => {
                    res(response);
                })
        })
    },
    getUser(context, id) {
        return new Promise((res) => {
            Http.get('/api/users/' + id)
                .then(response => {
                    context.commit('setUser', response.data.user);
                    res(response);
                })
        })
    },
    deleteUser(context, id) {
        return new Promise((res) => {
            Http.get('/api/users/delete/' + id)
                .then(response => {
                    res(response)
                })
        })
    }
}

const mutations = {
    setUsers(state, users) {
        state.users = users;
    },
    setUser(state, user) {
        console.log(user);
        state.user = user
    }
}

export const user = {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}
