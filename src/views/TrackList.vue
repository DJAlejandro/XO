<template>
  <div class="track-list" v-if="trackList.length>0">
    <div class="media-row header">
      <div class="media-index">#</div>
      <div class="media-title">title</div>
      <div class="media-artist">artist</div>
      <div class="media-album" v-if="notAlbum">album</div>
      <div class="media-time">time</div>
      <div class="media-controls"></div>
    </div>
    <div
      class="media-row"
      v-for="(track,index) in tracks"
      :class="{active:activeIndex===index}"
      @click="changeIndex(index)"
      v-if="track!=null"
    >
      <div class="media-index" @click="playTrack(track)">
        <div class="text active" v-if="needImg && track.album.picUrl">
          <img :src="track.album.picUrl+'?param=42y42'" alt="track.name" />
        </div>
        <div class="text" v-else>{{index+1}}</div>
        <span class="play">
          <span class="icon-play iconfont"></span>
        </span>
      </div>
      <div class="media-title" v-if="track.name">{{track.name}}</div>
      <div class="media-artist">
        <a href="#">
          <span
            v-for="(artist,index) in track.artists"
            @click="goToArtist($event,artist.id,true)"
            v-preventReClick
          >
            <span v-if="index!==0">,</span>
            {{artist.name}}
          </span>
        </a>
      </div>
      <div
        class="media-album"
        v-if="notAlbum"
        @click="goToAlbum($event,track.album.id,true)"
        v-preventReClick
      >
        <a href="#">{{track.album.name}}</a>
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
import mixins from "mixins/index.js";
export default {
  mixins: [mixins],
  props: {
    shortFlag: {
      //只显示前五项
      type: Boolean,
      default: false
    },
    needImg: {
      //是否需要图片
      type: Boolean,
      default: false
    },
    notAlbum: {
      //是否是album
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
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
    },
    playTrack(item) {
      this.setFooterPlayerActions(item);
      this.setIsPlayingActions(true);
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
        &.active {
          display: inline-block;
          img {
            opacity: 0.5;
          }
        }
      }
    }
  }
  &.header {
    align-items: center;
    justify-content: center;
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
    position: relative;
    text-align: center;
    line-height: 48px;
    flex: 0 0 42px;
    color: #79777f;
    font-size: 14px;
    @include ellipsis;
    .text {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      text-align: center;
      width: 100%;
      height: 100%;
      vertical-align: middle;
      img {
        width: 42px;
        height: 42px;
      }
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
    flex: 1 0 228px;
    font-size: 14px;
    padding-right: 16px;
    padding-left: 12px;

    line-height: 48px;
    @include ellipsis;
  }
  .media-artist {
    flex: 1 1 170px;
    padding-right: 16px;
    font-size: 14px;
    line-height: 48px;
    @include ellipsis;
    a {
      color: #fff;
    }
  }
  .media-album {
    flex: 1 1 112px;
    padding-right: 16px;
    font-size: 14px;
    line-height: 48px;

    @include ellipsis;
    a {
      color: #fff;
    }
  }
  .media-time {
    flex: 1 1 66px;
    max-width: 77px;
    text-align: right;
    padding-right: 16px;
    font-size: 14px;
    line-height: 48px;

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