import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userCookie: "",
        trackList: [],
        viewFull: true,
        searchList: {},
        searchResult: "",
        focusFlag: false,
        categoryList: [{}]
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
        },
        setSearchResult(state, data) {
            state.searchResult = data
        },
        setFocusFlag(state, data) {
            state.focusFlag = data
        },
        setCategoryList(state, data) {
            state.categoryList = data
        }
    },
    actions: {
        setCookieActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setCookie', data)
                    resolve()
                }, 100)
            })
        },
        setTrackListActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setTrackList', data)
                    resolve()
                }, 100)
            })
        },
        setViewFullActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setViewFull', data)
                    resolve()
                }, 100)
            })
        },
        setSearchListActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setSearchList', data)
                    resolve()
                }, 100)
            })
        },
        setSearchResultActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setSearchResult', data)
                    resolve()
                }, 100)
            })
        },
        setFocusFlagActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setFocusFlag', data)
                    resolve()
                }, 100)
            })
        },
        setCategoryListActions(context, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    context.commit('setCategoryList', data)
                    resolve()
                }, 100)
            })
        }
    },
    modules: {}
})
