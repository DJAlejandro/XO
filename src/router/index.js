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
const RELOAD = -1,
    REPLACE = 0,
    BACK = 1,
    FORWARD = 2;
let routerArr = [{}],
    currentIndex = 0;

router.beforeEach((to, from, next) => {

    setTimeout(() => {
        let isBack = router.app.$options.store.state.isBack;
        if (isBack === RELOAD) {
            localStorage.setItem('currentIndex', 'RELOAD')
            currentIndex = 1;
            next()
        }
        if (isBack === REPLACE) {
            if (routerArr.length === currentIndex) {
                routerArr.push(to.query.id);
                localStorage.setItem('currentIndex', 'LAST')
                currentIndex++;
            } else {
                routerArr = routerArr.slice(0, currentIndex + 1)
                routerArr.push(to.query.id);
                currentIndex++;
                localStorage.setItem('currentIndex', 'LAST')
            }
            next();
        } else if (isBack === BACK) {
            currentIndex--;
            if (currentIndex === 1) {
                localStorage.setItem('currentIndex', 'FIRST')
                next();
            } else if (currentIndex < 1) {
                currentIndex === 1;
                localStorage.setItem('currentIndex', 'FIRST')

                next(false)
            } else {
                localStorage.setItem('currentIndex', 'CENTER')
                next();
            }
        } else if (isBack === FORWARD) {
            ++currentIndex;
            if (currentIndex < routerArr.length) {
                localStorage.setItem('currentIndex', 'CENTER')
                next();
            } else if (currentIndex > routerArr.length) {
                currentIndex = routerArr.length;
                localStorage.setItem('currentIndex', 'LAST')
                next(false)
            } else {
                localStorage.setItem('currentIndex', 'LAST')
                next();
            }
        }
    }, 100);


})

export default router
