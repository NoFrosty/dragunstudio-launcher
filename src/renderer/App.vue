<template>
  <div id="app">
    <div class="columns is-fullheight">
      <div class="sidebar column is-2 is-sidebar-menu">
        <figure class="image">
          <img class="logo" src="./assets/logo.png"/>
        </figure>
        
        <SideBar/>
      </div>
      <div class="column">
        <WindowsController/>
        <GameViewTabs/>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import TopBar from './components/TopBar.vue';
  import SideBar from './components/SideBar.vue';
  import WindowsController from './components/WindowsController.vue';
  import GameViewTabs from './components/GameViewTabs.vue';

  export default {
    name: 'evopeons-launcher',
    components: {
      TopBar,
      SideBar,
      WindowsController,
      GameViewTabs
    }
  }
</script>

<style lang="scss">
   
  @import './assets/scss/style.scss';
</style>