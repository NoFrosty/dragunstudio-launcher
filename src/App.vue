<template>
    <div id="window" class="is-not-selectable" :style="{'background-image': 'url(' + backgroundImage + ')'}">
        <WindowsController />
        <router-view id="view"></router-view>
    </div>
</template>

<script>
const GAME_TABS = {
    OVERVIEW: 0,
    ACTIVITIES: 1,
    ACHIEVEMENTS: 2
};
import WindowsController from "./components/WindowsController.vue";
import services, { eventBus } from "@/services/services";
import backgroundImageDefault from './assets/images/background/Background5.jpg'
export default {
    name: "WarpLauncher",
    data() {
        return {
            GAME_TABS: GAME_TABS,
            activeGameTab: GAME_TABS.OVERVIEW,
            backgroundImage: backgroundImageDefault,
        };
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        },
        onBackgroundChanged: function(background){
            if(background)
            this.backgroundImage = background
            else
            this.backgroundImage = backgroundImageDefault;
        }
    },
    mounted: async function(){
        eventBus.subscribe('on-background-changed', this.onBackgroundChanged);
    },
    components: {
        WindowsController
    },
    created: function() {

        for(var key in services.registrations) {
            let service = services.resolve(key)
            if (typeof service.onInitialize !== "undefined") {
                service.onInitialize();
            }
        }

        // Forward to login page on sign out event
        eventBus.subscribe('on-signout', () => {
            if (this.$router.currentRoute.name != "login") {
                this.$router.push({ name: "login" });
            }
        });
    }
};
</script>

<style lang="scss">
@import "./assets/scss/all.scss";
</style>