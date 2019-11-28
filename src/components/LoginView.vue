<template>
    <section class="login is-fullheight">
        <div class="login-body">
            <div class="field-box">
                <div class="">
                    <span class="title-colored">Evo</span>
                    <span class="title-white">Launcher</span>
                </div>
                <h1 class="login-heading">Welcome back !</h1>
                <p class="login-subheading">We don't need a healer for this, right?</p>
                <form @submit.prevent="attemptSignIn">
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <b-field>
                                <b-input size="is-medium" icon-pack="fa" icon="envelope" v-model="email"
                                    type="email" name="email" placeholder="Email" required>
                                </b-input>
                            </b-field>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <b-field>
                                <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="password" 
                                    type="password" name="password" placeholder="Password" password-reveal required
                                    @keyup.native.enter="attemptSignIn">
                                </b-input>
                            </b-field>
                        </p>
                    </div>
                    <div class="field">
                        <div class="level">
                            <!-- Left side -->
                            <div class="level-left">
                                <router-link to="#">Register</router-link>
                            </div>
                            <div class="level-right">
                                <router-link to="#">Forgot password</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="level">
                            <b-switch :value="false">
                                Stay signed in ?
                            </b-switch>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="attemptSignIn">Login</b-button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
    import { authenticationService } from '@/services/services'
    
    export default {
        data() {
            return {
                email: null,
                password: null,
                wrongIdentifier: false,
                emailHasError: false,
            }
        },
        components: {
        },
        methods: {
            attemptSignIn: async function() {
                if(!this.email || !this.password){
                    if(!this.email || this.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
                        this.emailHasError = true;
                    else
                        this.emailHasError = false;
                    if(!this.password)
                        this.passwordHasError = true;
                    else
                        this.passwordHasError = false;
                }
                else{
                    var isLogged = await authenticationService.AttemptSignIn({
                        email: this.email,
                        password: this.password
                    });
                    if(isLogged) {
                        this.wrongIdentifier = false;
                        this.$router.push({ name: "launcher" });
                    }
                    else{
                        this.wrongIdentifier = true;
                        
                    }
                }
            }
        },
        mounted: async function() {
            if (authenticationService.IsSignedIn()) {
                this.$router.push({ name: "launcher" });
            }
        }
    }
</script>