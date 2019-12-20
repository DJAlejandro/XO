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
        <input type="search" placeholder="Search" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tag"],
  data() {
    return {};
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
    }
  }
}
</style>