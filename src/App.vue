<template>
  <div id="app" @click="closeSearch">
    <div class="container">
      <side-bar />
      <div class="content-area">
        <div class="content-area-scorll" ref="content">
          <router-view @scroll-top="scrollTop"></router-view>
        </div>
      </div>
    </div>

    <div class="footer-player">
      <div class="top-row">
        <div class="progress-bar-wrapper" ref="filling">
          <div class="filling-block">
            <div class="knob" ref="knob"></div>
            <div class="indicator" ref="progress"></div>
          </div>
          <div
            class="interaction-layer"
            @mousedown.stop.prevent="dragStart"
            @mousemove.stop.prevent="drag"
            @mouseup.stop.prevent="dragEnd"
            @mouseleave="dragEnd"
          ></div>
        </div>
      </div>
      <div class="bottom-row">
        <div class="left-column">
          <div class="media-img" v-if="player.album">
            <img :src="player.album.picUrl+'?param=70y70'" />
          </div>
          <div class="media-info">
            <div class="media-info-title">{{player.name}}</div>
            <div class="media-info-artist">
              <a href="#">
                <span
                  v-for="(artist,index) in player.artists"
                  @click="goToArtist($event,artist.id,true)"
                  v-preventReClick
                >
                  <span v-if="index!==0">,</span>
                  {{artist.name}}
                </span>
              </a>
            </div>
          </div>
          <div class="media-controls">
            <span class="icon-more iconfont"></span>
            <span class="icon-favourite iconfont"></span>
          </div>
        </div>
        <div class="center-column" @click.stop>
          <div class="play-controls">
            <span class="icon-shuffle iconfont" @click="shuffle" :class="{active:shuffleType}"></span>
            <span class="icon-previous iconfont" @click="prev"></span>
            <span class="icon-play iconfont" @click="togglePlay" v-if="!isPlaying"></span>
            <span class="icon-pause iconfont" @click="togglePlay" v-if="isPlaying"></span>

            <span class="icon-next iconfont" @click="next(true)"></span>
            <span
              class="icon-repeat iconfont"
              @click="repeat"
              :class="{active:repeatType===1}"
              v-if="repeatType!==2"
            ></span>
            <span class="icon-repeat-one iconfont" @click="repeat" v-if="repeatType===2"></span>
          </div>
        </div>

        <div class="right-column">
          <div class="duration">
            <time class="currentTime">{{this.currentTime}}</time>
            <time class="currentTime center">/</time>
            <time v-if="player.time">{{InstoreTime(player.time)}}</time>
          </div>
          <div class="volume-slider" @click.stop>
            <span class="icon-volume-on iconfont" v-if="volume>0&&volume<50" @click="toggleValue"></span>
            <span class="icon-volume-full iconfont" v-if="volume>=50" @click="toggleValue"></span>
            <span class="icon-volume-off iconfont" v-if="volume===0" @click="toggleValue"></span>

            <input
              class="native-range"
              type="range"
              max="100"
              min="0"
              v-model.number="volume"
              ref="nativeRange"
            />
          </div>
          <div class="play-queue" @click.stop="toggleShow">
            <span class="icon-play-queue iconfont"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="play-queue-side-bar" :class="{show:playqueueShow}">
      <div class="play-queue-header">
        <div class="playqueue-title">Play Queue</div>
        <div class="playqueue-button">Save</div>
        <div class="playqueue-button">Clear</div>
      </div>
      <div class="playqueue-content" v-if="footerPlayer.length>0">
        <div class="playqueue-item" v-for="item in footerPlayer">
          <img :src="item.album.picUrl+'?param=50y50'" alt="item.name" />
          <div class="playqueue-group">
            <div class="playqueue-group-title" :class="{active:item.id===playerId}">{{item.name}}</div>
            <div class="playqueue-group-sub-title">
              <span
                v-for="(artist,index) in item.artists"
                @click.stop="goToArtist($event,artist.id)"
                v-preventReClick
              >
                <span v-if="index!==0">,</span>
                <a>{{artist.name}}</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio src ref="player" control @timeupdate="getCurrentTime" @ended="end"></audio>
  </div>
</template>

<script>
const NORAML = 0,
  CIRCLE = 1,
  REPEAT = 2,
  STOP = 3;
import SideBar from "./views/SideBar.vue";
import Home from "./views/Home.vue";
import mixins from "mixins/index.js";
import { instance } from "mixins/index.js";

