import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'
import 'style/reset.scss'
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false
import VuePaginate from 'vue-paginate'
Vue.use(VuePaginate)
new Vue({
    router,
    store,
    render: h => h(App),

}).$mount('#app')
