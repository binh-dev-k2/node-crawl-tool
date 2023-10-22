import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../components/auth/LoginPage.vue'
import RegisterPage from '@/components/auth/RegisterPage.vue';
import HomePage from '@/components/HomePage.vue';
import UpdateInforVue from '@/components/account/UpdateInfor.vue';


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

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
})

export default router;