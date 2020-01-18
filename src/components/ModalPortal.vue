<template>
  <div class="modal-portal" @click="closeBtn">
    <div class="modal-portal-overlay">
      <div class="modal-portal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-header-left">
            <img
              :src="modalData.imgSrc+'?param=100y100'"
              :class="{round:modalData.type===ARTIST}"
              v-if="modalData.type"
            />
            <div class="modal-header-title">
              <div>{{modalData.title}}</div>
              <div class="subtitle" v-if="modalData.type==PLAYLIST">
                Created by
                <span>{{modalData.nickname}}</span>
              </div>
              <div class="subtitle" v-if="modalData.type==ALBUM">
                by
                <span v-for="(artist,index) in modalData.artists">
                  <span v-if="index!==0" class="artist-name">,&nbsp;</span>
                  <a class="artist-name">{{artist.name}}</a>
                </span>
              </div>
              <div class="subtitle" v-if="modalData.type==ARTIST">Biography</div>
            </div>
          </div>
          <div class="close-btn">
            <span class="iconfont icon-remove" @click="closeBtn"></span>
          </div>
        </div>
        <div class="modal-body">
          <div class="modal-body-desc">
            <p v-for="(desc,index) in modalData.description">{{desc}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";

export default {
  props: {
    modalData: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      ALBUM,
      PLAYLIST,
      ARTIST
    };
  },
  methods: {
    closeBtn() {
      this.$emit("close-modal");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/index.scss";
@import "~style/mixin.scss";
.modal-portal {
  .modal-portal-overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.8);
    .modal-portal-content {
      position: absolute;
      top: 50%;
      left: 0px;
      right: 0px;
      bottom: auto;
      background: 0% 0% / cover rgb(36, 37, 40);
      overflow: auto;
      border-radius: 8px;
      outline: none;
      padding: 0px;
      display: flex;
      flex-direction: column;
      transform: translateY(-50%);
      width: 650px;
      max-width: 100%;
      min-height: 100px;
      max-height: calc(100% - 180px);
      box-sizing: border-box;
      margin: auto;
      box-shadow: rgba(0, 0, 0, 0.3) 1px 12px 20px 0px;
      .modal-header {
        align-items: flex-start;
        box-sizing: border-box;
        display: flex;
        flex: 1 0 auto;
        flex-flow: row wrap;
        justify-content: space-between;
        min-height: 48px;
        padding: 24px 24px 0;
        .modal-header-left {
          display: flex;
          flex-direction: row;
          flex: 1 1;
          min-width: 0;
          img {
            min-height: auto;
            width: 80px;
            height: 80px;
            &.round {
              border-radius: 50%;
            }
          }
        }
        .close-btn {
          cursor: pointer;
          .iconfont {
            width: 24px;
            height: 24px;
            line-height: 24px;
            margin-right: 16px;
            font-size: 24px;
            color: $vgray;
          }
        }

        .modal-header-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 24px;
          div {
            text-align: left;
          }
          .subtitle {
            color: rgba(229, 238, 255, 0.6);
            margin-top: 5px;
            font-size: 16px;
            line-height: 24px;
            .artist-name {
              color: #fff;
            }
            a:hover {
              color: #0ff;
              text-decoration: underline;
            }
          }
        }
      }
      .modal-body {
        color: rgba(229, 238, 255, 0.6);
        border-top: 24px solid #242528;
        max-height: 100%;
        overflow: hidden;
        overflow-y: auto;
        outline: 0;
        padding: 0 24px 14px;
        .modal-body-desc {
          p {
            text-indent: 2em;
            margin: 0 0 12px;
            color: #fff;
            font-size: 14px;
            line-height: 26px;
            font-weight: 500;
            font-stretch: normal;
            -webkit-font-smoothing: antialiased;
          }
        }
      }
    }
  }
}
</style>