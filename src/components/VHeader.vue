<template>
  <div class="content-header">
    <div class="header-container">
      <div class="header-goto">
        <span class="icon-back iconfont" @click="back($event)" v-preventReClick></span>
        <span class="icon-forward iconfont" @click="forward($event)" v-preventReClick></span>
      </div>
      <div class="header-content">{{tag}}</div>
      <div class="header-search" @click.stop :class="{focus:focusOnly}">
        <span class="icon-search iconfont"></span>
        <input
          type="search"
          :placeholder="routerHistoryLength"
          class="search-input"
          v-model="result"
          @input="searchTimer"
          @focus="searchFocus"
          @keyup.enter="goToSearch"
        />
        <span class="icon-remove iconfont" @click="clearSearch"></span>
        <div class="search-box" v-if=" focusFlag ">
          <div v-if="resLength>1">
            <section v-if="searchList!=null">
              <div class="search-box-header">
                <span class="search-box-title">Tracks</span>
                <span class="search-box-all" @click="goToTracks($event)" v-preventReClick>
                  <a>Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="song in searchList.songs">
                  <div class="image">
                    <img :src="song.al.picUrl+'?param=50y50'" alt />
                  </div>
                  <div class="search-box-title-group">
                    <div class="title">{{song.name}}</div>
                    <div class="sub-title">
                      Track By
                      <span
                        v-for="(artist,index) in song.ar"
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
            </section>

            <section v-if="searchList!=null">
              <div class="search-box-header">
                <span class="search-box-title">Artists</span>
                <span class="search-box-all">
                  <a @click="searchArtists">Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="artist in searchList.artists">
                  <div class="image artist">
                    <img :src="artist.picUrl+'?param=50y50'" v-if="artist.picUrl" />
                    <div v-else>{{artist.name | subName}}</div>
                  </div>
                  <div class="search-box-title-group">
                    <div
                      class="title"
                      @click.stop="goToArtist($event,artist.id,true)"
                      v-preventReClick
                    >
                      <a>{{artist.name}}</a>
                    </div>
                    <div class="sub-title">Artist</div>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="searchList!=null">
              <div class="search-box-header">
                <span class="search-box-title">Albums</span>
                <span class="search-box-all">
                  <a @click="viewAll($event,ALBUM,true)" v-preventReClick>Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="album in searchList.albums">
                  <div class="image">
                    <img :src="album.picUrl+'?param=50y50'" alt />
                  </div>
                  <div class="search-box-title-group">
                    <div
                      class="title"
                      @click.stop="goToAlbum($event,album.id,true)"
                      v-preventReClick
                    >
                      <a>{{album.name}}</a>
                    </div>
                    <div class="sub-title">
                      Album By
                      <span
                        v-for="(artist,index) in album.artists"
                        @click.stop="goToArtist($event,artist.id,true)"
                        v-preventReClick
                      >
                        <span v-if="index!==0">,</span>
                        <a>{{artist.name}}</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="searchList!=null">
              <div class="search-box-header">
                <span class="search-box-title">PlayLists</span>
                <span class="search-box-all">
                  <a @click="viewAll($event,PLAYLIST,true)" v-preventReClick>Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="playList in searchList.playLists">
                  <div class="image">
                    <img
                      :src="playList.coverImgUrl+'?param=50y50'"
                      @click="goToPlayList($event,playList.id,true)"
                      v-preventReClick
                    />
                  </div>
                  <div class="search-box-title-group">
                    <div class="title">
                      <a
                        @click="goToPlayList($event,playList.id,true)"
                        v-preventReClick
                      >{{playList.name}}</a>
                    </div>
                    <div class="sub-title">
                      PlayList By
                      {{playList.creator.nickname}}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div v-else class="no-result">
            <p class="result-iconfont">
              <span class="icon-search iconfont"></span>
            </p>
            <p class="result-one">No Results Found</p>
            <p class="result-two">Please try again</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "mixins/index.js";
