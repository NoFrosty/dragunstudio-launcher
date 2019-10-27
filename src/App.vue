<template>
  <div id="window">
    <WindowsController/>
    <router-view></router-view>
  </div>
</template>

<script>
  const GAME_TABS = {
    OVERVIEW: 0,
    ACTIVITIES: 1,
    ACHIEVEMENTS: 2
  }
  import SideBar from './components/SideBar.vue';
  import WindowsController from './components/WindowsController.vue';
  import UserPanel from './components/UserPanel.vue';
  import GameOverview from './components/GameOverview.vue';
  import AuthService  from './services/auth-service';
  import {Launcher} from './launcher/Launcher';
  var launcher;
  export default {
    name: 'evopeons-launcher',
    data() {
      return {
        GAME_TABS: GAME_TABS,
        activeGameTab: GAME_TABS.OVERVIEW
      }
    },
    methods: {
      onGameTabChange: function (index) {
        this.activeGameTab = index;
      }
    },
    components: {
      SideBar,
      WindowsController,
      UserPanel,
      GameOverview
    },
    created: function() {
      this.$root.$AuthService = new AuthService(this.$store);
    },
    
  }
    launcher = new Launcher();
  
  
</script>

<style lang="scss">
   
  @import './assets/scss/all.scss';
</style>