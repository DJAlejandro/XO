<template>
  <div class="home-slider-wrapper">
    <v-slider
      :swiperWidth="swiperWidth"
      :grabCursor="grabCursor"
      :slidesPerView="slidesPerView"
      :slidesPerGroup="slidesPerGroup"
      :spaceBetween="spaceBetween"
    >
      <template v-for="item in items">
        <swiper-slide>
          <div class="home-slider-item">
            <div class="home-slider-img-wrapper">
              <img :src="item.src+'?param=200y200'" :alt="item.title" class="item-img" />
            </div>
            <div class="home-slider-content">
              <span class="home-slider-content-text">{{item.title}}</span>
              <span class="home-slider-content-text">{{item.artists}}</span>
            </div>
          </div>
        </swiper-slide>
      </template>
    </v-slider>
  </div>
</template>

<script>
import VSlider from "components/VSlider.vue";
export default {
  props: ["items"],
  data() {
    return {
      swiperWidth: 1126,
      grabCursor: true,
      slidesPerView: 6,
      slidesPerGroup: 5,
      spaceBetween: 20
    };
  },
  components: {
    VSlider
  }
};
</script>script

<style lang="scss" scoped>
.swiper-slide:first-of-type {
  margin-left: 28px;
}
.swiper-slide:last-of-type {
  margin-right: 28px;
}

.swiper-button-next,
.swiper-button-prev {
  opacity: 1;
  width: 15px;
  height: 20px;
  margin-top: -30px;
}
.home-slider-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .home-slider-item {
    display: flex;
    flex-direction: column;
    height: 218px;

    .home-slider-img-wrapper {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      .item-img {
        width: 100%;
      }
    }
    .home-slider-content {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
      .home-slider-content-text {
        font-size: 14px;
        color: #fff;
        line-height: 20px;
      }
    }
  }
}
</style>
