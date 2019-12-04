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
    <div class="play-list-wrapper">
      <play-list :items="newAlbums" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="topAlbums" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="topSongs" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="topLists" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import { log } from "util";
import Vue from "vue";
import VHeader from "components/VHeader.vue";
import VSlider from "components/VSlider.vue";
import PlayList from "./PlayList.vue";
export default {
  name: "home",
  components: {
    VHeader,
    VSlider,
    PlayList
  },
  data() {
    return {
      banners: [],
      songs: [],
      newAlbums: [],
      topAlbums: [],
      topSongs: [],
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
    serialData(data, tag) {
      let arr = [];
      data.forEach(function(item) {
        tag ? (item = item.album) : (item = item);
        let { blurPicUrl, name, type, artists, id } = item;

        arr.push({
          src: blurPicUrl,
          title: name,
          artists,
          type,
          id
        });
      });
      return arr;
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
    let instance = axios.create({
      baseURL: "http://localhost:3000",
      timeout: 30000
    });

    // instance.get('/comment/music',{
    //   params:{
    //     id:186016,
    //     limit:1
    //   }
    // }).then(res=>{
    //     console.log(res)
    // })

    instance
      .get("/login", {
        params: {
          email: "siyangslg@163.com",
          password: "si21040404"
        }
      })
      .then(res => {
        // console.log("login");
        // console.log(res); //全部新歌
      });
    instance.get("/top/album").then(res => {
      let data = this.serialData(res.data.albums.slice(0, 12), false);
      this.topAlbums = {
        title: "新碟上架",
        data
      };
    });

    instance.get("/album/newest").then(res => {
      let data = this.serialData(res.data.albums.slice(0, 12), false);
      this.newAlbums = {
        title: "最新专辑",
        data
      };
    });

    instance.get("/top/song?type=96").then(res => {
      let reres = res.data.data.slice(0, 12);
      let data = this.serialData(reres, true);
      this.topSongs = {
        title: "新歌速递",
        data
      };
    });

    instance.get("banner?type=3").then(res => {
      let data = this.serialData4(res.data.banners);
      this.banners = data;
    });

    // instance.get("/toplist/detail").then(res => {
    //   console.log(res.data); //全部新歌
    // });
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
</style>