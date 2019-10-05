<template>
  <div id="app">
    <div class="columns is-fullheight">
      <div class="sidebar column is-2 is-sidebar-menu">
        <figure class="image">
          <img class="logo" src="./assets/logo.png"/>
        </figure>
        
        <SideBar/>
      </div>
      <div class="main-panel">
        <WindowsController/>
        <div class="top-bar">
          <b-tabs v-model="activeGameTab" v-on:change="onGameTabChange" position="is-centered" class="game-tabs block">
            <b-tab-item label="Overview" />
            <b-tab-item label="Activities" />
            <b-tab-item label="Achievements" />
          </b-tabs>
          <div class="control-panel">
            <UserMiniature/>
          </div>
        </div>
        <div class="content-container">
          <GameOverview class="game-overview tab-content" v-bind:class="{ active: activeGameTab == GAME_TABS.OVERVIEW }"/>
          <div class="game-activities tab-content" v-bind:class="{ active: activeGameTab == GAME_TABS.ACTIVITIES }">
            Nunc nec velit nec libero vestibulum eleifend.
            Curabitur pulvinar congue luctus.
            Nullam hendrerit iaculis augue vitae ornare.
            Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget
          </div>
          <div class="game-achievements tab-content" v-bind:class="{ active: activeGameTab == GAME_TABS.ACHIEVEMENTS }">
            What joy is joy, if Silvia be not by— <br>
            Unless it be to think that she is by <br>
            And feed upon the shadow of perfection? <br>
            Except I be by Silvia in the night, <br>
            There is no music in the nightingale.
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  const GAME_TABS = {
    OVERVIEW: 0,
    ACTIVITIES: 1,
    ACHIEVEMENTS: 2
  }
  import TopBar from './components/TopBar.vue';
  import SideBar from './components/SideBar.vue';
  import WindowsController from './components/WindowsController.vue';
  import GameViewTabs from './components/GameViewTabs.vue';
  import UserMiniature from './components/UserMiniature.vue';
  import GameOverview from './components/GameOverview.vue';

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
      TopBar,
      SideBar,
      WindowsController,
      GameViewTabs,
      UserMiniature,
      GameOverview
    }
  }
</script>

<style lang="scss">
   
  @import './assets/scss/all.scss';
</style>