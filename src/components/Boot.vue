<template>
    <div>
        <p v-if="isLoading">Loading!</p>
        <p v-if="isServerDown">
            Server Down!
            <button @click="goOffline">Go Offline</button>
            <button>Retry</button>
        </p>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        computed: {

        },
        data() {
            return {
                isLoading: true,
                isServerDown: false
            }
        },
        methods: {
            onGameTabChange: function (index) {
                this.activeGameTab = index;
            },
            testServerConnection: async function() {
                try {
                    // Check if server is up
                    await axios.get(process.env.VUE_APP_API_LINK + '/health');
                    this.isServerDown = false;
                }
                catch {
                    // Server is down!
                    this.isServerDown = true;
                }
                return !this.isServerDown;
            },
            initializeLauncher: async function() {
                this.isLoading = true;
                
                var result = await this.$root.$ApplicationLibrary.getAllGameList();
                
                this.isLoading = false;

                return true;
            },
            goOffline: function() {
                this.$store.commit('setOfflineStatus', true);
                this.initializeLauncher();
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