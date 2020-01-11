import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
const routerPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
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
    },
    {
        path: '/artist',
        component: () => import( /* Explore */ '../views/ArtistDetail.vue')
    },
    {
        path: '/play-list',
        component: () => import( /* Explore */ '../views/PlayListDetail.vue')
    },
    {
        path: '/top-tracks',
        component: () => import( /* Explore */ '../views/TopTracks.vue')
    },
    {
        path: '/search/tracks',
        component: () => import( /* Explore */ '../views/TopTracks.vue')
    },
    {
        path: '/search/:type',
        component: () => import( /* Explore */ '../views/Category.vue')
    },
    {
        path: '/artist/:type',
        component: () => import( /* Explore */ '../views/Category.vue')
    },
    {
        path: '/related-artist',
        component: () => import( /* Explore */ '../views/Category.vue')
    },
    {
        path: '/search/',
        component: () => import( /* Explore */ '../views/Search.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    },

})

let len = 0;
let routerArr = [];
let isBack = false;
router.beforeEach((to, from, next) => {
    // len = router.app.$options.store.state.routerHistoryLength;
    // console.log(to, from);
    setTimeout(() => {

        isBack = router.app.$options.store.state.isBack;
        console.log(isBack);
        if (isBack) {
            // len = len - 1;
            if (routerArr.length > 1) {
                routerArr.pop()
            }
        } else {
            // len = len + 1;
            routerArr.push(to)
        }
        console.log(routerArr);
        if (routerArr.length >= 1) {

            next();
        }
    }, 100);




    // console.log(router.app.$options.store.state.routerHistoryLength);



})
export default router
