<template>
    <section class="login-register is-fullheight">
        <div class="login-register-body">
            <div class="field-box">
                <img class="logo" src="../assets/images/Evorine-Logo.png"/>
                <h1 class="login-register-heading">Sign In</h1>
                <!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
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
                            <b-checkbox :value="false" v-model="staySignedIn">
                                Remember Me
                            </b-checkbox>
                        </div>
                    </div>
                    <div class="field">
                        <div class="level">
                            <div>
                            </div>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="passes(attemptSignIn)">Sign In</b-button>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
            </div>
            <div class="links">
                <router-link to="register" class="is-white">Create account</router-link>
                <router-link to="#">Can't sign in ?</router-link>
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
                email: "calvindogus@gmail.com",
                password: "PhoeniX96&",
                staySignedIn: false,
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
                }, this.staySignedIn);
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