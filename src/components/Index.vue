<template>
    <div class="window-content">
        <nav class="sidebar">
            <ul class="nav">
                <li class="nav-item nav-profile is-not-hoverable" v-if="isSignedIn">
                    <UserPanel />
                </li>
                <li class="nav-item is-not-hoverable" v-else>
                    <a class="nav-link" href="#">
                        <button class="button is-primary is-fullwidth">Login</button>
                    </a>
                </li>
                <!--My Games-->
                <li class="nav-item sidebar-title is-not-hoverable is-not-selectable">
                    <span class="nav-link">
                        <div class="">
                            <h1 class="">MY GAMES</h1>
                        </div>
                    </span>
                </li>
                <li class="nav-item item-game" v-for="application in applications" :key="application.applicationId">
                    <a class="nav-link" @click="changeApplication(application)">
                        <img :src="'./images/app-icon/' + application.applicationId + '.png'" alt="icon">
                        <span class="menu-title">{{application.name}}</span>
                    </a>
                </li>
                <!--My Friends-->
                <li class="nav-item sidebar-title is-not-hoverable is-not-selectable">
                    <span class="nav-link">
                        <div class="">
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
import GameOverview from "@/components/GameOverview.vue";
import AuthenticationService from "@/services/AuthenticationService";
import axios from 'axios';
import { applicationLibrary } from '@/services/services';
export default {
    name: "evopeons-launcher",
    data() {
        return {
            GAME_TABS: GAME_TABS,
            activeGameTab: GAME_TABS.OVERVIEW,
            currentApplication: null,
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
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        },
        changeApplication: function(application) {
            this.currentApplication = application;
            this.$store.commit('setSelectedApplicationId', this.currentApplication.applicationId);
        }
    },
    components: {
        UserPanel,
        GameOverview,
    },
    async mounted() {
        this.applications = await applicationLibrary.getAllGameList();
            if(!this.$store.state.selectedApplicationId)
                this.$store.commit('setSelectedApplicationId', this.applications[0].applicationId);
            this.currentApplication =  this.applications.find(x => x.applicationId == this.$store.state.selectedApplicationId)
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setSelectedApplicationId') {
                    if(state.selectedApplicationId != this.currentApplication.applicationId){
                        this.$store.commit('setSelectedApplicationId', this.currentApplication.applicationId);
                    }
                }
            });
    }
};
</script>