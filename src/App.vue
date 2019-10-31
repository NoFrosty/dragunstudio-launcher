<template>
    <div id="window">
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
import AuthenticationService from "./services/AuthenticationService";
import ApplicationLibrary from "./services/ApplicationLibrary";
import InstallationManager from "./services/InstallationManager";
import RepairService from "./services/RepairService";
import notifier from "./services/Notifier";

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
        this.$root.$AuthenticationService = new AuthenticationService(
            this.$store,
            this.$router
        );
        this.$root.$ApplicationLibrary = new ApplicationLibrary(this.$store);
        this.$root.$InstallationManager = new InstallationManager(this.$store);
        this.$root.$RepairService = new RepairService(this.$store);
        this.$root.$Notifier = notifier;

        this.$root.$RepairService.CheckStore();
        console.log("State", this.$store.state);
    }
};
</script>

<style lang="scss">
@import "./assets/scss/all.scss";
</style>