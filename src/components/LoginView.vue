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
                <ValidationObserver ref="observer" v-slot="{ passes }">
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <ValidationProvider rules="required|email" name="Email" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                    <b-input size="is-medium" icon-pack="fa" icon="envelope" v-model="email"
                                        type="email" name="email" placeholder="Email">
                                    </b-input>
                                </b-field>
                            </ValidationProvider>
                        </p>
                    </div>
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <ValidationProvider rules="required" name="Password" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                    <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="password" 
                                        type="password" name="password" placeholder="Password" password-reveal required>
                                    </b-input>
                                </b-field>
                            </ValidationProvider>
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
                                <b-button type="submit is-primary" @click="passes(attemptSignIn)">Login</b-button>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
            </div>
        </div>
    </section>
</template>
<script>
    import { authenticationService, notificationManager } from '@/services/services'
    import { ValidationObserver, ValidationProvider } from "vee-validate";

    export default {
        data() {
            return {
                email: null,
                password: null,
                emailHasError: false,
            }
        },
        components: {
            ValidationObserver,
            ValidationProvider
        },
        methods: {
            attemptSignIn: async function() {
                var isLogged = await authenticationService.AttemptSignIn({
                    email: this.email,
                    password: this.password
                });
                if(isLogged) {
                    this.$router.push({ name: "launcher" });
                }
                else{
                    notificationManager.error("Login failed! Email or password does not match!");
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