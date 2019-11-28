<template>
    <div class="window-content">
        <nav class="sidebar">
            <ul class="nav">
                <li class="nav-item nav-profile">
                    <a href="#" class="nav-link">
                        <div class="nav-profile-image">
                            <img src="http://www.bootstrapdash.com/demo/purple/jquery/template/assets/images/faces/face1.jpg" alt="profile">
                            <span class="login-status online"></span>
                            <!--change to offline or busy as needed-->
                        </div>
                        <div class="nav-profile-text">
                            <span class="nav-profile-text-name">Frosty</span>
                            <span class="nav-profile-text-status">Playing Warcraft IV</span>
                        </div>
                        <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
                    </a>
                </li>
                <!--My Games-->
                <li class="nav-item sidebar-title is-not-hoverable">
                    <span class="nav-link">
                        <div class="border-bottom">
                            <h1 class="">MY GAMES</h1>
                        </div>
                    </span>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <span class="menu-title">Warcraft IV</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <span class="menu-title">Portal 3</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <span class="menu-title">WoW 2</span>
                    </a>
                </li>
                <!--My Friends-->
                <li class="nav-item sidebar-title is-not-hoverable">
                    <span class="nav-link">
                        <div class="border-bottom">
                            <h1 class="">MY FRIENDS</h1>
                        </div>
                    </span>
                </li>
                <li class="nav-item is-not-hoverable">
                    <a class="nav-link" href="#">
                        <button class="button is-primary is-fullwidth">Add a friend</button>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="main-panel">
            <div class="top-bar">
                <nav class="level">
                    <!-- Left side -->
                    <div class="level-left">
                        <div class="level-item">
                            <DropDownApplicationSelection/>
                        </div>
                    </div>

                    <!-- Right side -->
                    <div class="level-right">
                        <p class="level-item">
                            <UserPanel />
                        </p>
                    </div>
                </nav>
                <div v-if="isOffline">
                    <h1>NO DESCRIPTION IN OFFLINE MODE!</h1>
                </div>
                <b-tabs
                    v-else
                    v-model="activeGameTab"
                    v-on:change="onGameTabChange"
                    position="is-centered"
                    class="game-tabs block"
                >
                    <b-tab-item label="Overview" />
                    <b-tab-item label="Activities" />
                    <b-tab-item label="Achievements" />
                </b-tabs>
            </div>
            <div class="content-container" v-if="!isOffline">
                <GameOverview v-if="!isOffline" class="game-overview tab-content"
                    v-bind:class="{ active: activeGameTab == GAME_TABS.OVERVIEW }"/>
                <div class="game-activities tab-content"
                    v-bind:class="{ active: activeGameTab == GAME_TABS.ACTIVITIES }">
                    Nunc nec velit nec libero vestibulum eleifend.
                    Curabitur pulvinar congue luctus.
                    Nullam hendrerit iaculis augue vitae ornare.
                    Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget
                </div>
                <div class="game-achievements tab-content"
                    v-bind:class="{ active: activeGameTab == GAME_TABS.ACHIEVEMENTS }">
                    What joy is joy, if Silvia be not by—
                    <br />Unless it be to think that she is by
                    <br />And feed upon the shadow of perfection?
                    <br />Except I be by Silvia in the night,
                    <br />There is no music in the nightingale.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const GAME_TABS = {
    OVERVIEW: 0,
    ACTIVITIES: 1,
    ACHIEVEMENTS: 2
};
import UserPanel from "@/components/UserPanel.vue";
import DropDownApplicationSelection from "@/components/DropDownApplicationSelection.vue";
import GameOverview from "@/components/GameOverview.vue";
import AuthenticationService from "@/services/AuthenticationService";

export default {
    name: "evopeons-launcher",
    data() {
        return {
            GAME_TABS: GAME_TABS,
            activeGameTab: GAME_TABS.OVERVIEW
        };
    },
    computed: {
        isOffline: function() {
            return this.$store.state.isOffline;
        }
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        }
    },
    components: {
        UserPanel,
        GameOverview,
        DropDownApplicationSelection
    },
    created: function() {}
};
</script>