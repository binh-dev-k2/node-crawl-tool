import { Http } from '../../helpers'
import { authService } from '../../services';
import router from '@/routes/router';

const state = {
    users: [],
    user: {}
}

const getters = {
    getAllUsers: (state) => state.users,
    getUser: (state) => state.user

}

const actions = {
    getUsers(context) {
        
        return new Promise(() => {
            Http.post('api/user/random-user')
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
        let header = {
            'Content-Type': 'multipart/form-data' 
        }
        console.log(obj);
        return new Promise((res) => {
            Http.post('/api/user/update/', obj,header)
                .then(response => {
                    res(response);
                })
        })
    },
    getUser(context) {
        return new Promise((res) => {
                Http.post('/api/user/myuser')
                .then(response => {
                    console.log(response);
                    context.commit('setUser', response);
                    res(response);
                })
                .catch(() => {
                    console.log("Lỗi r em ơi");
                    authService.logout();
                    context.commit('logout');
                    router.push('/login');
                })
        })
    },
    handle(context, data) {
        return new Promise((res) => {
            console.log(data);
            Http.post('/api/user/handle', data)
                .then(response => {
                    console.log(response.data);
                    context.commit('setUsers', response.data.users);
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
        state.user = user
    },
    
}

export const user = {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}
