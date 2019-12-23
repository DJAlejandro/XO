import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userCookie: "",
        trackList: [],
        viewFull: true,
        searchList: {}
    },
    mutations: {
        setCookie(state, data) {
            state.userCookie = data
        },
        setTrackList(state, data) {
            state.trackList = data
        },
        setViewFull(state, data) {
            state.viewFull = data
        },
        setSearchList(state, data) {
            state.searchList = data
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
        },
        setTrackListActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setTrackList', data)
                    resolve()
                }, 1000)
            })
        },
        setViewFullActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setViewFull', data)
                    resolve()
                }, 1000)
            })
        },
        setSearchListActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setSearchList', data)
                    resolve()
                }, 1000)
            })
        },
    },
    modules: {}
})
