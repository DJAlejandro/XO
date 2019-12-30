<template>
  <div class="content-header">
    <div class="header-container">
      <div class="header-goto">
        <span class="icon-back iconfont"></span>
        <span class="icon-forward iconfont"></span>
      </div>
      <div class="header-content">{{tag}}</div>
      <div class="header-search" @click.stop :class="{focus:focusOnly}">
        <span class="icon-search iconfont"></span>
        <input
          type="search"
          placeholder="Search"
          class="search-input"
          v-model="result"
          @keyup="searchTimer"
          @focus="searchFocus"
        />
        <span class="icon-remove iconfont" @click="clearSearch"></span>
        <div class="search-box" v-if=" focusFlag ">
          <div v-if="resLength>1">
            <section v-if="searchList!=null">
              <div class="search-box-header">
                <span class="search-box-title">Tracks</span>
                <span class="search-box-all" @click="goToTracks()">
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
                        @click.stop="goToArtist(artist.id)"
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
                    <div class="title" @click.stop="goToArtist(artist.id)">
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
                  <a @click="searchAlbums">Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="album in searchList.albums">
                  <div class="image">
                    <img :src="album.picUrl+'?param=50y50'" alt />
                  </div>
                  <div class="search-box-title-group">
                    <div class="title" @click.stop="goToAlbum(album.id)">
                      <a>{{album.name}}</a>
                    </div>
                    <div class="sub-title">
                      Album By
                      <span
                        v-for="(artist,index) in album.artists"
                        @click.stop="goToArtist(artist.id)"
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
                  <a @click="searchPlayLists">Show All</a>
                </span>
              </div>
              <div class="search-box-content">
                <div class="search-box-item" v-for="playList in searchList.playLists">
                  <div class="image">
                    <img :src="playList.coverImgUrl+'?param=50y50'" alt />
                  </div>
                  <div class="search-box-title-group">
                    <div class="title">
                      <a>{{playList.name}}</a>
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
import axios from "axios";
import { mapActions, mapState } from "vuex";

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
      focusOnly: false
    };
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      searchList: "searchList",
      searchResult: "searchResult",
      focusFlag: "focusFlag",
      resLength: "resLength"
    })
  },
  filters: {
    subName: function(value) {
      if (!value) return "";
      let value2 = value.split(" ")[1];
      if (!value2) return value.charAt(0).toUpperCase();

      return value.charAt(0).toUpperCase() + value2.charAt(0).toUpperCase();
    }
  },
  methods: {
    ...mapActions(["setViewFullActions"]),
    ...mapActions(["setTrackListActions"]),
    ...mapActions(["setSearchListActions"]),
    ...mapActions(["setSearchResultActions"]),
    ...mapActions(["setFocusFlagActions"]),
    ...mapActions(["setCategoryListActions"]),
    ...mapActions(["setResLengthActions"]),

    goToTracks() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 1,
              limit: 100
            }
          })
          .then(res => {
            //获取歌手单曲
            let tracks = [];
            res.data.result.songs.forEach(item => {
              let { duration, name, id, artists, album } = item;
              tracks.push({
                time: duration,
                name,
                artists,
                album: album,
                id
              });
            });
            this.setTrackListActions(tracks);
            this.setViewFullActions(false);
            this.setFocusFlagActions(false);

            this.$router
              .push({ path: "/search/tracks", query: { q: this.result } })
              .catch(err => {});
          });
      }
    },
    searchTimer() {
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
    searchAlbums() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 10,
              limit: 100
            }
          })
          .then(res => {
            //获取歌手单曲
            this.$router
              .push({ path: "/search/albums", query: { q: this.result } })
              .catch(err => {});
            let playLists = [];
            res.data.result.albums.forEach(function(item) {
              let {
                name: title,
                id,
                picUrl,
                artist: { name, id: subId }
              } = item;
              playLists.push({
                title,
                id,
                src: picUrl,
                desc: name,
                subId
              });
            });
            this.setCategoryListActions({
              type: "album",
              playLists
            });
          });
      }
    },
    searchPlayLists() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 1000,
              limit: 100
            }
          })
          .then(res => {
            //获取歌手单曲

            this.$router
              .push({ path: "/search/play-list", query: { q: this.result } })
              .catch(err => {});
            let playLists = [];
            res.data.result.playlists.forEach(function(item) {
              let {
                name: title,
                id,
                coverImgUrl,
                creator: { nickname }
              } = item;
              playLists.push({
                title,
                id,
                src: coverImgUrl,
                desc: nickname
              });
            });
            this.setCategoryListActions({
              type: "play-list",
              playLists
            });
          });
      }
    },
    searchArtists() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 100,
              limit: 100
            }
          })
          .then(res => {
            //获取歌手单曲
            this.$router
              .push({ path: "/search/artist", query: { q: this.result } })
              .catch(err => {});
            let playLists = [];
            res.data.result.artists.forEach(function(item) {
              let { name: title, id, picUrl } = item;
              playLists.push({
                title,
                id,
                src: picUrl
              });
            });
            this.setCategoryListActions({
              type: "artist",
              playLists
            });
          });
      }
    },
    goToAlbum(id) {
      this.setFocusFlagActions(false);
      this.$router.push({ path: "/album", query: { id } });
    },
    goToArtist(id) {
      this.setFocusFlagActions(false);
      this.$router.push({ path: "/artist", query: { id } }).catch(err => {
        console.log(err);
      });
    },
    clearSearch() {
      setTimeout(() => {
        this.result = "";
        this.setFocusFlagActions(false);
      }, 30);
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