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

Vue.directive('preventReClick', {
    inserted(el, binding) {
        el.addEventListener('click', (event) => {
            console.log(event.target);

            if (!event.target.disabled) {
                event.target.disabled = true
                setTimeout(() => {
                    event.target.disabled = false
                }, binding.value || 1000)
            }
        })
    }
})
