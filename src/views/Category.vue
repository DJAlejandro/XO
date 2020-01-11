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
              @click="goToTitle($event,playlist.id)"
            />
            <div
              v-else
              class="sub-name"
              @click="goToTitle($event,playlist.id)"
            >{{playlist.title | subName}}</div>
          </div>
          <div class="category-item-content">
            <span class="category-item-content-text" @click="goToTitle($event,playlist.id)">
              <a>{{playlist.title}}</a>
            </span>
            <span class="category-item-content-text" v-if="type!==ARTIST">
              <span class="category-last" v-if="type===PLAYLIST">Created By &nbsp;</span>
              <a class="category-last" v-if="type!==ALBUM">{{playlist.desc}}</a>
              <span v-if="type===ALBUM">
                <span
                  class="aritst category-last"
                  v-for="(aritst,index) in playlist.artists"
                  @click="goToArtist($event,aritst.id)"
                  v-preventReClick
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
import VHeader from "components/VHeader.vue";
import mixins from "mixins/index.js";
import { instance, ALBUM, PLAYLIST, ARTIST } from "mixins/index.js";

export default {
  mixins: [mixins],
  data() {
    return {
      paginate: ["languages"],
      type: 1,
      isArtist: false,
      ALBUM,
      PLAYLIST,
      ARTIST
    };
  },
  components: {
    VHeader
  },

  methods: {
    goToTitle(event, id) {
      switch (this.type) {
        case 1:
          this.goToAlbum(event, id, true);
          break;
        case 2:
          this.goToPlayList(event, id, true);
          break;
        case 3:
          this.goToArtist(event, id, true);
          break;
        default:
          break;
      }
    },
    changeType() {
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
    }
  },

  watch: {
    categoryList() {
      this.changeType();
    },
    $route(to, from) {
      // 对路由变化作出响应...
      this.changeType();
      this.$emit("scroll-top");
    }
  },
  mounted() {
    this.$emit("scroll-top");
    this.changeType();
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
