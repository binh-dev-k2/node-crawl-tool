import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../components/auth/LoginPage.vue'
import RegisterPage from '@/components/auth/RegisterPage.vue';
import HomePage from '@/components/HomePage.vue';
import UpdateInforVue from '@/components/account/UpdateInfor.vue';
import TestVue from '@/components/TestVue.vue';
import { useStore } from 'vuex';


const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPage
    },
    {
        path: '/account/update',
        name: 'account.update',
        component: UpdateInforVue
    },
    {
        path: '/test',
        name: 'test',
        component: TestVue
    },
    {
        path: '/:catchAll(.*)',
        name: 'error',
        component: Error
    },
]

const router = new createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('token');
    const user = useStore().getters.getUser;
    
    if (authRequired && !loggedIn) {
        return next('/login');
    }
    if(loggedIn && !user) {
        useStore().dispatch("user/getUser");
    }
    next();
})

export default router;