export default {
  mixins: [mixins],
  data() {
    return {
      contentArea: Home,
      volume: 0,
      currentTime: 0,
      percent: -100,
      mouseDown: false,
      fillingWidth: 0,
      player: {},
      repeatType: 0,
      footerPlayerCopy: [],
      lastSongId: 0,
      playqueueShow: false
    };
  },
  components: {
    SideBar
  },
  methods: {
    shuffle() {
      if (this.shuffleType) {
        this.setShuffleTypeActions(false);
      } else {
        this.setShuffleTypeActions(true);
      }
    },
    repeat() {
      let type = this.repeatType;
      type++;
      if (type > 2) {
        type = NORAML;
      }
      this.repeatType = type;
    },
    scrollTop() {
      this.$refs.content.scrollTop = 0;
    },
    closeSearch() {
      this.setFocusFlagActions(false);
      this.playqueueShow = false;
    },
    InstoreTime(time) {
      let msec = Math.floor(time / 1000) * 1000;
      let minutes = parseInt(msec / (1000 * 60));
      let seconds = parseInt((msec % (1000 * 60)) / 1000) + "";
      seconds = seconds.padStart(2, "0");
      return minutes + ":" + seconds;
    },
    searchTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        localStorage.setItem("volume", parseInt(this.volume));
        if (this.volume !== 0) {
          localStorage.setItem("lastValue", parseInt(this.volume));
        }
      }, 300);
    },
    toggleValue() {
      let val = parseInt(localStorage.getItem("lastValue"));
      if (this.volume !== 0) {
        localStorage.setItem("lastValue", this.volume);
        this.volume = 0;
        localStorage.setItem("volume", 0);
      } else {
        this.volume = val;
        localStorage.setItem("volume", val);
      }
    },
    togglePlay() {
      if (this.isPlaying) {
        this.setIsPlayingActions(false);
        this.$refs.player.pause();
      } else {
        this.setIsPlayingActions(true);
        this.$refs.player.play();
      }
    },
    getCurrentTime() {
      let msec = Math.floor(this.$refs.player.currentTime);
      let minutes = parseInt(msec / 60);
      let seconds = parseInt(msec % 60) + "";
      seconds = seconds.padStart(2, "0");
      this.currentTime = minutes + ":" + seconds;
      let percent = (this.$refs.player.currentTime / this.player.time) * 1000;
      if (percent > 1) {
        percent = 1;
      }
      this.percent = 100 * percent - 100;
      this.$refs.progress.style.transform = `translateX(${this.percent}%)`;
      this.$refs.knob.style.left = this.fillingWidth * percent + "px";
    },
    end() {
      this.setIsPlayingActions(false);
      if (this.repeatType !== STOP) {
        this.next(false);
      }
    },
    dragStart(event) {
      this.mouseDown = true;
    },
    drag(event) {
      if (this.mouseDown) {
        this.$refs.knob.style.left = event.pageX + "px";
        let percent = event.pageX / this.fillingWidth;
        this.percent = 100 * percent - 100;
        this.$refs.progress.style.transform = `translateX(${this.percent}%)`;
        this.$refs.player.currentTime = (this.player.time * percent) / 1000;
      }
    },
    dragEnd(event) {
      this.mouseDown = false;
    },
    changeSong() {
      let flag1 = this.repeatType === REPEAT;
      let flag2 = true;
      if (!this.shuffleType) {
        this.player = this.footerPlayer[this.playerIndex];

        if (this.player.id === this.lastSongId) {
          flag2 = false;
        }
        this.setPlayerIdActions(this.player.id);
        localStorage.setItem("id", this.player.id);
        if (this.playerIndex === this.footerPlayer.length - 1) {
          if (this.repeatType !== CIRCLE) {
            this.repeatType = STOP;
          }
        }
      } else {
        this.player = this.footerPlayerCopy[this.playerIndex];
        if (this.player.id === this.lastSongId) {
          flag2 = false;
        }
        this.setPlayerIdActions(this.player.id);
        localStorage.setItem("id", this.player.id);
      }
      this.lastSongId = this.player.id;
      if (flag1) {
        this.$refs.player.play();
      }
      if (flag2) {
        instance
          .get("/song/url", {
            params: {
              id: this.player.id
            }
          })
          .then(res => {
            setTimeout(() => {
              this.$refs.player.src = res.data.data[0].url;
              this.$refs.player.autoplay = true;
              this.$refs.player.play();
            }, 300);
          });
      }
    },
    prev() {
      this.setIsPlayingActions(true);

      if (this.repeatType === REPEAT) {
        this.repeatType = NORAML;
        if (!this.shuffleType) {
          let index = this.playerIndex;
          index--;
          if (index < 0) {
            index = this.footerPlayer.length - 1;
          }
          this.setPlayerIndexActions(index);
        }
      } else if (this.repeatType === CIRCLE || this.repeatType === NORAML) {
        if (!this.shuffleType) {
          let index = this.playerIndex;
          index--;
          if (index < 0) {
            index = this.footerPlayer.length - 1;
          }
          this.setPlayerIndexActions(index);
        }
      } else if (this.repeatType === STOP) {
        this.repeatType = NORAML;
        this.setPlayerIndexActions(this.footerPlayer.length - 2);
      }
    },
    next(flag) {
      this.setIsPlayingActions(true);

      if (this.repeatType === REPEAT) {
        if (flag) {
          this.repeatType = 0;
          let index = this.playerIndex;
          index++;
          if (index > this.footerPlayer.length - 1) {
            index = 0;
          }
          this.setPlayerIndexActions(index);
        }
      } else if (this.repeatType === CIRCLE) {
        let index = this.playerIndex;
        index++;
        if (index > this.footerPlayer.length - 1) {
          index = 0;
        }
        this.setPlayerIndexActions(index);
      } else if (this.repeatType === NORAML) {
        let index = this.playerIndex;
        index++;
        if (index > this.footerPlayer.length - 1) {
          if (flag) {
            index = 0;
          } else {
            this.repeatType = STOP;
            index = this.footerPlayer.length - 1;
          }
        }
        this.setPlayerIndexActions(index);
      } else if (this.repeatType === STOP) {
        if (flag) {
          this.repeatType = NORAML;
          this.setPlayerIndexActions(0);
        }
      }
      if (!flag) {
        this.changeSong();
      }
    },
    toggleShow() {
      this.playqueueShow = !this.playqueueShow;
    }
  },
  watch: {
    volume() {
      this.$refs.nativeRange.style.backgroundSize = `${this.volume}% 100%`;
      this.$refs.player.volume = parseInt(this.volume) / 100;
      this.searchTimer();
    },
    footerPlayer() {
      localStorage.setItem("player", JSON.stringify(this.footerPlayer));
      this.changeSong();
    },
    playerIndex() {
      localStorage.setItem("index", this.playerIndex);
      this.changeSong();
    },
    shuffleType() {
      let id = this.player.id;
      if (this.shuffleType) {
        let footerPlayerCopy = [...this.footerPlayer];
        footerPlayerCopy.sort(function() {
          return Math.random() - 0.5;
        });
        this.footerPlayerCopy = footerPlayerCopy;
        footerPlayerCopy.forEach((item, index) => {
          if (item.id === id) {
            this.setPlayerIndexActions(index);
          }
        });
      } else {
        this.footerPlayer.forEach((item, index) => {
          if (item.id === id) {
            this.setPlayerIndexActions(index);
          }
        });
      }
    }
  },
  mounted() {
    // this.$refs.player.autoplay = true;
    // this.$refs.player.defaultMuted = false;
    this.fillingWidth = this.$refs.filling.offsetWidth;
    this.setFooterPlayerActions(JSON.parse(localStorage.getItem("player")));

    this.setPlayerIndexActions(parseInt(localStorage.getItem("index")));
    this.setPlayerIdActions(localStorage.getItem("id"));
    setTimeout(() => {
      this.changeSong();
    }, 300);

    let val = parseInt(localStorage.getItem("volume"));
    if (!val) {
      this.volume = 0;
    } else {
      this.volume = val;
    }
    this.$refs.player.volume = parseInt(this.volume) / 100;

    instance.get("/login/status").then(res => {
      // console.log(res.data.profile.userId);
    });
  }
};
</script>

