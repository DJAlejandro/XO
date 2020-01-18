<template>
  <div class="artist-detail">
    <div class="media-background">
      <img :src="playlist.coverImgUrl" />
    </div>
    <div class="modal-portal-warpper" v-if="isModalOpen">
      <modal-portal :modalData="modalData" @close-modal="closeModal"></modal-portal>
    </div>
    <v-header></v-header>
    <div class="artist-header" ref="header">
      <div class="artist-img">
        <img :src="playlist.coverImgUrl+'?param=200y200'" alt="edit" />
      </div>
      <div class="artist-content">
        <div class="artist-content-title">{{playlist.name}}</div>
        <div class="artist-content-desc">
          {{playlist.subDesc}}
          <span v-if="playlist.descLength>100">...&nbsp;</span>
          <span class="moreButton" @click="openModal" v-if="playlist.descLength>100">Read more</span>
        </div>
        <div class="artist-content-controls">
          <button type="button" class="btn1">
            <span class="icon-play iconfont"></span>
            <span class="icon-text">Play</span>
          </button>
          <button type="button" class="btn1">
            <span class="icon-shuffle iconfont"></span>
            <span class="icon-text">Shuffle</span>
          </button>
          <button type="button" class="btn2">
            <span class="icon-favourite iconfont"></span>
          </button>
          <button type="button" class="btn2">
            <span class="icon-mix iconfont"></span>
          </button>
          <button type="button" class="btn2">
            <span class="icon-share iconfont"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="extended-header" :class="{active:diff}">
      <div class="artist-img">
        <img :src="playlist.coverImgUrl+'?param=200y200'" alt="edit" />
      </div>
      <div class="artist-content-title">{{playlist.name}}</div>
      <div class="artist-content-controls">
        <button type="button" class="btn1">
          <span class="icon-play iconfont"></span>
          <span class="icon-text">Play</span>
        </button>
        <button type="button" class="btn1">
          <span class="icon-shuffle iconfont"></span>
          <span class="icon-text">Shuffle</span>
        </button>
        <button type="button" class="btn2">
          <span class="icon-favourite iconfont"></span>
        </button>
        <button type="button" class="btn2">
          <span class="icon-mix iconfont"></span>
        </button>
        <button type="button" class="btn2">
          <span class="icon-share iconfont"></span>
        </button>
      </div>
    </div>
    <div class="media-container">
      <div class="media-header">
        <div class="media-header-title">Top Tracks</div>
        <a href="#" class="view-all" @click="goToTracks2($event)" v-preventReClick>View all</a>
      </div>
      <trackList :shortFlag="shortFlag" :needImg="needImg"></trackList>
    </div>
  </div>
</template>

<script>
import VHeader from "components/VHeader.vue";
import TrackList from "./TrackList.vue";
import ModalPortal from "components/ModalPortal.vue";

