<template>
  <div class="top-tracks">
    <v-header></v-header>
    <div class="top-tracks-container">
      <trackList></trackList>
    </div>
  </div>
</template>
<script>
import TrackList from "./TrackList.vue";
import VHeader from "components/VHeader.vue";

export default {
  components: {
    VHeader,
    TrackList
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