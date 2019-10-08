<template>
    <section class="user-panel">
        <b-modal :active.sync="isComponentModalActive" has-modal-card >
               <LoginPrompt/>
            </b-modal>
        <div class="user-logged" v-if="isSignedIn">
            <div class="user-data">
                <div class="user-friends">
                    <b-icon pack="fas" icon="user" size="is-small"></b-icon>
                    <p>0</p>
                </div>
                <div class="user-name">
                    <p>{{this.$store.state.username}}</p>
                </div>
            </div>
            <figure class="image is-64x64">
                    <img class="is-rounded user-icon" src="https://bulma.io/images/placeholders/64x64.png">
            </figure>
        </div>
        <div class="user-not-logged" v-else>
            <b-button type="is-primary" @click="isComponentModalActive = true" tag="router-link" to="/login">Log in</b-button>
        </div>
    </section>
</template>

<script>
import LoginPrompt from './LoginPrompt.vue';
export default {
    data() {
            return {
                isComponentModalActive: false,
            }
        },
    components:{
        LoginPrompt
    },
    computed: {
      isSignedIn: function() {
        return this.$store.state.isSignedIn;
      }
    },
    methods: {
      logout: async function() {
        await this.$root.$AuthService.SignOut();
      }
    },
}
</script>