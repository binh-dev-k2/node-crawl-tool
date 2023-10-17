import { authService } from '../../services';
// import { router } from '../../helpers';

export const auth = {
    namespaced: true,

    state: () => {
        return {
            user: null
        }
    },

    actions: {
        login({ dispatch, commit }, { email, password }) {
            authService.login(email, password)
                .then(
                    user => {
                        commit('login', user);
                        // router.push('/');
                    },
                    error => {
                        dispatch('alert/error', error, { root: true });
                    }
                );
        },
        logout({ commit }) {
            authService.logout();
            commit('logout');
        },
        register({ dispatch, commit }, user) {
            authService.register(user)
                .then(
                    user => {
                        commit('login', user);
                        // router.push('/login');
                        setTimeout(() => {
                            // hiển thị message thành công sau redirect sang trang 
                            dispatch('alert/success', 'Registration successful', { root: true });
                        })
                    },
                    error => {
                        dispatch('alert/error', error, { root: true });
                    }
                );
        }
    },

    mutations: {
        login(state, user) {
            state.user = user;
        },
        logout(state) {
            state.user = null;
        },
    }
}
