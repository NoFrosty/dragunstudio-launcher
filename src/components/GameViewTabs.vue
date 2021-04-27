<template>
  <b-tabs
    position="is-centered"
    class="block"
  >
    <b-tab-item label="Overview">
      <GameOverview />
    </b-tab-item>
    <b-tab-item label="Activities">
      Nunc nec velit nec libero vestibulum eleifend.
      Curabitur pulvinar congue luctus.
      Nullam hendrerit iaculis augue vitae ornare.
      Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
    </b-tab-item>
    <b-tab-item label="Achievments">
      What light is light, if Silvia be not seen? <br>
      What joy is joy, if Silvia be not by— <br>
      Unless it be to think that she is by <br>
      And feed upon the shadow of perfection? <br>
      Except I be by Silvia in the night, <br>
      There is no music in the nightingale.
    </b-tab-item>
  </b-tabs>
</template>

<script>
import GameOverview from './GameOverview.vue';
export default {
    components:{
        GameOverview
    }
}
</script>