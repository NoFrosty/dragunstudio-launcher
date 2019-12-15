<template>
<section class="boot">
    <div class="boot-body">
        <div class="field-box">
            <div class="">
                <span class="title-colored">Evo</span>
                <span class="title-white">Launcher</span>
            </div>
            <h1 class="login-heading">Welcome back !</h1>
            <p class="login-subheading" v-if="this.currentAction == 'Server is Down'">Sorry, our servers seems offline or maybe your internet connection is down.</p>
            <div class="field" style="width: 12rem;" v-if="this.currentAction == 'Server is Down'">
                <div class="buttons">
                        <b-button class="is-fullwidth" type="submit is-primary" @click="goOffline">Go Offline</b-button>
                        <b-button class="is-fullwidth" type="submit is-primary" @click="retry">Retry</b-button>
                </div>
            </div>
        </div>
    </div>
    <div class="loading" :active.sync="this.currentAction == 'Checking Server Status' || this.currentAction == 'Checking Server Status' || (!loaded && !isServerDown)">
        <b-progress type="is-primary" showValue>{{this.currentAction}}</b-progress>
    </div>
  </section>
</template>

<script>
    import axios from 'axios';
    import { applicationLibrary } from '@/services/services';

    export default {
        computed: {

        },
        data() {
            return {
                currentAction: null,
                isServerDown: false,
                loaded:false,
            }
        },
        methods: {
            testServerConnection: async function() {
                this.currentAction = 'Checking Server Status';
                try {
                    // Check if server is up
                    await axios.get(process.env.VUE_APP_API_LINK + '/health');
                    this.isServerDown = false;
                }
                catch {
                    // Server is down!
                    this.currentAction = 'Server is Down';
                    this.isServerDown = true;
                    loadingComponent.close();
                }
                this.currentAction = 'Server is Up';
                return !this.isServerDown;
            },
            retry: async function(){
                if (await this.testServerConnection()) {
                    this.goOnline();
                }
            },
            initializeLauncher: async function() {
                this.currentAction = 'Loading';

                //var result = await applicationLibrary.getAllGameList();
                
                this.currentAction = 'Loaded';

                return true;
            },
            goOffline: function() {
                this.$store.commit('setOfflineStatus', true);
                this.initializeLauncher();
                this.$router.push({ name: "launcher" });
            },
            goOnline: function() {
                this.$store.commit('setOfflineStatus', false);
                if (this.initializeLauncher()) {
                    this.$router.push({ name: "login" });
                }
            }

        },
        components: {
        },
        mounted: async function() {
            if (await this.testServerConnection()) {
                this.goOnline();
            }
        }
    }
</script>