import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'

Vue.use(VueRouter)

const routes = [{
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/view/pages/explore',
        component: () => import( /* Explore */ '../views/Explore.vue')
    },
    {
        path: '/view/pages/category',
        component: Category
    },
    {
        path: '/album',
        component: () => import( /* Explore */ '../views/AlbumDetail.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes


})

export default router
