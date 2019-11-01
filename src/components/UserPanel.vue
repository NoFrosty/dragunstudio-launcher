<template>
    <section class="user-panel">
        <b-dropdown v-if="isSignedIn"
                    position="is-bottom-left"
                    aria-role="menu">
                    <button class="button is-primary" slot="trigger">
                        <span>{{this.$store.state.username}}</span>
                        <b-icon pack="fas" icon="caret-down"></b-icon>
                    </button>
                    <b-dropdown-item v-if="isOffline" v-on:click="goOnline" value="settings">
                        <b-icon pack="fas" icon="plug"></b-icon>
                        Go Online
                    </b-dropdown-item>
                    <b-dropdown-item value="settings">
                        <b-icon pack="fas" icon="user-friends"></b-icon>
                        Friends
                    </b-dropdown-item>
                    <b-dropdown-item value="settings">
                        <b-icon pack="fas" icon="cog"></b-icon>
                        Settings
                    </b-dropdown-item>
                    <b-dropdown-item v-on:click="logout" value="logout" aria-role="menuitem">
                        <b-icon pack="fas" icon="sign-out-alt"></b-icon>
                        Logout
                    </b-dropdown-item>
                </b-dropdown>
        <div class="user-not-logged" v-else>
            <b-button type="is-primary" @click="isComponentModalActive = true" tag="router-link" :to="{name:'login'}">Log in</b-button>
        </div>
    </section>
</template>

<script>
    import { authenticationService } from '@/services/services'

    export default {
        data() {
                return {
                }
            },
        components:{
        },
        computed: {
            isSignedIn: function() {
                return this.$store.state.isSignedIn;
            },
            isOffline: function() {
                return this.$store.state.isOffline;
            }
        },
        methods: {
        logout: async function() {
            await authenticationService.SignOut();
            this.$router.push({ name: "login" });
        },
        goOnline: async function() {
            this.$router.push({ name: "boot" })
        }
        },
    }
</script>