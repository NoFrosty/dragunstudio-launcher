<template>
    <div>
        <Navbar/>
        <div class="columns">
            <div class="column">Status</div>
            <div class="column column-is-fixed">
                <UserPanel class="nav-profile"/>
            </div>
            
        </div>
        <div class="details" v-if="activeApplication">
            <div class="details-not-installed">
                <div class="columns">
                    <div class="column details-not-installed-left">
                        <div class="details-logo">
                            <figure class="image is-64x64">
                                <img src="https://bulma.io/images/placeholders/128x128.png">
                            </figure>
                            <h1>{{activeApplication.name}}</h1>
                        </div>
                        <div class="details-info">
                            <h1>What is {{activeApplication.name}}</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id efficitur lacus. Fusce gravida tincidunt felis, eget congue sapien facilisis rutrum. Donec pretium metus eu massa tempor ultrices. Integer sit amet nibh sapien. Vivamus quis lacinia lacus, quis fringilla purus. Suspendisse dignissim scelerisque nisi, sed dictum magna. Vivamus nec dolor mollis, facilisis enim at, tristique est.</p>
                        </div>
                    </div>
                    <div class="column-is-fixed is-relative column details-not-installed-right" >
                        <div>
                            <h1>Release Date</h1>
                            <p>01/01/2020</p>
                        </div>
                        <div>
                            <h1>Plateforme</h1>
                            <p>{{compatiblePlatforme}}</p>
                        </div>
                        <b-button type="is-primary" @click="startInstallation">Install/Buy</b-button>
                    </div>
                </div>
            </div>
        </div>
        <b-modal :width="900" :active.sync="isInstallModalActive" class="popup-install" :can-cancel="false" v-if="activeApplication">
            <Install :application="activeApplication" v-on:start="onStartInstall" />
        </b-modal>
    </div>
    <!--
    <div class="window-content">
        <nav class="sidebar">
            <div class="nav">
                <div class="nav-item nav-profile">
                    <UserPanel />
                </div>
                <div class="nav-item sidebar-title">
                    <span class="nav-link">
                        <h1>MY GAMES</h1>
                    </span>
                </div>
                <div class="nav-item">
                    <ApplicationList />
                </div>
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
                <GameOverview 
                    :applicationId="activeApplicationId"
                    v-if="!isOffline" class="game-overview tab-content"
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
    -->
</template>

<script>
const GAME_TABS = {
    OVERVIEW: 0,
    ACTIVITIES: 1,
    ACHIEVEMENTS: 2
};
import ApplicationCommandCenter from "@/components/ApplicationCommandCenter";
import Navbar from "@/components/Navbar.vue";
import GameOverview from "@/components/GameOverview.vue";
import UserPanel from "@/components/UserPanel.vue";
import AuthenticationService from "@/services/AuthenticationService";
import axios from "axios";
import Install from './Install.vue'
import {OSType} from '../models/OSType'
import { applicationLibrary } from "@/services/services";
import {
    GAME_MODE
} from '@/services/constants.ts'

export default {
    name: "evopeons-launcher",
    data() {
        return {
            applications: null,
            applicationId: null,
            isInstallModalActive: false,
            gameMode: GAME_MODE.PUBLIC,
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
        compatiblePlatforme: function(){
            return OSType[this.activeApplication.supportedOperatingSystems]
        }
    },
    asyncComputed: {
        activeApplication: async function() {
            if (!this.activeApplicationId) {
                return null;
            }
            return await applicationLibrary.getGameFromId(this.activeApplicationId);
        }
    },
    methods: {
        onGameTabChange: function(index) {
            this.activeGameTab = index;
        },
        startInstallation() {
            this.isInstallModalActive = true;
        },
        onStartInstall(installData) {
            installationManager.installApplicationMultiThread(
                this.applicationId,
                installData.path,
                this.onProgress
            );
            this.$store.commit('setApplicationInstallationActionType', { applicationId: this.applicationId, actionType: InstallationActionType.Update });
        },
    },
    components: {
        Navbar,
        UserPanel,
        Install
    },
    async mounted() {}
};
</script>