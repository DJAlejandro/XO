<template>
  <div class="album-detail">
    <div class="media-background">
      <img :src="albumList.src" />
    </div>
    <div class="modal-portal-warpper" v-if="isModalOpen">
      <modal-portal :modalData="modalData" @close-modal="closeModal"></modal-portal>
    </div>
    <v-header></v-header>
    <div class="album-header" v-if="albumList!=null">
      <div class="album-img">
        <img :src="albumList.src" alt="edit" />
      </div>
      <div class="album-content">
        <div class="album-content-title">{{albumList.name}}</div>

        <div class="album-content-desc">
          {{albumList.subDesc}}
          <span v-if="albumList.descLength>100">...&nbsp;</span>
          <span class="moreButton" @click="openModal" v-if="albumList.descLength>100">Read more</span>
        </div>

        <div class="album-content-info">
          <div class="album-content-text">
            by
            <span
              v-for="(artist,index) in albumList.artists"
              class="artist-name"
              @click="goToArtist($event,artist.id)"
              v-preventReClick
            >
              <span v-if="index!==0">,&nbsp;</span>
              <a>{{artist.name}}</a>
            </span>
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
      <trackList :notAlbum="notAlbum"></trackList>
    </div>
    <artists-list :artistsList="artistsList" />
  </div>
</template>
<script>
import { format } from "date-fns";

import VHeader from "components/VHeader.vue";
import ArtistsList from "./ArtistsList.vue";
import TrackList from "./TrackList.vue";
import ModalPortal from "components/ModalPortal.vue";

import mixins from "mixins/index.js";
import { instance, ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";

export default {
  mixins: [mixins],
  data() {
    return {
      albumList: {},
      artist: {},
      artistsList: {},
      isModalOpen: false,
      modalData: {},
      notAlbum: false
    };
  },
  components: {
    VHeader,
    ArtistsList,
    TrackList,
    ModalPortal
  },
  computed: {
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
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    initAlbum() {
      this.$emit("scroll-top");
      let id = this.$route.query.id;
      instance
        .get("/album", {
          params: {
            id
          }
        })
        .then(res => {
          let data = res.data;
          console.log(data);

          let {
            album: { picUrl, name, artists, artist, publishTime, description },
            songs
          } = data;
          let tracks = this.serialData2(songs);
          let reg1 = /[a-zA-Z0-9]/;
          let reg2 = /[\u4e00-\u9fa5]/; //汉字
          let descLength = description.length;
          let desArr = [];
          description = description.split("\n");
          description.forEach(item => {
            let str = item.trim();
            let last = str.charAt(str.length - 1);
            if (reg1.test(last) || reg2.test(last)) {
              str = str + "。";
            }
            desArr.push(str);
          });
          let subDesc = desArr.join("");
          subDesc = subDesc.substring(0, 100);

          this.artist = artist;
          this.albumList = {
            src: picUrl, //专辑封面
            name, //专辑名称
            artists, //专辑歌手
            publishTime, //发行时间,
            desc: description,
            subDesc,
            descLength
          };
          this.setTrackListActions(tracks);
          this.relatedArtist(this.artist.id);

          this.modalData = {
            description,
            imgSrc: picUrl,
            title: name,
            type: ALBUM,
            artists
          };
          artist.subDesc = subDesc;
        });
    }
  },

  mounted() {
    this.initAlbum();
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      this.initAlbum();
    }
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
      .album-content-desc {
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
      .album-content-info {
        color: hsla(0, 0%, 100%, 0.5);
        margin-bottom: 20px;
        font-size: 1.143rem;
        line-height: 1.5;
        text-align: left;
        font-size: 16px;
        .artist-name {
          color: #fff;
          a {
            color: #fff;
          }
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
  }
}
.play-list-wrapper {
  margin-bottom: 48px;
}
</style>