<style lang="scss">
@import "~style/iconfont.css";
@import "~style/mixin.scss";

#app {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  font-size: 1rem;
  font-weight: 400;
  font-stretch: normal;
  line-height: 1.7143;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  .container {
    display: flex;
    max-height: calc(100vh - 98px);
    .content-area {
      display: flex;
      flex: 1;
      max-width: calc(100vw - 250px);
      .content-area-scorll {
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100%;

        width: 100%;
      }
    }
  }
  .footer-player {
    height: 98px;
    z-index: 10;
    background-color: #222;
    .top-row {
      .progress-bar-wrapper {
        width: 100%;
        height: 2px;
        color: #0ff;
        position: relative;
        outline: none;
        .filling-block {
          display: block;
          position: relative;

          height: 100%;
          background-color: #4d4d4d;
          width: 100%;
          // contain: strict;
          // overflow: hidden;
          .knob {
            // opacity: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            position: absolute;
            z-index: 10;
            transition: opacity 0.15s ease;
            box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
            pointer-events: none;
            transform: translateY(-5px);
            &:hover {
              cursor: pointer;
            }
          }
          .indicator {
            display: block;
            height: 100%;
            width: 100%;
            background-color: #0ff;
            position: relative;
            will-change: transform;
            transform: translateX(-100%);
          }
        }
        .interaction-layer {
          height: 30px;
          cursor: pointer;
          transform: translateY(-60%);
        }
      }
    }
    .bottom-row {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      box-sizing: border-box;
      height: 96px;
      .left-column,
      .center-column,
      .right-column {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        box-sizing: border-box;
        width: 33%;
        flex: 3 1;
        min-width: 200px;
        white-space: nowrap;
      }
      .left-column {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .media-img {
          flex: 64px 0 0;
          width: 64px;
          height: 64px;
          margin: 14px 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .media-info {
          display: flex;
          flex-direction: column;
          max-width: calc(100% - 124px);
          .media-info-title {
            @include ellipsis;
          }
          .media-info-artist {
            a {
              color: rgba(229, 238, 255, 0.6);
            }
            @include ellipsis;
          }
        }
        .media-controls {
          margin-left: 14px;
          .iconfont {
            font-size: 24px;
            color: rgba(229, 238, 255, 0.6);
            &:first-of-type {
              margin-right: 7px;
            }
          }
        }
      }
      .center-column {
        justify-content: center;
        .play-controls {
          display: flex;
          align-items: center;
          .iconfont {
            font-size: 24px;
            margin: 0 14px;
          }
          .icon-play {
            font-size: 40px;
          }
          .icon-shuffle,
          .icon-repeat {
            color: rgba(229, 238, 255, 0.6);
            &.active {
              color: #0ff;
            }
          }
          .icon-repeat-one {
            color: #0ff;
          }
        }
      }
      .right-column {
        justify-content: flex-end;
        .duration {
          time {
            font-size: 14px;
            color: hsla(0, 0%, 100%, 0.5);
          }
          .currentTime {
            color: #4c4e54;
            &.center {
              padding: 0 1.4px;
            }
          }
        }
        .volume-slider {
          margin-left: 22px;
          display: flex;
          align-items: center;
          .iconfont {
            margin-right: 12px;
            font-size: 24px;
          }

          .native-range {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
            width: 100%;
            min-width: 75px;
            height: 3px;
            background: transparent;
            font: 1em/1 arial, sans-serif;
            cursor: pointer;
            outline: none;
            // contain: strict;
            background: -webkit-linear-gradient(#fff, #fff) no-repeat;
            background-size: 0% 100%;
          }

          .native-range:focus {
            outline: none;
          }

          .native-range::-webkit-slider-runnable-track {
            box-sizing: border-box;
            border: none;
            width: 100%;
            height: 4px;
            border-radius: 4px;
            outline: none;
          }

          .native-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            box-sizing: border-box;
            border: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
            box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.4);
            margin-top: -4px;
          }

          .native-range[value="0"]::-webkit-slider-runnable-track {
            background: rgba(246, 245, 255, 0.1);
          }

          .disabled.native-range::-webkit-slider-thumb {
            background: none;
          }

          .disabled.native-range::-webkit-slider-runnable-track {
            background: rgba(246, 245, 255, 0.1);
          }
        }
        .play-queue {
          padding: 16px;
          &:hover {
            .iconfont {
              color: #fff;
              cursor: pointer;
            }
          }
          .iconfont {
            color: rgba(229, 238, 255, 0.6);
            font-size: 24px;
          }
        }
      }
    }
  }
  .play-queue-side-bar {
    width: 388px;
    position: fixed;
    right: 44px;
    top: 60px;
    transform: translateX(416px);
    transition: transform 0.6s ease;
    display: flex;
    align-items: stretch;
    height: calc(100vh - 166px);
    z-index: 70;
    border-radius: 8px;
    background-color: #242528;
    box-shadow: 1px 12px 20px 0 rgba(0, 0, 0, 0.3);
    padding: 24px 0 0;
    flex-direction: column;
    &.show {
      transform: translateX(0);
    }
    .play-queue-header {
      display: flex;
      align-items: baseline;
      margin: 0 16px 20px;
      flex-shrink: 0;
      .playqueue-title {
        font-size: 14px;
        flex-grow: 1;
        margin: 0;
      }
      .playqueue-button {
        font-size: 14px;
        padding: 0 5px;
        margin-left: 5px;
        color: hsla(0, 0%, 100%, 0.5);
      }
    }
    .playqueue-content {
      overflow-y: auto;
      overflow-x: hidden;
      flex-grow: 1;
      .playqueue-item {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 2px 16px;
        border-left: 2px solid transparent;
        border-bottom: 1px solid transparent;
        border-top: 1px solid transparent;
        padding-bottom: 6px;
        padding-top: 6px;
        margin-bottom: -1px;
        img {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          box-shadow: 1px 4px 7px 0 rgba(0, 0, 0, 0.3);
        }
        .playqueue-group {
          overflow: hidden;
          margin-left: 16px;
          line-height: 1.43;
          flex-grow: 1;

          .playqueue-group-title {
            font-size: 14px;
            @include ellipsis;
            &.active {
              color: #0ff;
            }
          }
          .playqueue-group-sub-title {
            font-size: 14px;
            @include ellipsis;
            a,
            span {
              color: hsla(0, 0%, 100%, 0.5);
            }
          }
        }
      }
    }
  }
}
</style>
