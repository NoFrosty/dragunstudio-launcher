<template>
    <div class="window-content">
        <nav class="sidebar">
            <div class="nav">
                <div class="nav-item nav-profile">
                    <UserPanel />
                </div>
                <!--My Games-->
                <div class="nav-item sidebar-title">
                    <span class="nav-link">
                        <h1>MY GAMES</h1>
                    </span>
                </div>
                <div class="nav-item">
                    <ApplicationList />
                </div>
                <!--My Friends-->
                <div class="nav-item sidebar-title">
                    <span class="nav-link">
                        <div class="">
                            <h1 class="">MY FRIENDS</h1>
                        </div>
                    </span>
                </div>
                <div class="nav-item">
                    <a class="nav-link" href="#">
                        <button class="button is-primary is-fullwidth">Add a friend</button>
                    </a>
                </div>
            </div>
        </nav>
        <div class="main-panel">
            <div class="level">
                <div class="top-bar level-left">
                    <div v-if="isOffline">
                        <h1>NO DESCRIPTION IN OFFLINE MODE!</h1>
                    </div>
                    <b-tabs
                        v-else
                        v-model="activeGameTab"
                        v-on:change="onGameTabChange"
                        class="game-tabs block"
                    >
                        <b-tab-item label="Overview" />
                        <b-tab-item label="Activities" disabled />
                        <b-tab-item label="Achievements" disabled />
                    </b-tabs>
                </div>
                <div class="level-right">
                    <ApplicationCommandCenter :applicationId="activeApplicationId" />
                </div>
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
import ApplicationCommandCenter from "@/components/ApplicationCommandCenter";
import ApplicationList from "@/components/ApplicationList.vue";
import GameOverview from "@/components/GameOverview.vue";
import UserPanel from "@/components/UserPanel.vue";
import AuthenticationService from "@/services/AuthenticationService";
import axios from 'axios';
import { applicationLibrary } from '@/services/services';
export default {
    name: "evopeons-launcher",
    data() {
        return {
            GAME_TABS: GAME_TABS,
            activeGameTab: GAME_TABS.OVERVIEW,
            applications:null,
        };
    },
    computed: {
        isOffline: function() {
            return this.$store.state.isOffline;
        },
        isSignedIn: function() {
            return this.$store.state.isSignedIn;
        },
        activeApplicationId: function() {
            return this.$store.state.selectedApplicationId;
        },
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        }
    },
    components: {
        ApplicationCommandCenter,
        ApplicationList,
        GameOverview,
        UserPanel
    },
    async mounted() {
    }
};
</script>