<template>
  <div class="home">
    <v-header tag="Home" />
    <div class="slider-wrapper play-list-wrapper">
      <v-slider
        :swiperWidth="swiperWidth"
        :grabCursor="grabCursor"
        :slidesPerView="slidesPerView"
        :slidesPerGroup="slidesPerGroup"
        :spaceBetween="spaceBetween"
      >
        <template v-for="ep in eps">
          <swiper-slide>
            <div class="banner-item" :style="{backgroundImage: 'url('+ep.src+'?param=360y360)'}">
              <div class="banner-item-img-wrapper">
                <img :src="ep.src+'?param=360y360'" :alt="ep.title" class="ep-img" />
              </div>
              <div class="banner-item-content">
                <span class="banner-item-content-text">{{ep.title}}</span>
                <span class="banner-item-content-text">{{ep.title}}</span>
                <span class="banner-item-content-text"></span>
              </div>
            </div>
          </swiper-slide>
        </template>
      </v-slider>
    </div>
    <div class="play-list-wrapper">
      <play-list :items="eps" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="eps" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="eps" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="eps" />
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
      eps: [],
      songs: [],
      swiperWidth: 1126,
      grabCursor: true,
      slidesPerView: 3.2,
      slidesPerGroup: 3,
      spaceBetween: 20
    };
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
        console.log("login");

        console.log(res); //全部新歌
      });
    instance.get("/top/album").then(res => {
      console.log("album");
      console.log(res.data.albums); //新专辑
    });

    instance.get("/album/newest").then(res => {
      let arr = [],
        singers = [];
      console.log("EP");
      res.data.albums.forEach(function(item) {
        let { blurPicUrl, name, type, artists } = item;

        artists.forEach(function(item) {
          singers = [];
          let { name } = item;
          singers.push(name);
        });
        let singersName = singers.join(",");
        arr.push({
          src: blurPicUrl,
          title: name,
          artists: singersName,
          type
        });
      });
      console.log(arr);
      this.eps = arr;
    });
    instance.get("/top/song").then(res => {
      console.log("song");

      this.songs = res.data.data.slice(0, 9);
      console.log(this.songs); //全部新歌
    });

    instance.get("banner").then(res => {
      console.log("banner");

      console.log(res.data.banners); //全部新歌
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
  margin-top: 80px;
  width: 100%;
}

.swiper-slide:first-of-type {
  margin-left: 28px;
}
.swiper-slide:last-of-type {
  margin-right: 28px !important;
}

.banner-wrapper {
  .banner-item::before {
    position: absolute;
    content: "";
    z-index: 2;
    left: -10px;
    top: -10px;
    z-index: 2;
    width: 110%;
    height: 110%;
    filter: blur(15px);
    background: inherit;
  }
  .banner-item {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 336px;
    overflow: hidden;
    background: inherit;
    z-index: 1;
    .banner-item-img-wrapper {
      z-index: 10;
      display: flex;
      flex: 3;
      align-items: center;
      justify-content: center;
      .ep-img {
        width: 200px;
        height: 200px;
      }
    }
    .banner-item-content {
      position: relative;
      display: flex;
      flex: 1;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 15px;
      line-height: 1.5;
    }
  }
  .swiper-button-next,
  .swiper-button-prev {
    width: 20px;
    height: 20px;
    margin-top: -70px;
    background-size: 20px 20px;
    opacity: 1;
  }
}

.play-list-wrapper {
  margin-bottom: 48px;
}
</style>