<template>
    <b-dropdown aria-role="list">
        <a href="#" class="user-box online" slot="trigger">
            <div class="nav-profile-image">
                <figure class="image">
                <img class="is-rounded avatar" src="http://www.bootstrapdash.com/demo/purple/jquery/template/assets/images/faces/face1.jpg" alt="profile">
                </figure>
                <span class="login-status"></span>
            </div>
            <div class="nav-profile-text">
                <span class="nav-profile-text-name">{{this.$store.state.username}}</span>
                <span class="nav-profile-text-status">Playing Warcraft IV</span>
            </div>
            <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
        </a>
        <b-dropdown-item v-if="isOffline" v-on:click="goOnline" value="settings">
        <b-icon pack="fas" icon="plug"></b-icon>
        Go Online
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
            },
            goOnline: async function() {
                this.$router.push({ name: "boot" })
            }
        },
    }
</script>