import { instance, ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";
export default {
  mixins: [mixins],
  props: ["tag"],
  data() {
    return {
      result: "",
      focusOnly: false,
      albums2: [],
      playLists2: [],
      ALBUM,
      PLAYLIST,
      ARTIST
    };
  },
  methods: {
    back() {
      this.setIsBackActions(true);
      this.$router.go(-1);
    },
    forward() {
      this.setIsBackActions(false);
      this.$router.go(1);
    },

    searchTimer($event) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.search();
      }, 100);
    },
    search() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 1018
            }
          })
          .then(res => {
            //获取歌手单曲

            let resLength = res.data.result.order.length;
            this.setResLengthActions(resLength);
            this.setFocusFlagActions(true);
            if (resLength > 1) {
              let {
                song: { songs: songs = [] } = {},
                playList: { playLists: playLists = [] } = {},
                artist: { artists: artists = [] } = {},
                album: { albums: albums = [] } = {}
              } = res.data.result;

              songs = songs.slice(0, 3);
              playLists = playLists.slice(0, 3);
              artists = artists.slice(0, 3);
              albums = albums.slice(0, 3);
              this.setSearchListActions({
                songs,
                playLists,
                artists,
                albums
              });
            } else {
              // this.setFocusFlagActions(false);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.setFocusFlagActions(false);
      }
    },
    searchFocus() {
      this.focusOnly = true;
      if (this.result) {
        this.setFocusFlagActions(true);
      } else {
        this.setFocusFlagActions(false);
      }
    },

    clearSearch() {
      setTimeout(() => {
        this.result = "";
        this.setFocusFlagActions(false);
      }, 30);
    },
    goToSearch() {
      this.$router
        .push({ path: "/search", query: { q: this.result } })
        .catch(err => {
          console.log(err);
        });
      this.setFocusFlagActions(false);
    }
  },
  watch: {
    result() {
      this.setSearchResultActions(this.result);
    }
  },
  mounted() {
    this.result = this.searchResult;
  }
};
</script>

<style lang="scss" scoped>
@import "~style/index.scss";
@import "~style/mixin.scss";
.content-header {
  position: fixed;
  left: 240px;
  right: 20px;
  top: 0;
  padding: 18px 24px 0;
  background-color: #000;
  height: 72px;
  z-index: 3;
  .header-container {
    display: flex;
    align-items: center;
    color: #fff;
    .header-goto {
      span {
        font-size: 24px;
        cursor: pointer;
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
      &.focus {
        color: #000;
        background-color: #fff;
        .search-input {
          outline: none;
          color: #000;
        }
      }
      .icon-search {
        width: 24px;
        line-height: 24px;
        font-size: 24px;
      }
      .search-input {
        font-size: 14px;
        height: 36px;
        margin: 0 8px;
        background: transparent;
        border: 0;
        flex-grow: 1;
        color: #fff;
        padding: 0;
        -webkit-appearance: textfield;
      }
      .icon-remove {
        width: 24px;
        height: 24px;
        font-size: 20px;
        line-height: 24px;
        cursor: pointer;
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

        .no-result {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          p {
            margin: 0;
          }
          .result-iconfont {
            width: 96px;
            height: 96px;
            .iconfont {
              font-size: 96px;
              line-height: 96px;

              color: rgba(229, 238, 255, 0.6);
            }
          }
          .result-one {
            font-size: 15px;
            line-height: 24px;
            color: #fff;
            font-weight: 500;
          }
          .result-two {
            font-size: 14px;
            line-height: 21px;
            color: #fff;
            font-weight: 500;
          }
        }

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
              color: #fff;
            }
            .search-box-all {
              a {
                color: rgba(229, 238, 255, 0.6);
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
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
                display: flex;
                flex: 0 0 42px;
                width: 42px;
                height: 42px;
                align-items: center;
                justify-content: center;
                background-color: #4c4e54;
                color: #a7aeba;
                font-size: 16px;
                font-weight: 700;
                &.artist {
                  border-radius: 100%;
                  img {
                    border-radius: 100%;
                  }
                }
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
                color: #fff;
                .title a {
                  color: #fff;
                }
                .sub-title {
                  color: rgba(229, 238, 255, 0.6);
                  a {
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
}
</style>