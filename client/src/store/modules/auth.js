import { authService } from '../../services';
import router from '@/routes/router';

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
                        if(user.images.length > 0) {
                            router.push('/');
                        }else {
                            router.push({name: 'account.update'})
                        }
                    },
                    () => {
                        dispatch('alert/error', "Tài khoản hoặc mật khẩu không chính xác", { root: true });
                    }
                );
        },
        logout({ commit }) {
          
            authService.logout();
            commit('logout');
            router.push('/login');
        },
        register({ dispatch, commit }, data) {
           
            authService.register(data)
                .then(
                    user => {
                        commit('login', user);
                        router.push('/');
                        setTimeout(() => {
                            // hiển thị message thành công sau redirect sang trang 
                            dispatch('alert/success', 'Registration successful', { root: true });
                        })
                    },
                    error => {
                        console.log(error);
                        dispatch('alert/error', "Email đã tồn tại", { root: true });
                    }
                );
        },
        
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
