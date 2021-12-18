<template>
    <div class="is-fullheight">
        <section class="boot">
            <div class="boot-body">
                <div class="field-box">
                    <img class="logo" src="../assets/images/Evorine-Logo.png" />
                    <div class="lang-dropdown">
                    </div>
                    <h1 class="boot-heading">Welcome back !</h1>
                    <!--<p class="login-subheading">We don't need a healer for this, right?</p>-->

                    <p class="login-subheading" v-if="this.currentAction == 'Server is Down'">Sorry, our servers seems
                        offline or maybe your internet connection is down.</p>

                </div>
                <div class="links is-fullwidth">
                    <div class="field is-fullwidth" v-if="this.currentAction == 'Server is Down'">
                        <b-button class="is-fullwidth" type="submit is-primary" @click="retry" expanded>Retry</b-button>
                    </div>
                    <br />
                    <section class="loading" v-if="this.currentAction != 'Server is Down'" :active.sync="this.currentAction == 'Checking Server Status' || this.currentAction == 'Checking Server Status' || (!loaded && !isServerDown)">
                        <b-progress type="is-primary" showValue>{{this.currentAction}}</b-progress>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    computed: {

    },
    data() {
        return {
            currentAction: null,
            isServerDown: false,
            loaded: false,
        }
    },
    methods: {
        testServerConnection: async function () {
            this.currentAction = 'Checking Server Status';
            try {
                // Check if server is up
                await axios.get(process.env.VUE_APP_API_LINK + '/health');
                this.isServerDown = false;
            } catch {
                // Server is down!
                this.currentAction = 'Server is Down';
                this.isServerDown = true;
                //loadingComponent.close();
            }
            this.currentAction = 'Server is Up';
            return !this.isServerDown;
        },
        retry: async function () {
            if (await this.testServerConnection()) {
                this.goOnline();
            }
        },
        initializeLauncher: async function () {
            this.currentAction = 'Loading';

            //var result = await applicationLibrary.getAllGameList();

            this.currentAction = 'Loaded';

            return true;
        },
        goOffline: function () {
            this.$store.commit('setOfflineStatus', true);
            this.initializeLauncher();
            this.$router.push({
                name: "launcher"
            });
        },
        goOnline: function () {
            this.$store.commit('setOfflineStatus', false);
            if (this.initializeLauncher()) {
                this.$router.push({
                    name: "login"
                });
            }
        }

    },
    components: {},
    mounted: async function () {
        if (await this.testServerConnection()) {
            this.goOnline();
        }
    }
}
</script>
