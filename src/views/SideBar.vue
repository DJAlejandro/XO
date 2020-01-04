<template>
  <div class="side-bar">
    <div class="side-bar-scroll">
      <section class="userLoggedIn">
        <div class="profile-picture">si</div>
        <div class="profile-icon">
          <span class="icon-more iconfont"></span>
        </div>
      </section>
      <section class="section">
        <router-link to="/" class="section-item">
          <span class="icon-tidal iconfont"></span>
          <span class="section-item-text">Home</span>
        </router-link>
        <router-link to="/view/pages/explore" class="section-item">
          <span class="icon-explore iconfont"></span>
          <span class="section-item-text">Explore</span>
        </router-link>
      </section>
      <section class="section">
        <div class="section-header">My Collection</div>

        <router-link to="/ablum" class="section-item">
          <span class="icon-mix iconfont"></span>
          <span class="section-item-text">My Mix</span>
        </router-link>

        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-playlists iconfont"></span>
          <span class="section-item-text">Playlists</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-albums iconfont"></span>
          <span class="section-item-text">Albums</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-tracks iconfont"></span>
          <span class="section-item-text">Tracks</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-videos iconfont"></span>
          <span class="section-item-text">Videos</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-artists iconfont"></span>
          <span class="section-item-text">Artists</span>
        </router-link>
      </section>
      <section class="section">
        <div class="section-header">My Playlists</div>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-tidal iconfont"></span>
          <span class="section-item-text">Home</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-tidal iconfont"></span>
          <span class="section-item-text">Home</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-tidal iconfont"></span>
          <span class="section-item-text">Home</span>
        </router-link>
        <router-link to="/view/pages/a" class="section-item">
          <span class="icon-tidal iconfont"></span>
          <span class="section-item-text">Home</span>
        </router-link>
      </section>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
@import "~style/index.scss";
@import "~style/mixin.scss";

.side-bar {
  display: flex;
  flex-direction: column;
  width: 240px;
  flex: 0 0 240px;
  background: #242428;
  max-height: 100vh;
  .side-bar-scroll {
    flex-grow: 1;

    overflow-y: auto;
  }
  .userLoggedIn {
    flex: 44px 0 0; //height:44px
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 14px 12px -16px;
    padding: 0 12px;
    position: relative;
    border-radius: 8px;
    &:hover {
      background-color: #4c4e54;
    }
    .profile-picture {
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      overflow: hidden;
      background: #72777f;
      border-color: #101012;
      padding: 0;
      border-radius: 100%;
      color: $vgray;
      text-transform: uppercase;
      font-size: 12px;
    }
    .icon-more {
      color: $vgray;
      font-size: 20px;
    }
  }
  .section {
    margin-top: 32px;
    .section-header {
      margin-bottom: 8px;
      padding: 0 22px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.67;
      letter-spacing: 0.036rem;
      color: $vgray;
      text-transform: uppercase;
      @include ellipsis;
    }
    .section-item {
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 12px;
      position: relative;
      margin: 0 12px;
      border-radius: 8px;
      font-size: 1rem;
      text-align: left;
      color: #fff;
      &.router-link-exact-active {
        color: $vactive;
        .iconfont {
          color: $vactive;
        }
      }
      &:hover {
        background-color: #4c4e54;
        text-decoration: none;
      }
      .iconfont {
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin-right: 16px;
        font-size: 24px;
        color: $vgray;
      }
      .section-item-text {
        @include ellipsis;
        font-size: 14px;
        line-height: 24px;
        min-width: 40px;
        margin: 0 8px;
      }
    }
  }
}
</style>