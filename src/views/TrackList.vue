<template>
  <div class="track-list" v-if="trackList.length>0">
    <div class="media-row header">
      <div class="media-index">#</div>
      <div class="media-title">title</div>
      <div class="media-artist">artist</div>
      <div class="media-time">time</div>
      <div class="media-controls"></div>
    </div>
    <div
      class="media-row"
      v-for="(track,index) in tracks"
      :class="{active:activeIndex===index}"
      @click="changeIndex(index)"
    >
      <div class="media-index">
        <div class="text">{{index+1}}</div>
        <span class="play">
          <span class="icon-play iconfont"></span>
        </span>
      </div>
      <div class="media-title">{{track.name}}</div>
      <div class="media-artist">
        <span v-for="(artist,index) in track.artists">
          <span v-if="index!==0">,</span>
          {{artist.name}}
        </span>
      </div>
      <div class="media-time">{{InstoreTime(track.time)}}</div>
      <div class="media-controls">
        <span class="icon-more iconfont"></span>
        <span class="icon-add iconfont"></span>
        <span class="icon-favourite iconfont"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    shortFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      trackList: "trackList"
    }),
    tracks() {
      return this.shortFlag ? this.trackList.slice(0, 5) : this.trackList;
    }
  },
  methods: {
    InstoreTime(time) {
      let msec = Math.floor(time / 1000) * 1000;
      let minutes = parseInt(msec / (1000 * 60));
      let seconds = parseInt((msec % (1000 * 60)) / 1000) + "";
      seconds = seconds.padStart(2, "0");
      return minutes + ":" + seconds;
    },
    changeIndex(index) {
      this.activeIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/mixin.scss";

.media-row {
  display: flex;
  color: #fff;
  overflow: hidden;
  height: 48px;
  width: 100%;
  &:hover {
    background-color: rgba(246, 245, 255, 0.1);
    outline: 0;
    .media-index {
      .play {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .text {
        display: none;
      }
    }
  }
  &.header {
    div {
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0.5px;
      color: rgba(229, 238, 255, 0.6);
    }
  }
  &.active {
    background-color: rgba(246, 245, 255, 0.1);
    outline: 0;
  }
  .media-index {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    flex: 0 0 42px;
    width: 28px;
    color: #79777f;
    font-size: 14px;
    @include ellipsis;
    .text {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .play {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      .icon-play {
        font-size: 24px !important;
        color: #fff;
      }
    }
  }
  .media-title {
    display: flex;
    align-items: center;
    flex: 1 0 228px;
    font-size: 14px;
    padding-right: 16px;
    @include ellipsis;
  }
  .media-artist {
    display: flex;
    align-items: center;
    flex: 1 1 170px;
    padding-right: 16px;
    font-size: 14px;
    @include ellipsis;
  }
  .media-time {
    max-width: 77px;
    flex: 1 1 66px;
    display: flex;
    text-align: right;
    align-items: center;
    padding-right: 16px;
    font-size: 14px;
    @include ellipsis;
  }

  .media-controls {
    justify-content: flex-end;
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    padding-right: 11px;
    @include ellipsis;
    span {
      display: flex;
      align-items: center;
      min-width: 0;
      justify-content: flex-end;
      width: 24px;
      height: 24px;
      padding: 0;
      flex-shrink: 0;
      font-size: 24px;
      color: rgba(229, 238, 255, 0.6);
      transition: color 0.15s ease;
    }
  }
}
</style>