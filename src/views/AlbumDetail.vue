<template>
  <div class="album-detail">
    <div class="media-background">
      <img :src="albumList.src" />
    </div>
    <v-header></v-header>
    <div class="album-header" v-if="albumList!=null">
      <div class="album-img">
        <img :src="albumList.src" alt="edit" />
      </div>
      <div class="album-content">
        <div class="album-content-title">{{albumList.name}}</div>
        <div class="album-content-info">
          <div class="album-content-text">
            by
            <span v-for="artist in albumList.artists" class="artist-name">{{artist.name}}</span>
          </div>
          <div class="album-content-text">
            <span class="time">Released {{time}}</span>
          </div>
        </div>
        <div class="album-content-controls">
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
            <span class="icon-credits iconfont"></span>
          </button>
          <button type="button" class="btn2">
            <span class="icon-more iconfont"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="media-container">
      <div class="media-row header">
        <div class="media-index">#</div>
        <div class="media-title">title</div>
        <div class="media-artist">artist</div>
        <div class="media-time">time</div>
        <div class="media-controls"></div>
      </div>
      <div
        class="media-row"
        v-for="(track,index) in albumList.tracks"
        :class="{active:activeIndex===index}"
        @click="changeIndex(index)"
      >
        <div class="media-index">
          <div class="text">{{index+1}}</div>
          <span class="play">
            <span class="icon-play iconfont"></span>
          </span>
        </div>
        <div class="media-title">{{track.name}}</div>
        <div class="media-artist">
          <span v-for="(artist,index) in track.artists">
            <span v-if="index!==0">,</span>
            {{artist.name}}
          </span>
        </div>
        <div class="media-time">{{InstoreTime(track.time)}}</div>
        <div class="media-controls">
          <span class="icon-more iconfont"></span>
          <span class="icon-add iconfont"></span>
          <span class="icon-favourite iconfont"></span>
        </div>
      </div>
    </div>
    <related-artists :relatedArtists="relatedArtists" />
  </div>
</template>
<script>
import axios from "axios";
import { format } from "date-fns";
import { mapState } from "vuex";

import VHeader from "components/VHeader.vue";
import RelatedArtists from "./RelatedArtists.vue";
let instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  withCredentials: true
});
export default {
  props: {},
  data() {
    return {
      albumList: {},
      activeIndex: 0,
      artist: {},
      relatedArtists: {}
    };
  },
  components: {
    VHeader,
    RelatedArtists
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      userCookie: "userCookie"
    }),
    time() {
      if (this.albumList.publishTime) {
        let time = new Date(this.albumList.publishTime);
        let date = time.getDate();
        let month = time.getMonth();
        let year = time.getFullYear();
        return format(new Date(year, month, date), "yyyy-MM-dd");
      }
    }
  },

  methods: {
    InstoreTime(time) {
      let msec = Math.floor(time / 1000) * 1000;
      let minutes = parseInt(msec / (1000 * 60));
      let seconds = parseInt((msec % (1000 * 60)) / 1000);
      return minutes + ":" + seconds;
    },
    changeIndex(index) {
      this.activeIndex = index;
    }
  },
  mounted() {
    let id = this.$route.query.id;
    console.log(this.userCookie);

    instance
      .get("/album", {
        params: {
          id
        }
      })
      .then(res => {
        let data = res.data;
        let tracks = [];
        let {
          album: { blurPicUrl, name, artists, artist, publishTime },
          songs
        } = data;

        songs.forEach(item => {
          let { dt, name, id, ar } = item;
          tracks.push({
            time: dt,
            name,
            artists: ar,
            id
          });
        });

        this.artist = artist;
        this.albumList = {
          src: blurPicUrl, //专辑封面
          name, //专辑名称
          artists, //专辑歌手
          publishTime, //发行时间
          tracks //歌曲
        };
        return instance.get("/simi/artist", {
          params: {
            id: this.artist.id
          }
        });
      })
      .then(res => {
        console.log("relatedArtists:");
        console.log(res);

        this.relatedArtists = res;
      });
  }
};
</script>
<style lang="scss" scoped>
@import "~style/mixin.scss";
.album-detail {
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
  .album-header {
    display: flex;
    margin: 80px 0 48px;
    width: 100%;
    padding: 22px 28px 32px 28px;
    .album-img {
      flex: 0 0 200px;
      width: 200px;
      height: 200px;
      margin-right: 40px;
      max-width: 100%;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .album-content {
      flex: 1;
      min-width: 0; //flex 布局下实现 text-overflow: ellipsis 效果
      .album-content-title {
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
      .album-content-info {
        color: hsla(0, 0%, 100%, 0.5);
        margin-bottom: 20px;
        font-size: 1.143rem;
        line-height: 1.5;
        text-align: left;
        font-size: 16px;
        .artist-name {
          color: #fff;
        }
      }
      .album-content-controls {
        display: flex;
        max-width: 530px;
        align-items: center;

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
    }
  }
  .media-container {
    margin: 0 28px;
    margin-bottom: 48px;
    min-height: 120px;

    .media-row {
      display: flex;
      color: #fff;
      overflow: hidden;
      height: 48px;
      width: 100%;
      &:hover {
        background-color: rgba(246, 245, 255, 0.1);
        outline: 0;
        .media-index {
          .play {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .text {
            display: none;
          }
        }
      }
      &.header {
        div {
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          line-height: 20px;
          letter-spacing: 0.5px;
          color: rgba(229, 238, 255, 0.6);
        }
      }
      &.active {
        background-color: rgba(246, 245, 255, 0.1);
        outline: 0;
      }
      .media-index {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        flex: 0 0 42px;
        width: 28px;
        color: #79777f;
        font-size: 14px;
        @include ellipsis;
        .text {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .play {
          display: none;
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          .icon-play {
            font-size: 24px !important;
            color: #fff;
          }
        }
      }
      .media-title {
        display: flex;
        align-items: center;
        flex: 1 0 228px;
        font-size: 14px;
        padding-right: 16px;
        @include ellipsis;
      }
      .media-artist {
        display: flex;
        align-items: center;
        flex: 1 1 170px;
        padding-right: 16px;
        font-size: 14px;
        @include ellipsis;
      }
      .media-time {
        max-width: 77px;
        flex: 1 1 66px;
        display: flex;
        text-align: right;
        align-items: center;
        padding-right: 16px;
        font-size: 14px;
        @include ellipsis;
      }

      .media-controls {
        justify-content: flex-end;
        flex: 0 0 100px;
        display: flex;
        align-items: center;
        padding-right: 11px;
        @include ellipsis;
        span {
          display: flex;
          align-items: center;
          min-width: 0;
          justify-content: flex-end;
          width: 24px;
          height: 24px;
          padding: 0;
          flex-shrink: 0;
          font-size: 24px;
          color: rgba(229, 238, 255, 0.6);
          transition: color 0.15s ease;
        }
      }
    }
  }
}
</style>