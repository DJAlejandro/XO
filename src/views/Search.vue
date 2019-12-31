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
      <play-list :items="albums" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="playLists" />
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
      albums: {}
    };
  },
  components: {
    TrackList,
    ArtistsList,
    PlayList,
    VHeader
  },

  methods: {
    initSearch() {
      this.result = this.$route.query.q;
      this.searchAlbums();
      this.searchPlayLists();
      this.searchArtists();
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

            let playLists = [];
            res.data.result.albums.forEach(function(item) {
              let { name: title, id, picUrl, artist } = item;
              playLists.push({
                title,
                id,
                src: picUrl,
                artist
              });
            });

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

            let playLists = [];
            res.data.result.playlists.forEach(function(item) {
              let {
                name: title,
                id,
                coverImgUrl
                // creator
              } = item;
              playLists.push({
                title,
                id,
                src: coverImgUrl
                // artists:
              });
            });
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
            console.log(res);

            let playLists = [];
            res.data.result.artists.forEach(function(item) {
              let { name, id, picUrl } = item;
              playLists.push({
                name,
                id,
                src: picUrl
              });
            });
            console.log(playLists);

            this.artistsList = {
              title: "Related Artists",
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
  margin: 0 28px;
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