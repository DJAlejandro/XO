<template>
  <div class="top-tracks">
    <v-header></v-header>
    <div class="top-tracks-container">
      <trackList :viewFull="viewFull"></trackList>
    </div>
  </div>
</template>
<script>
import TrackList from "./TrackList.vue";
import VHeader from "components/VHeader.vue";
import { mapState } from "vuex";

export default {
  components: {
    VHeader,
    TrackList
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      viewFull: "viewFull"
    })
  }
};
</script>

<style lang="scss" scoped>
.top-tracks {
  display: flex;
  flex-direction: column;
  position: relative;
  .top-tracks-container {
    margin: 80px 28px 48px;
  }
}
</style>