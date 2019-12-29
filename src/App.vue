<template>
  <div id="app" @click="closeSearch">
    <side-bar />
    <div class="content-area">
      <div class="content-area-scorll" ref="content">
        <router-view @scroll-top="scrollTop"></router-view>
      </div>
      <!-- <component class="content-area-scorll" :is="contentArea"></component> -->
    </div>
  </div>
</template>

<script>
import SideBar from "./views/SideBar.vue";
import Home from "./views/Home.vue";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      contentArea: Home
    };
  },
  components: {
    SideBar
  },
  methods: {
    ...mapActions(["setSearchListActions"]),
    ...mapActions(["setFocusFlagActions"]),

    scrollTop() {
      this.$refs.content.scrollTop = 0;
    },
    closeSearch() {
      this.setFocusFlagActions(false);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "~style/iconfont.css";

#app {
  font-size: 1rem;
  font-weight: 400;
  font-stretch: normal;
  line-height: 1.7143;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  display: flex;
  // max-height: calc(100vh - 98px);
  .content-area {
    display: flex;
    flex: 1;
    max-width: calc(100vw - 250px);
    .content-area-scorll {
      overflow-x: hidden;
      overflow-y: scroll;
      height: 100vh;

      width: 100%;
    }
  }
}
</style>
