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
      <play-list :items="albums" @view-all="viewAll(1,false)" @go-to="goTo($event,id,1)" />
    </div>
    <div class="play-list-wrapper">
      <play-list :items="playLists" @view-all="viewAll(2,false)" @go-to="goTo($event,id,2)" />
    </div>
    <artists-list :artistsList="artistsList" :listFlag="listFlag" />
  </div>
</template>

<script>
import VHeader from "components/VHeader.vue";
import PlayList from "./PlayList.vue";
import ArtistsList from "./ArtistsList.vue";
import TrackList from "./TrackList.vue";
import mixins from "mixins/index.js";
import { instance } from "mixins/index.js";
export default {
  mixins: [mixins],
  data() {
    return {
      artistsList: {},
      shortFlag: true,
      listFlag: true,
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
    initSearch() {
      this.result = this.$route.query.q;
      this.searchAlbums();
      this.searchPlayLists();
      this.searchArtists();
      this.searchSongs();
    },
    goTo(id, $event, type) {
      switch (type) {
        case 1:
          this.goToAlbum(id, false);
          break;
        case 2:
          this.goToPlayList(id, false);
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.initSearch();
    this.$emit("scroll-top");
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      this.$emit("scroll-top");
    }
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