import mixins from "mixins/index.js";
import { instance, ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";

export default {
  mixins: [mixins],
  data() {
    return {
      shortFlag: false,
      needImg:true,
      playlist: [],
      height: 0,
      scrollTop: 0,
      isModalOpen: false,
      modalData: {}
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    refreshArtist() {
      this.$emit("scroll-top");

      let id = this.$route.query.id;
      instance
        .get("/playlist/detail", {
          params: {
            id
          }
        })
        .then(res => {
          let playlist = res.data.playlist;
          let tracks = this.serialData2(playlist.tracks);

          this.setTrackListActions(tracks);

          let {
            description,
            coverImgUrl,
            name,
            creator: { nickname }
          } = playlist;
          let descLength = description.length;

          let subDesc = description.substring(0, 100);
          description = description.split("\n");
          playlist.subDesc = subDesc;
          playlist.descLength = descLength;
          this.playlist = playlist;

          this.modalData = {
            description,
            imgSrc: coverImgUrl,
            title: name,
            type: PLAYLIST,
            nickname
          };
        });
    }
  },
  components: {
    VHeader,
    TrackList,
    ModalPortal
  },
  mounted() {
    this.refreshArtist();
    setTimeout(() => {
      this.height = this.$refs.header.offsetHeight;
    }, 1000);

    let content = document.querySelector(".content-area-scorll");
    content.addEventListener(
      "scroll",
      () => {
        this.scrollTop = content.scrollTop;
      },
      false
    );
  },
  computed: {
    diff() {
      return this.scrollTop - this.height - 10 > 0;
    }
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      this.refreshArtist();
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~style/mixin.scss";
.artist-detail {
  display: flex;
  flex-direction: column;
  position: relative;
  .media-background {
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    position: absolute;
    height: 100%;
    z-index: -3;
    transform: translateZ(0);
    filter: blur(50px);

    img {
      width: 100%;
      height: 100%;
      opacity: 0.2;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }
  }
  .artist-header {
    display: flex;
    margin: 80px 0 48px;
    width: 100%;
    padding: 0 28px;
    z-index: 1;
    .artist-img {
      flex: 0 0 200px;
      width: 200px;
      height: 200px;
      margin-right: 40px;
      max-width: 100%;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .artist-content {
      flex: 1;
      min-width: 0; //flex 布局下实现 text-overflow: ellipsis 效果
      .artist-content-title {
        margin: 16px 0 6px;
        line-height: 1.17;
        font-size: 3.429rem;
        font-weight: 600;
        text-align: left;
        color: #fff;
        font-size: 48px;
        font-weight: 600;
        text-align: left;
        color: #fff;
        @include ellipsis;
      }
      .artist-content-desc {
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        text-align: left;
        width: 100%;
        .moreButton {
          color: #0ff;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
      }
      .artist-content-info {
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        text-align: left;
        width: 100%;
        @include ellipsis2(3);
        .artist-name {
          color: #fff;
        }
      }
      .artist-content-more {
        margin-top: -10px;
        margin-bottom: 20px;
        padding-top: 10px;
        background-color: #000;
        position: relative;
        z-index: 2;
      }
    }
  }
  .artist-content-controls {
    display: flex;
    max-width: 530px;
    align-items: center;
    margin-top: 10px;

    button {
      @include ellipsis;
      display: flex;
      border: none;
      outline: none;
      margin-right: 16px;
      align-items: center;
      background-color: rgba(229, 238, 255, 0.2);
      display: inline-flex;
      justify-content: center;
      border-radius: 12px;
      height: 48px;
      transition: background 0.35s ease;
      font-size: 16px;
      color: #fff;
      &:hover {
        background-color: rgba(229, 238, 255, 0.3);
      }
      &.btn1 {
        min-width: 144px;
      }
      &.btn2 {
        border-radius: 100%;
        width: 48px;
        height: 48px;
        padding: 0;
      }
      .iconfont {
        font-size: 24px;
      }
      .icon-favourite,
      .icon-more {
        font-size: 30px;
      }
      .icon-text {
        margin-left: 8px;
      }
    }
  }
  .extended-header {
    position: fixed;
    left: 240px;
    right: 20px;
    height: 80px;
    padding: 0 0 10px;
    transition: 50ms ease-in;
    background-color: #000;
    display: none;
    z-index: 2;
    .artist-img {
      width: 64px;
      height: 64px;
      margin-right: 20px;
      max-width: 100%;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .artist-content-title {
      font-size: 32px;
      color: #fff;
      line-height: 1.2;
      text-align: left;
      letter-spacing: -1px;
      font-weight: 600;
    }
    .artist-content-controls {
      margin-left: auto;
    }
    &.active {
      top: 72px;
      transition: 0.25s ease-in;
      display: flex;
      align-items: center;
      margin-left: 22px;
      animation: fadein 0.2s forwards;
    }

    @keyframes fadein {
      0% {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  }
}
.media-container {
  margin: 0 28px;
  margin-bottom: 48px;
  min-height: 120px;
  z-index: 1;
  .media-header {
    display: flex;
    align-items: baseline;
    .media-header-title {
      flex-grow: 1;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.75;
      margin: 0 0 16px;
    }
    .view-all {
      flex-shrink: 0;
      color: rgba(229, 238, 255, 0.6);
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>