<template>
  <div class="search">
    <v-header></v-header>
    <div class="media-container">
      <div class="media-header">
        <div class="media-header-title">Top Tracks</div>
        <a href="#" class="view-all" @click="goToTracks()">View all</a>
      </div>
      <trackList :shortFlag="shortFlag" :viewFull="viewFull"></trackList>
    </div>
    <div class="play-list-wrapper">
      <play-list :items="albums" @view-all="viewAll(1)" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="playLists" @view-all="viewAll(2)" />
    </div>
    <artists-list :artistsList="artistsList" />
  </div>
</template>

<script>
import VHeader from "components/VHeader.vue";
import PlayList from "./PlayList.vue";
import ArtistsList from "./ArtistsList.vue";
import axios from "axios";
import TrackList from "./TrackList.vue";
import { mapActions, mapState } from "vuex";

let instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  withCredentials: true
});
export default {
  data() {
    return {
      artistsList: {},
      shortFlag: true,
      viewFull: true,
      result: "",
      songs: [],
      playLists: {},
      artists: {},
      albums: {},
      albums2: [],
      playLists2: []
    };
  },

  components: {
    TrackList,
    ArtistsList,
    PlayList,
    VHeader
  },

  methods: {
    ...mapActions(["setCategoryListActions"]),
    ...mapActions(["setFocusFlagActions"]),

    initSearch() {
      this.result = this.$route.query.q;
      this.searchAlbums();
      this.searchPlayLists();
      this.searchArtists();
    },
    viewAll(type) {
      if (type === 1) {
        this.setFocusFlagActions(false);

        this.$router
          .push({ path: "/search/albums", query: { q: this.result } })
          .catch(err => {});
        console.log(this.albums2);

        this.setCategoryListActions({
          type: "album",
          playLists: this.albums2
        });
      } else if (type === 2) {
        this.setFocusFlagActions(false);

        this.$router
          .push({ path: "/search/play-list", query: { q: this.result } })
          .catch(err => {});
        this.setCategoryListActions({
          type: "play-list",
          playLists: this.playLists2
        });
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

            let playLists = [],
              playLists2 = [];
            res.data.result.albums.forEach(function(item) {
              let {
                name: title,
                id,
                picUrl,
                artist,
                artist: { name, id: subId }
              } = item;
              playLists.push({
                title,
                id,
                src: picUrl,
                artist
              });
              playLists2.push({
                title,
                id,
                src: picUrl,
                desc: name,
                subId
              });
            });
            this.albums2 = playLists2;
            this.albums = {
              title: "Albums",
              data: playLists
            };
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

            let playLists = [],
              playLists2 = [];
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
                src: coverImgUrl
                // artists:
              });
              playLists2.push({
                title,
                id,
                src: coverImgUrl,
                desc: nickname
              });
            });
            this.playLists2 = playLists2;
            this.playLists = {
              title: "PlayLists",
              data: playLists
            };
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

            let playLists = [];
            res.data.result.artists.forEach(function(item) {
              let { name, id, picUrl } = item;
              playLists.push({
                name,
                id,
                src: picUrl
              });
            });
            this.artistsList = {
              title: "Artists",
              data: playLists
            };
          });
      }
    }
  },
  mounted() {
    this.initSearch();
  }
};
</script>


<style lang="scss" scoped>
.media-container {
  margin: 80px 28px 0;
  margin-bottom: 48px;
  min-height: 120px;
  z-index: 1;
  .media-header {
    display: flex;
    align-items: baseline;
    .media-header-title {
      flex-grow: 1;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.75;
      margin: 0 0 16px;
    }
    .view-all {
      flex-shrink: 0;
      color: rgba(229, 238, 255, 0.6);
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>