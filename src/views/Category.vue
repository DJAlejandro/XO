<template>
  <div class="category-container">
    <v-header />

    <div class="category-paginate" v-if="categoryList.playLists">
      <paginate name="languages" :list="categoryList.playLists" :per="20">
        <li
          class="category-paginate-item"
          :class="{artist:isArtist}"
          v-for="playlist in paginated('languages')"
        >
          <div class="img-wrapper">
            <img
              :src="playlist.src+'?param=360y360'"
              v-if="playlist.src"
              @click="goToTitle(playlist.id)"
            />
            <div
              v-else
              class="sub-name"
              @click="goToTitle(playlist.id)"
            >{{playlist.title | subName}}</div>
          </div>
          <div class="category-item-content">
            <span class="category-item-content-text" @click="goToTitle(playlist.id)">
              <a>{{playlist.title}}</a>
            </span>
            <span
              class="category-item-content-text"
              v-if="type!==3"
              @click="goToDesc(playlist.subId)"
            >
              <span class="category-last" v-if="type===2">Created By &nbsp;</span>
              <a class="category-last" v-if="type!==1">{{playlist.desc}}</a>
              <span v-if="type===1">
                <span
                  class="aritst category-last"
                  v-for="(aritst,index) in playlist.artists"
                  @click="goToArtist(aritst.id)"
                >
                  <i v-if="index!==0">,</i>
                  <a>{{aritst.name}}</a>
                </span>
              </span>
            </span>
          </div>
        </li>
      </paginate>
      <paginate-links
        for="languages"
        :show-step-links="true"
        :step-links="{
            next: '下一页',
            prev: '上一页'
          }"
      ></paginate-links>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VHeader from "components/VHeader.vue";

const ALBUM = 1,
  PLAYLIST = 2,
  ARTIST = 3;
export default {
  data() {
    return {
      paginate: ["languages"],
      type: 1,
      isArtist: false
    };
  },
  components: {
    VHeader
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
    ...mapActions(["setFocusFlagActions"]),

    goToAlbum(id) {
      this.setFocusFlagActions(false);

      this.$router.push({ path: "/album", query: { id } }).catch(err => {
        console.log(err);
      });
    },
    goToArtist(id) {
      this.setFocusFlagActions(false);

      this.$router.push({ path: "/artist", query: { id } }).catch(err => {
        console.log(err);
      });
    },
    goToPlayList(id) {
      this.setFocusFlagActions(false);

      this.$router.push({ path: "/play-list", query: { id } }).catch(err => {
        console.log(err);
      });
    },
    goToTitle(id) {
      switch (this.type) {
        case 1:
          this.goToAlbum(id);
          break;
        case 2:
          this.goToPlayList(id);
          break;
        case 3:
          this.goToArtist(id);
          break;
        default:
          break;
      }
    },
    goToDesc(id) {
      switch (this.type) {
        case 1:
          this.goToArtist(id);
          break;
        case 2:
          break;
        default:
          break;
      }
    }
  },
  computed: {
    ...mapState({
      categoryList: "categoryList"
    })
  },
  watch: {
    categoryList() {
      switch (this.categoryList.type) {
        case "album":
          this.type = ALBUM;
          this.isArtist = false;

          break;
        case "play-list":
          this.type = PLAYLIST;
          this.isArtist = false;

          break;
        case "artist":
          this.type = ARTIST;
          this.isArtist = true;
          break;
        default:
          break;
      }
    },
    $route(to, from) {
      // 对路由变化作出响应...
      this.$emit("scroll-top");
    }
  },
  mounted() {
    this.$emit("scroll-top");
  }
};
</script>

<style lang="scss">
@import "~style/iconfont.css";
@import "~style/mixin.scss";
@import "~style/index.scss";

.category-paginate {
  margin: 80px 0 40px;
  a {
    color: #fff;
  }
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-column-gap: 20px; //列与列的间隔
    grid-row-gap: 40px; //行与行的间隔
    margin: 0 25px;
  }
  .category-paginate-item {
    display: flex;
    flex-direction: column;
    background-size: cover;
    &.artist {
      .img-wrapper {
        border-radius: 100%;
        img {
          border-radius: 100%;
        }
      }

      .category-item-content-text {
        text-align: center;
      }
    }
    .img-wrapper {
      background-color: #4c4e54;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      &:hover {
        cursor: pointer;
      }
      .sub-name {
        font-size: 75px;
        color: #a7aeba;
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
        margin-top: 50%;
        line-height: 1;
        transform: translateY(-37.5px);
      }
      img {
        width: 100%;
      }
    }
    .category-item-content {
      display: flex;
      flex-direction: column;
      padding-top: 15px;
      justify-content: flex-start;

      .category-item-content-text {
        @include ellipsis;
        font-size: 14px;
        a {
          color: #fff;
        }
        .category-last {
          color: rgba(229, 238, 255, 0.6);
          a {
            color: rgba(229, 238, 255, 0.6);
          }
        }
      }
    }
  }
  .paginate-links {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .left-arrow,
    .right-arrow,
    .number {
      user-select: none;
      height: 22px;
      padding: 0 8px;
      background-color: #000;
      color: #fff;
      line-height: 22px;
      margin: 0 4px;
      border: 1px solid #ccc;
      border-radius: 2px;
      vertical-align: middle;
      font-size: 12px;
      cursor: pointer;
    }
    .number:hover {
      border-color: #fff;
    }
    .left-arrow:hover,
    .right-arrow:hover {
      background-color: #333;
    }
    .left-arrow.disabled,
    .right-arrow.disabled {
      background-color: #ebebeb;
      color: #cacaca;
      cursor: default;
    }
    .active {
      background-color: #a2161b;
      border: 1px solid #a2161b;
    }
  }
}
</style>
