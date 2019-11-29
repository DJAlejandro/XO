<template>
  <div>
    <swiper :options="swiperOption">
      <slot></slot>
      <div class="swiper-button-prev" slot="button-prev">
        <i class="icon-right iconfont"></i>
      </div>
      <div class="swiper-button-next" slot="button-next">
        <i class="icon-right iconfont"></i>
      </div>
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
      type: [Number, String],
      default: 1
    },
    slidesPerGroup: {
      type: Number,
      default: 1
    },
    spaceBetween: {
      type: Number,
      default: 0
    },
    autoplay: {
      type: [Object, Boolean],
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    slidesPerColumn: {
      type: Number,
      default: 1
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
        slidesPerColumn: this.slidesPerColumn,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        autoplay: this.autoplay
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~style/iconfont.css";
.swiper-button-next,
.swiper-button-prev {
  background: none;
  opacity: 1;
  top: 0;
  width: 40px;
  height: 100%;
}
.swiper-button-prev {
  transform: rotate(180deg);
}

.icon-right {
  width: 40px;
  height: 40px;
  font-size: 40px;
  line-height: 40px;
  position: absolute;
  top: 50%;
  margin-top: -50%;
}
</style>