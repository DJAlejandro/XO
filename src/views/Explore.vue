<template>
  <div class="category">
    <v-slider
      :swiperWidth="swiperWidth"
      :grabCursor="grabCursor"
      :slidesPerView="slidesPerView"
      :slidesPerGroup="slidesPerGroup"
      :spaceBetween="spaceBetween"
    >
      <swiper-slide>
        <div class="category-list-wrapper">
          <ul
            class="category-list"
            v-for="(category,index1) in categorys"
            :class="{active1:activeIndex1==index1}"
          >
            <li
              class="category-item"
              v-for="(item,index2) in category"
              @click="catListInit(item,index1,index2)"
              :class="{active2:activeIndex2==index2}"
            >{{item}}</li>
          </ul>
        </div>
      </swiper-slide>
    </v-slider>
    <div class="category-paginate">
      <paginate name="languages" :list="playlists" :per="20">
        <li
          class="category-paginate-item"
          v-for="playlist in paginated('languages')"
          :style="{backgroundImage: 'url('+playlist.src+'?param=360y360)'}"
          @click="goToPlayList($event,playlist.id,false)"
          v-preventReClick
        >
          <div class="category-item-content">
            <span class="category-item-content-text">{{playlist.name}}</span>
            <span class="category-item-content-text">{{playlist.desc}}</span>
          </div>
        </li>
      </paginate>
      <paginate-links
        for="languages"
        :show-step-links="true"
        :step-links="{
            next: '下一页',
            prev: '上一页'
          }"
      ></paginate-links>
    </div>
  </div>
</template>

<script>
import VSlider from "components/VSlider.vue";

import mixins from "mixins/index.js";

import { instance } from "mixins/index.js";

export default {
  mixins: [mixins],
  data() {
    return {
      activeIndex1: 0,
      activeIndex2: 0,
      categorys: [],
      playlists: [{}],
      swiperWidth: 1126,
      grabCursor: true,
      slidesPerView: "auto",
      slidesPerGroup: 5,
      spaceBetween: 20,
      paginate: ["languages"]
    };
  },
  components: {
    VSlider
  },
  methods: {
    catListInit(itemName, index1, index2) {
      this.activeIndex1 = index1;
      this.activeIndex2 = index2;
      instance
        .get("/top/playlist", {
          params: {
            limit: 500,
            cat: itemName
          }
        })
        .then(res => {
          let arr = [];
          res.data.playlists.forEach(function(item) {
            let { name, coverImgUrl, description, id } = item;
            arr.push({
              id,
              name,
              src: coverImgUrl,
              desc: description
            });
          });

          this.playlists = arr;
        });
    }
  },
  created() {
    this.catListInit();
    instance.get("/playlist/catlist").then(res => {
      let category = [];
      let resSub = res.data.sub.filter(function(item) {
        return item.category == 0 || item.category == 1;
      });
      let data = resSub.map(function(item) {
        return item.name;
      });
      data.unshift("全部");
      let data1 = data.splice(0, Math.floor(data.length / 2));
      let data2 = data;
      category.push(data1);
      category.push(data2);
      this.categorys = category;
    });
  }
};
</script>

<style lang="scss">
@import "~style/iconfont.css";
@import "~style/mixin.scss";
@import "~style/index.scss";

.category /deep/ .swiper-slide {
  width: auto;
}

.category /deep/ .swiper-container {
  mask-size: 100%;
  mask-position: 0;
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    #000 5%,
    #000 95%,
    transparent
  );
}

.category /deep/ .swiper-button-disabled {
  opacity: 0;
}
.swiper-button-next,
.swiper-button-prev {
  margin-top: 0;
}
.category-list-wrapper {
  .active1 .active2 {
    background-color: rgba(229, 238, 255, 0.4) !important;
  }
  .category-list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .category-item {
      align-items: center;
      background-color: rgba(229, 238, 255, 0.2);
      display: inline-flex;
      justify-content: center;
      border-radius: 12px;
      height: 48px;
      line-height: 49px;
      padding: 0 24px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: background 0.35s ease;
      min-height: 0;
      min-width: 0;
      padding: 0 22px;
      margin-right: 20px;
      width: auto;
    }
  }
}

.category-paginate {
  margin: 40px 0;
  a {
    color: #fff;
  }
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-column-gap: 20px; //列与列的间隔
    grid-row-gap: 20px; //行与行的间隔
    margin: 0 25px;
  }
  .category-paginate-item {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
    padding-bottom: 100%;
    border: #666 1px solid;
    cursor: pointer;
    img {
      width: 100%;
    }
    .category-item-content {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 66%;
      left: 0;
      height: 34%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 15px;
      line-height: 1.5;

      .category-item-content-text {
        flex: 1;
        @include ellipsis;
        font-size: 14px;
        color: #fff;
        line-height: 20px;
      }
    }
  }
  .paginate-links {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .left-arrow,
    .right-arrow,
    .number {
      user-select: none;
      height: 22px;
      padding: 0 8px;
      background-color: #000;
      color: #fff;
      line-height: 22px;
      margin: 0 4px;
      border: 1px solid #ccc;
      border-radius: 2px;
      vertical-align: middle;
      font-size: 12px;
      cursor: pointer;
    }
    .number:hover {
      border-color: #fff;
    }
    .left-arrow:hover,
    .right-arrow:hover {
      background-color: #333;
    }
    .left-arrow.disabled,
    .right-arrow.disabled {
      background-color: #ebebeb;
      color: #cacaca;
      cursor: default;
    }
    .active {
      background-color: #a2161b;
      border: 1px solid #a2161b;
    }
  }
}
</style>
