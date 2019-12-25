<template>
  <div class="artist-detail">
    <v-header></v-header>
    <div class="artist-header" ref="header">
      <div class="artist-img">
        <img :src="artist.img1v1Url+'?param=200y200'" alt="edit" />
      </div>
      <div class="artist-content">
        <div class="artist-content-title">{{artist.name}}</div>
        <div class="artist-content-info">{{artist.briefDesc}}</div>
        <div class="artist-content-more">read more</div>
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
        <img :src="artist.img1v1Url+'?param=200y200'" alt="edit" />
      </div>
      <div class="artist-content-title">{{artist.name}}</div>
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
        <a href="#" class="view-all" @click="goToTracks()">View all</a>
      </div>
      <trackList :shortFlag="shortFlag" :viewFull="viewFull"></trackList>
    </div>
    <div class="play-list-wrapper">
      <play-list :items="albums" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="eps" />
    </div>
    <div class="play-list-wrapper" v-if="others.length>0">
      <play-list :items="others" />
    </div>
    <artists-list :artistsList="artistsList" />
  </div>
</template>

<script>
import ArtistsList from "./ArtistsList.vue";
import PlayList from "./PlayList.vue";
import VHeader from "components/VHeader.vue";
import TrackList from "./TrackList.vue";
import { mapActions } from "vuex";

import axios from "axios";

let instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  withCredentials: true
});

export default {
  data() {
    return {
      hotAlbums: [],
      albums: [],
      eps: [],
      others: [],
      artistsList: {},
      artist: {},
      shortFlag: true,
      viewFull: true,
      height: 0,
      scrollTop: 0
    };
  },
  methods: {
    ...mapActions(["setTrackListActions"]),
    ...mapActions(["setViewFullActions"]),

    goToTracks() {
      let id = this.$route.query.id;
      this.setViewFullActions(true);

      this.$router
        .push({ path: "/top-tracks", query: { id } })
        .catch(err => {});
    },
    serialData(data, tag) {
      let arr = [];
      data.forEach(function(item) {
        tag ? (item = item.album) : (item = item);
        let { picUrl, name, type, artists, id } = item;

        arr.push({
          src: picUrl,
          title: name,
          artists,
          type,
          id
        });
      });
      return arr;
    },

    refreshArtist() {
      this.$emit("scroll-top");

      let id = this.$route.query.id;

      instance
        .get("/artists/desc", {
          params: {
            id
          }
        })
        .then(res => {
          this.artist = res.data.artist;
          // console.log(res); //获取歌手描述
        });

      instance
        .get("/artists", {
          params: {
            id
          }
        })
        .then(res => {
          //获取歌手单曲

          let tracks = [];
          res.data.hotSongs.forEach(item => {
            let { dt, name, id, ar, al } = item;
            tracks.push({
              time: dt,
              name,
              artists: ar,
              album: al,
              id
            });
          });
          this.setTrackListActions(tracks);
        });

      instance
        .get("/artist/album", {
          params: {
            id
          }
        })
        .then(res => {
          // console.log(res); //获取歌手专辑

          let data = this.serialData(res.data.hotAlbums, false);
          let eps = [];
          let albums = [];
          let others = [];
          data.forEach(function(item) {
            switch (item.type) {
              case "EP/Single":
                eps.push(item);
                break;
              case "专辑":
                albums.push(item);
                break;
              default:
                others.push(item);
                break;
            }
          });
          this.eps = {
            title: "EP & Singles",
            data: eps
          };
          this.albums = {
            title: "Albums",
            data: albums
          };
          this.others = {
            title: "Others",
            data: others
          };
        });

      instance
        .get("/simi/artist", {
          params: {
            id
          }
        })
        .then(res => {
          // console.log(res); //获取相似歌手
          let artists = [];
          res.data.artists.forEach(function(item) {
            let { id, img1v1Url, name } = item;
            artists.push({
              id,
              name,
              src: img1v1Url
            });
          });

          this.artistsList = {
            title: "Related Artists",
            data: artists
          };
        });
    }
  },
  components: {
    PlayList,
    ArtistsList,
    VHeader,
    TrackList
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