<template>
  <div class="home">
    <v-header tag="Home" />
    <div class="slider-wrapper">
      <v-slider
        :swiperWidth="swiperWidth"
        :grabCursor="grabCursor"
        :slidesPerView="slidesPerView"
        :slidesPerGroup="slidesPerGroup"
        :spaceBetween="spaceBetween"
        :autoplay="autoplay"
        :loop="loop"
      >
        <template v-for="item in banners">
          <swiper-slide>
            <img :src="item.src" :alt="item.title" class="home-item-img" />
          </swiper-slide>
        </template>
      </v-slider>
    </div>
    <div class="media-container">
      <div class="media-header">
        <div class="media-header-title">新歌速递</div>
        <a href="#" class="view-all" @click="goToTracks2($event)" v-preventReClick>View all</a>
      </div>
      <trackList :shortFlag="shortFlag" :needImg="needImg"></trackList>
    </div>
    <div class="play-list-wrapper">
      <play-list :items="newAlbums" @go-to="goTo($event,ALBUM)" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="topAlbums" @go-to="goTo($event,ALBUM)" />
    </div>

    <div class="play-list-wrapper">
      <play-list :items="topLists" @go-to="goTo($event,PLAYLIST)" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Cookies from "js-cookie";
import { log } from "util";
import Vue from "vue";
import VHeader from "components/VHeader.vue";
import VSlider from "components/VSlider.vue";
import PlayList from "./PlayList.vue";
import TrackList from "./TrackList.vue";

import mixins from "mixins/index.js";
import { instance, ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";

export default {
  mixins: [mixins],
  name: "home",
  components: {
    VHeader,
    VSlider,
    PlayList,
    TrackList
  },
  data() {
    return {
      ALBUM,
      PLAYLIST,
      ARTIST,
      needImg: true,
      shortFlag: true,
      banners: [],
      songs: [],
      newAlbums: [],
      topAlbums: [],
      topLists: [],
      swiperWidth: 1126,
      grabCursor: true,
      slidesPerView: 1.4,
      slidesPerGroup: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 3000, //自动切换的时间间隔
        stopOnLastSlide: false //如果设置为true，当切换到最后一个slide时停止自动切换
      },
      loop: true
    };
  },
  methods: {
    goTo(event, type) {
      switch (type) {
        case ALBUM:
          this.goToAlbum(event.event, event.id, false);
          break;
        case PLAYLIST:
          this.goToPlayList(event.event, event.id, false);
          break;
        default:
          break;
      }
    },
    serialData4(item) {
      let arr = [],
        singers = [];
      item.forEach(function(item) {
        let { pic, typeTitle } = item;

        arr.push({
          src: pic,
          title: typeTitle
        });
      });
      return arr;
    }
  },
  created() {
    // instance.get('/comment/music',{
    //   params:{
    //     id:186016,
    //     limit:1
    //   }
    // }).then(res=>{
    //     console.log(res)
    // })

    instance
      .post("/login", {
        email: "siyangslg@163.com",
        password: "si21040404"
      })
      .then(res => {
        let user = Cookies.get("MUSIC_U");
        this.setCookieActions(user);
      });
    instance.get("/top/album").then(res => {
      let data = this.serialData(res.data.albums.slice(0, 30), false);
      this.topAlbums = {
        title: "新碟上架",
        data
      };
    });

    instance.get("/album/newest").then(res => {
      let data = this.serialData(res.data.albums.slice(0, 30), false);
      this.newAlbums = {
        title: "最新专辑",
        data
      };
    });

    instance.get("/top/song?type=96").then(res => {
      let arr = [];
      res.data.data.forEach(function(item) {
        let { duration, name, id, artists, album } = item;
        arr.push({
          time: duration,
          name,
          artists,
          id,
          album
        });
      });
      this.setTrackListActions(arr);
    });

    instance.get("banner?type=3").then(res => {
      let data = this.serialData4(res.data.banners);
      this.banners = data;
    });

    instance.get("/toplist/detail").then(res => {
      console.log(res.data); //所有榜单内容摘要
      let arr = [];
      res.data.list.forEach(function(item) {
        let { id, name, coverImgUrl } = item;
        arr.push({
          id,
          title: name,
          src: coverImgUrl
        });
      });
      this.topLists = {
        title: "榜单",
        data: arr
      };
    });
  }
};
</script>


<style lang='scss'>
.home {
  display: flex;
  flex-direction: column;
  position: relative;
}
.slider-wrapper {
  margin: 80px 0 48px 0;
  width: 100%;
}
.slider-wrapper /deep/ .swiper-button-disabled {
  opacity: 0 !important;
}
.swiper-slide:first-of-type {
  margin-left: 28px;
}
.swiper-slide:last-of-type {
  margin-right: 28px !important;
}
.home-item-img {
  // width: 100%;
  height: 300px;
}
// .banner-item::before {
//   position: absolute;
//   content: "";
//   z-index: 2;
//   left: -10px;
//   top: -10px;
//   z-index: 2;
//   width: 110%;
//   height: 110%;
//   filter: blur(15px);
//   background: inherit;
// }
// .banner-item {
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   height: 336px;
//   overflow: hidden;
//   background: inherit;
//   z-index: 1;
//   .banner-item-img-wrapper {
//     z-index: 10;
//     display: flex;
//     flex: 3;
//     align-items: center;
//     justify-content: center;

//   }
//   .banner-item-content {
//     position: relative;
//     display: flex;
//     flex: 1;
//     z-index: 10;
//     background-color: rgba(0, 0, 0, 0.6);
//     color: #fff;
//     padding: 15px;
//     line-height: 1.5;
//   }
// }

.play-list-wrapper {
  margin-bottom: 48px;
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