<template>
    <div id="window" class="is-not-selectable">
        <WindowsController />
        <router-view></router-view>
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

export default {
    name: "evopeons-launcher",
    data() {
        return {
            GAME_TABS: GAME_TABS,
            activeGameTab: GAME_TABS.OVERVIEW
        };
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        }
    },
    components: {
        WindowsController
    },
    created: function() {
        let RepairService = services.resolve('repairService');
        RepairService.CheckStore();
        RepairService.CheckIfSelectedApplicationStillExists();

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