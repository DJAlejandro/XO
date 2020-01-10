<template>
  <div class="artist-list-item">
    <div class="artist-list-header">
      <h2 class="artist-list-title">{{artistsList.title}}</h2>
      <a class="view-all" @click="goToArtists">View all</a>
    </div>
    <v-slider
      :swiperWidth="swiperWidth"
      :grabCursor="grabCursor"
      :slidesPerView="slidesPerView"
      :slidesPerGroup="slidesPerGroup"
      :spaceBetween="spaceBetween"
    >
      <template v-for="item in artistsList.data">
        <swiper-slide>
          <div class="home-slider-item" @click="goToArtist($event,item.id,false)">
            <div class="home-slider-img-wrapper">
              <img
                :src="item.src+'?param=200y200'"
                :alt="item.name"
                class="item-img"
                v-if="item.src"
              />
              <div v-else class="sub-name">{{item.name | subName}}</div>

              <div class="home-slider-overlay">
                <span class="icon-more iconfont" @click.stop="go"></span>
                <span class="icon-play iconfont" @click.stop="go"></span>
                <span class="icon-favourite iconfont" @click.stop="go"></span>
              </div>
            </div>
            <div class="home-slider-content">
              <span class="home-slider-content-text">
                <a href="#">{{item.name}}</a>
              </span>
            </div>
          </div>
        </swiper-slide>
      </template>
    </v-slider>
  </div>
</template>

<script>
import VSlider from "components/VSlider.vue";

import mixins from "mixins/index.js";
import { instance } from "mixins/index.js";
export default {
  mixins: [mixins],
  props: {
    artistsList: {
      default: {},
      type: Object
    },
    listFlag: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      swiperWidth: 1126,
      grabCursor: true,
      slidesPerView: 6,
      slidesPerGroup: 5,
      spaceBetween: 20,
      albumList: {}
    };
  },

  components: {
    VSlider
  },
  methods: {
    go() {},
    goToArtists() {
      if (this.listFlag) {
        this.setFocusFlagActions(false);
        this.$router
          .push({ path: "/search/artist", query: { q: this.result } })
          .catch(err => {});
      } else {
        this.$router
          .push({ path: "/related-artist", query: { q: this.result } })
          .catch(err => {});
      }

      this.setCategoryListActions({
        type: "artist",
        playLists: this.artistsList.data
      });
    }
  },
  mounted() {
    this.result = this.searchResult;
  }
};
</script>

<style lang="scss" scoped>
@import "~style/mixin.scss";

.artist-list-item /deep/ .swiper-container {
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

.artist-list-item /deep/ .swiper-button-disabled {
  opacity: 0;
}
.swiper-slide:first-of-type {
  margin-left: 28px;
}
.swiper-slide:last-of-type {
  margin-right: 28px;
}
.artist-list-item {
  display: flex;
  flex-direction: column;
  .artist-list-header {
    display: flex;
    align-items: baseline;
    margin: 0 28px;
    .artist-list-title {
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
.home-slider-item {
  display: flex;
  flex-direction: column;
  height: 218px;

  .home-slider-img-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 50%;
    background-color: #242528;
    .sub-name {
      font-size: 65px;
      color: #72777f;
      font-weight: 600;
      text-transform: uppercase;
      text-align: center;
      margin-top: 50%;
      line-height: 1;
      -webkit-transform: translateY(-37.5px);
      transform: translateY(-37.5px);
    }
    .item-img {
      width: 100%;
      border-radius: 50%;
    }
    .home-slider-overlay {
      position: absolute;
      display: flex;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      .icon-favourite::before,
      .icon-more::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 31px;
        height: 31px;
        font-size: 31px;
      }
      .icon-play::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        font-size: 42px;
      }
    }
    &:hover {
      .home-slider-overlay {
        opacity: 1;
      }
    }
  }
  .home-slider-content {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    .home-slider-content-text {
      @include ellipsis;
      font-size: 14px;
      color: #fff;
      line-height: 20px;
      text-align: center;
      a {
        color: #fff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
