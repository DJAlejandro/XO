import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userCookie: ""
    },
    mutations: {
        setCookie(state, data) {
            state.userCookie = data
        }
    },
    actions: {
        setCookieActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setCookie', data)
                    resolve()
                }, 1000)
            })
        }
    },
    modules: {}
})
