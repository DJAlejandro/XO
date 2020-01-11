<template>
  <div class="play-list-item">
    <div class="play-list-header">
      <h2 class="play-list-title">{{items.title}}</h2>
      <a class="view-all" href="#" @click="view($event)" v-preventReClick>View all</a>
    </div>
    <v-slider
      :swiperWidth="swiperWidth"
      :grabCursor="grabCursor"
      :slidesPerView="slidesPerView"
      :slidesPerGroup="slidesPerGroup"
      :spaceBetween="spaceBetween"
    >
      <template v-for="item in items.data">
        <swiper-slide>
          <div class="home-slider-item" v-if="item">
            <div class="home-slider-img-wrapper" @click="goTo($event,item.id)" v-preventReClick>
              <img :src="item.src+'?param=200y200'" :alt="item.title" class="item-img" />
              <div class="home-slider-overlay">
                <span class="icon-more iconfont" @click.stop="go"></span>
                <span class="icon-play iconfont" @click.stop="go"></span>
                <span class="icon-favourite iconfont" @click.stop="go"></span>
              </div>
            </div>
            <div class="home-slider-content">
              <span class="home-slider-content-text" @click="goTo($event,item.id)" v-preventReClick>
                <a>{{item.title}}</a>
              </span>
              <span class="home-slider-content-text">
                <span
                  class="aritst"
                  v-for="(aritst,index) in item.artists"
                  @click="goToArtist($event,aritst.id,false)"
                  v-preventReClick
                >
                  <i v-if="index!==0">,</i>
                  <a>{{aritst.name}}</a>
                </span>
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

export default {
  mixins: [mixins],
  props: ["items"],
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
    goTo(event, id) {
      console.log(id);

      if (event.target.disabled) {
        // 点击太频繁了
        console.log("点击太频繁了");
        return;
      }
      this.$emit("go-to", { event, id });
    },
    view(event) {
      // console.log(event.target.disabled);

      // if (event.target.disabled) {
      //   // 点击太频繁了
      //   console.log("点击太频繁了");
      //   return;
      // }
      this.$emit("view-all");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/mixin.scss";

.play-list-item /deep/ .swiper-container {
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

.play-list-item /deep/ .swiper-button-disabled {
  opacity: 0;
}
.swiper-slide:first-of-type {
  margin-left: 28px;
}
.swiper-slide:last-of-type {
  margin-right: 28px;
}
.play-list-item {
  display: flex;
  flex-direction: column;
  .play-list-header {
    display: flex;
    align-items: baseline;
    margin: 0 28px;
    .play-list-title {
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
    .item-img {
      width: 100%;
    }
    .home-slider-overlay {
      position: absolute;
      display: flex;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
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
      line-height: 20px;

      a {
        color: #fff;
        &:hover {
          text-decoration: underline;
        }
      }
      &:last-of-type {
        color: rgba(255, 255, 255, 0.5);

        a,
        i {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
