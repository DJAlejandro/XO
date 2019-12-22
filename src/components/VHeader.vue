<template>
  <div class="content-header">
    <div class="header-container">
      <div class="header-goto">
        <span class="icon-back iconfont"></span>
        <span class="icon-forward iconfont"></span>
      </div>
      <div class="header-content">{{tag}}</div>
      <div class="header-search">
        <span class="icon-search iconfont"></span>
        <input type="search" placeholder="Search" v-model="result" @keyup="search" />
        <div class="search-box">
          <section>
            <div class="search-box-header">
              <span class="search-box-title">Tracks</span>
              <span class="search-box-all">Show All</span>
            </div>
            <div class="search-box-content" v-if="Object.keys(searchList).length!==0 ">
              <div class="search-box-item" v-for="song in searchList.song.songs">
                <div class="image">
                  <img :src="song.al.picUrl+'?param=50y50'" alt />
                </div>
                <div class="search-box-title-group">
                  <div class="title">{{song.name}}</div>
                  <div class="sub-title">
                    Track By
                    <span v-for="artist in song.ar">{{artist.name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

let instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  withCredentials: true
});
export default {
  props: ["tag"],
  data() {
    return {
      result: "",
      searchList: {}
    };
  },
  methods: {
    search() {
      instance
        .get("/search", {
          params: {
            keywords: this.result,
            type: 1018
          }
        })
        .then(res => {
          //获取歌手单曲

          console.log(res);
          this.searchList = res.data.result;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~style/index.scss";
@import "~style/mixin.scss";
.content-header {
  position: fixed;
  left: 248px;
  right: 20px;
  top: 0;
  padding: 18px 24px 0;
  background-color: #000;
  height: 72px;
  z-index: 2;
  .header-container {
    display: flex;
    align-items: center;
    color: #fff;
    .header-goto {
      span {
        font-size: 24px;
      }
      span:first-child {
        margin-right: 8px;
      }
      span:last-child {
        opacity: 0.5;
      }
    }
    .header-content {
      font-size: 16px;
      padding: 0 4px;
      margin-left: 16px;
    }
    .header-search {
      border-radius: 8px;
      background-color: rgba(229, 238, 255, 0.2);
      display: flex;
      align-items: center;
      padding: 0 7px;
      transition: background-color 0.2s ease-out;
      cursor: text;
      width: 100%;
      max-width: 388px;
      margin-left: auto;
      .icon-search {
        width: 24px;
        line-height: 24px;
        font-size: 24px;
      }
      input {
        font-size: 14px;
        height: 36px;
        margin: 0 8px;
        background: transparent;
        border: 0;
        flex-grow: 1;
        color: #fff;
        padding: 0;
      }
      .search-box {
        width: 388px;
        position: fixed;
        right: 44px;
        top: 61px;
        display: flex;
        flex-flow: column nowrap;
        pointer-events: none;
        // opacity: 0;
        align-items: stretch;
        // max-height: 0;
        z-index: 70;
        box-sizing: border-box;
        transform-origin: 50% 0;
        transition: all 0.2s ease;
        border-radius: 8px;
        overflow: hidden;
        overflow-y: auto;
        box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.3);
        background-color: #242528;
        padding: 24px 0;
        max-height: calc(100vh - 165px);
        pointer-events: auto;
        opacity: 1;
        transform: none;

        section:not(first-child) {
          margin-top: 32px;
          .search-box-header {
            display: flex;
            margin-bottom: 20px;
            font-size: 14px;

            line-height: 1.71;
            padding: 0 16px;
            .search-box-title {
              margin: 0;
              text-transform: capitalize;
              flex-grow: 1;
            }
            .search-box-all {
              color: rgba(229, 238, 255, 0.6);
            }
          }
          .search-box-content {
            .search-box-item {
              display: flex;
              cursor: pointer;
              padding: 2px 16px;
              margin-bottom: 18px;
              cursor: pointer;
              padding: 2px 16px;
              .image {
                flex: 0 0 42px;
                width: 42px;
                height: 42px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .search-box-title-group {
                display: flex;
                margin: 0 16px;
                flex-grow: 1;
                line-height: 1.43;
                overflow: hidden;
                flex-direction: column;
                font-size: 14px;
                .sub-title {
                  color: rgba(229, 238, 255, 0.6);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>