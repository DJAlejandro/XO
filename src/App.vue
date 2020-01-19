<template>
  <div id="app" @click="closeSearch">
    <div class="container">
      <side-bar />
      <div class="content-area">
        <div class="content-area-scorll" ref="content">
          <router-view @scroll-top="scrollTop"></router-view>
        </div>
      </div>
    </div>

    <div class="footer-player">
      <div class="top-row"></div>
      <div class="bottom-row">
        <div class="left-column">
          <div class="media-img" v-if="footerPlayer.album">
            <img :src="footerPlayer.album.picUrl+'?param=70y70'" />
          </div>
          <div class="media-info">
            <div class="media-info-title">{{footerPlayer.name}}</div>
            <div class="media-info-artist">
              <a href="#">
                <span
                  v-for="(artist,index) in footerPlayer.artists"
                  @click="goToArtist($event,artist.id,true)"
                  v-preventReClick
                >
                  <span v-if="index!==0">,</span>
                  {{artist.name}}
                </span>
              </a>
            </div>
          </div>
          <div class="media-controls">
            <span class="icon-more iconfont"></span>
            <span class="icon-favourite iconfont"></span>
          </div>
        </div>
        <div class="center-column">
          <div class="play-controls">
            <span class="icon-shuffle iconfont"></span>
            <span class="icon-previous iconfont"></span>
            <span class="icon-play iconfont"></span>
            <span class="icon-next iconfont"></span>
            <span class="icon-repeat iconfont"></span>
          </div>
        </div>
        <div class="right-column"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./views/SideBar.vue";
import Home from "./views/Home.vue";
import mixins from "mixins/index.js";
export default {
  mixins: [mixins],
  data() {
    return {
      contentArea: Home
    };
  },
  components: {
    SideBar
  },
  methods: {
    scrollTop() {
      this.$refs.content.scrollTop = 0;
    },
    closeSearch() {
      this.setFocusFlagActions(false);
    }
  }
};
</script>

<style lang="scss">
@import "~style/iconfont.css";
@import "~style/mixin.scss";

#app {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  font-size: 1rem;
  font-weight: 400;
  font-stretch: normal;
  line-height: 1.7143;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  .container {
    display: flex;
    max-height: calc(100vh - 98px);
    .content-area {
      display: flex;
      flex: 1;
      max-width: calc(100vw - 250px);
      .content-area-scorll {
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100%;

        width: 100%;
      }
    }
  }
  .footer-player {
    height: 98px;
    z-index: 10;
    background-color: #222;
    .bottom-row {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      box-sizing: border-box;
      height: 96px;
      .left-column,
      .center-column,
      .right-column {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        box-sizing: border-box;
        width: 33%;
        flex: 3 1;
        min-width: 200px;
        white-space: nowrap;
      }
      .left-column {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .media-img {
          flex: 64px 0 0;
          width: 64px;
          height: 64px;
          margin: 14px 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .media-info {
          display: flex;
          flex-direction: column;
          max-width: calc(100% - 124px);
          .media-info-title {
            @include ellipsis;
          }
          .media-info-artist {
            a {
              color: rgba(229, 238, 255, 0.6);
            }
            @include ellipsis;
          }
        }
        .media-controls {
          margin-left: 14px;
          .iconfont {
            font-size: 24px;
            color: rgba(229, 238, 255, 0.6);
            &:first-of-type {
              margin-right: 7px;
            }
          }
        }
      }
      .center-column {
        justify-content: center;
        .play-controls {
          display: flex;
          align-items: center;
          .iconfont {
            font-size: 24px;
            margin: 0 14px;
          }
          .icon-play {
            font-size: 40px;
          }
          .icon-shuffle,.icon-repeat{
            color:rgba(229,238,255,.6)
          }
        }
      }
      .right-column {
        justify-content: flex-end;
      }
    }
  }
}
</style>
