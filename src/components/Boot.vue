<template>
<section class="login is-fullheight">
    <div class="login-body">
        <div class="login-page">
            <div class="login-form-wrapper">
                <div class="field-box">
                    <div class="logo">
                    <img src="@/assets/logo.png"/>
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
        </div>
        <b-loading :is-full-page="true" :active.sync="this.currentAction == 'Checking Server Status' || this.currentAction == 'Checking Server Status' || (!loaded && !isServerDown)" >
            <b-icon
                pack="fas"
                icon="sync-alt"
                size="is-large"
                custom-class="fa-spin">
            </b-icon>
            <h1>{{this.currentAction}}</h1>
        </b-loading>
    </div>
      
  </section>
  <!--
    <div>
        <p v-if="currentAction == 'health-check'">Checking server!</p>
        <p v-if="currentAction == 'loading'">Loading!</p>
        <p v-if="isServerDown">
            Server Down!
            <button @click="goOffline">Go Offline</button>
            <button @click="retry">Retry</button>
        </p>
        
    </div>
    -->
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
                loaded:false,
            }
        },
        methods: {
            onGameTabChange: function (index) {
                this.activeGameTab = index;
            },
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
                
                var result = await this.$root.$ApplicationLibrary.getAllGameList();
                
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