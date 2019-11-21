<template>
  <div class="banner-wrapper">
    <swiper :options="swiperOption">
      <slot></slot>
      <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    swiperWidth: {
      type: Number,
      default: 0
    },
    grabCursor: {
      type: Boolean,
      default: true
    },
    slidesPerView: {
      type: Number,
      default: 1
    },
    slidesPerGroup: {
      type: Number,
      default: 1
    },
    spaceBetween: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      swiperOption: {
        swiperWidth: this.swiperWidth,
        grabCursor: this.grabCursor,
        slidesPerView: this.slidesPerView,
        slidesPerGroup: this.slidesPerGroup,
        spaceBetween: this.spaceBetween,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
</style>