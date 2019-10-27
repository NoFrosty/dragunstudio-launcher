<template>
    <div class="window-content">
        <div class="sidebar column is-2 is-sidebar-menu">
            <SideBar />
        </div>
        <div class="main-panel">
            <div class="top-bar">
                <nav class="level">
                    <!-- Left side -->
                    <div class="level-left">
                        <div class="level-item">
                            <img class="logo" src="@/assets/logo.png" style="height: 4rem;" />
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
            <div v-if="!isOffline">
                <div class="content-container">
                    <GameOverview
                        v-if="!isOffline"
                        class="game-overview tab-content"
                        v-bind:class="{ active: activeGameTab == GAME_TABS.OVERVIEW }"
                    />
                    <div
                        class="game-activities tab-content"
                        v-bind:class="{ active: activeGameTab == GAME_TABS.ACTIVITIES }"
                    >
                        Nunc nec velit nec libero vestibulum eleifend.
                        Curabitur pulvinar congue luctus.
                        Nullam hendrerit iaculis augue vitae ornare.
                        Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget
                    </div>
                    <div
                        class="game-achievements tab-content"
                        v-bind:class="{ active: activeGameTab == GAME_TABS.ACHIEVEMENTS }"
                    >
                        What joy is joy, if Silvia be not by—
                        <br />Unless it be to think that she is by
                        <br />And feed upon the shadow of perfection?
                        <br />Except I be by Silvia in the night,
                        <br />There is no music in the nightingale.
                    </div>
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
import SideBar from "@/components/SideBar.vue";
import UserPanel from "@/components/UserPanel.vue";
import GameOverview from "@/components/GameOverview.vue";
import AuthService from "@/services/auth-service";

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
        SideBar,
        UserPanel,
        GameOverview
    },
    created: function() {}
};
</script>