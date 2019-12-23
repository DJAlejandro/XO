<template>
  <div class="content-header">
    <div class="header-container">
      <div class="header-goto">
        <span class="icon-back iconfont"></span>
        <span class="icon-forward iconfont"></span>
      </div>
      <div class="header-content">{{tag}}</div>
      <div class="header-search" @click.stop>
        <span class="icon-search iconfont"></span>
        <input
          type="search"
          placeholder="Search"
          v-model="result"
          @keyup="search"
          @click="openSearch"
        />
        <div class="search-box" v-show="Object.keys(searchList).length!==0 ">
          <section>
            <div class="search-box-header">
              <span class="search-box-title">Tracks</span>
              <span class="search-box-all" @click="goToTracks()">Show All</span>
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
                    <span v-for="(artist,index) in song.ar">
                      <span v-if="index!==0">,</span>
                      {{artist.name}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div class="search-box-header">
              <span class="search-box-title">Artists</span>
              <span class="search-box-all">Show All</span>
            </div>
            <div class="search-box-content" v-if="Object.keys(searchList).length!==0 ">
              <div class="search-box-item" v-for="artist in searchList.artists">
                <div class="image artist">
                  <img :src="artist.picUrl+'?param=50y50'" v-if="artist.picUrl" />
                  <div v-else>{{artist.name | subName}}</div>
                </div>
                <div class="search-box-title-group">
                  <div class="title">{{artist.name}}</div>
                  <div class="sub-title">Artist</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div class="search-box-header">
              <span class="search-box-title">Albums</span>
              <span class="search-box-all">Show All</span>
            </div>
            <div class="search-box-content" v-if="Object.keys(searchList).length!==0 ">
              <div class="search-box-item" v-for="album in searchList.albums">
                <div class="image">
                  <img :src="album.picUrl+'?param=50y50'" alt />
                </div>
                <div class="search-box-title-group">
                  <div class="title">{{album.name}}</div>
                  <div class="sub-title">
                    Album By
                    <span v-for="(artist,index) in album.artists">
                      <span v-if="index!==0">,</span>
                      {{artist.name}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div class="search-box-header">
              <span class="search-box-title">PlayLists</span>
              <span class="search-box-all">Show All</span>
            </div>
            <div class="search-box-content" v-if="Object.keys(searchList).length!==0 ">
              <div class="search-box-item" v-for="playList in searchList.playLists">
                <div class="image">
                  <img :src="playList.coverImgUrl+'?param=50y50'" alt />
                </div>
                <div class="search-box-title-group">
                  <div class="title">{{playList.name}}</div>
                  <div class="sub-title">
                    PlayList By
                    {{playList.creator.nickname}}
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
      result: ""
      // searchList: {}
    };
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      searchList: "searchList"
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

    openSearch() {
      console.log(this.searchList);
      if (Object.keys(this.searchList).length !== 0) {
        console.log(2);

        // document.querySelector(".search-box").style.display = "flex";
      }
    },
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

            // this.searchList = res.data.result.songs;
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
          });
      }
      let id = this.$route.query.id;
      this.$router
        .push({ path: "/search/tracks", query: { q: this.result } })
        .catch(err => {});
      document.querySelector(".search-box").style.display = "none";
    },
    search() {
      if (this.result) {
        instance
          .get("/search", {
            params: {
              keywords: this.result,
              type: 1018,
              limit: 10
            }
          })
          .then(res => {
            //获取歌手单曲

            // console.log(res);
            // this.searchList = res.data.result;
            let {
              song: { songs },
              playList: { playLists },
              artist: { artists },
              album: { albums }
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
          });
      }
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