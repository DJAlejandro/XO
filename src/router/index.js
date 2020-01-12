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
const REPLACE = 0,
    BACK = 1,
    FORWARD = 2;
let len = 0;
let routerArr = [];
let currentIndex = 0;
let isBack = false;
router.beforeEach((to, from, next) => {
    setTimeout(() => {
        isBack = router.app.$options.store.state.isBack;
        if (isBack === REPLACE) {
            if (routerArr.length === 0) {
                routerArr.push(to.query.id);
                currentIndex = 0;
            } else if (routerArr.length - 1 === currentIndex) {
                routerArr.push(to.query.id);

                currentIndex++;
            } else {
                routerArr = routerArr.slice(0, currentIndex + 1)
                routerArr.push(to.query.id);
                currentIndex++;
            }
            next();
        } else if (isBack === BACK) {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = 0;
                next(false);
            } else {
                next();
            }
        } else if (isBack === FORWARD) {
            currentIndex++;
            if (routerArr.length < currentIndex + 1) {
                currentIndex = routerArr.length - 1;
                next(false);

            } else {
                next();
            }
        }
    }, 100);
})
export default router
