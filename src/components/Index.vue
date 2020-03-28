<template>
    <div>
        <Navbar />
        <div class="columns">
            <div class="column left-column">
                <div class="left-column-alerts"><PatchFull v-if="article" :article="article"/></div>
                <ApplicationOverview :applicationId="activeApplicationId" v-if="!article" />
            </div>
            <div class="column column-is-fixed is-17 right-column" v-if="activeApplication">
                <div class="nav-users">
                    <UserPanel class="nav-users-profile" />
                </div>
                <ApplicationCommandCenter/>
            </div>
        </div>
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
    import ApplicationOverview from "@/components/ApplicationOverview";
    import ApplicationCommandCenter from "@/components/ApplicationCommandCenter";
    import Navbar from "@/components/Navbar.vue";
    import UserPanel from "@/components/UserPanel.vue";
    import { applicationLibrary, eventBus } from '@/services/services'
    import PatchFull from './PatchFull.vue'
    export default {
        name: "evopeons-launcher",
        data() {
            return {
                article:null
            };
        },
        computed: {
            activeApplicationId: function () {
                return this.$store.state.selectedApplicationId;
            },
        },
        mounted: async function(){
            eventBus.subscribe('on-article-open', this.onArticleReceived);
            eventBus.subscribe('on-article-close', this.onArticleReceived);
        },
        methods: {
            onArticleReceived(article){
                this.article = article
            }
        },
        components: {
            Navbar,
            UserPanel,
            ApplicationOverview,
            ApplicationCommandCenter,
            PatchFull
        },
        asyncComputed: {
            activeApplication: async function () {
                if (!this.activeApplicationId) {
                    return null;
                }
                return await applicationLibrary.getGameFromId(this.activeApplicationId);
            }
        },
    };
</script>