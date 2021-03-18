<template>
    <section class="login-register is-fullheight">
        <div class="login-register-body">
            <div class="field-box">
                <img class="logo" src="../assets/images/Evorine-Logo.png"/>
                <h1 class="login-register-heading">Reset Password</h1>
                <!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
                <ValidationObserver ref="observer" v-slot="{ passes }" v-if="state==0">
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
                        <div class="level">
                            <div>
                            </div>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="passes(sendCode)">Send</b-button>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
                <ValidationObserver ref="observer" v-slot="{ passes }" v-if="state==1">
                    <b-field grouped>
                            <p class="control is-expanded">
                                <ValidationProvider rules="required|digits:1" name="Value" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }" >
                                        <b-input
                                            placeholder="0"
                                            name="verif0"
                                            v-model="verif0"
                                            size="is-medium"
                                            expanded>
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                            <p class="control is-expanded">
                                <ValidationProvider rules="required|digits:1" name="Value" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                        <b-input
                                            placeholder="0"
                                            name="verif1"
                                            v-model="verif1"
                                            size="is-medium"
                                            expanded>
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                            <p class="control is-expanded">
                                <ValidationProvider rules="required|digits:1" name="Value" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
                                        <b-input
                                            placeholder="0"
                                            name="verif2"
                                            v-model="verif2"
                                            size="is-medium"
                                            position="is-centered"
                                            expanded>
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                            <p class="control is-expanded">
                                <ValidationProvider rules="required|digits:1" name="Value" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
                                        <b-input
                                            placeholder="0"
                                            name="verif3"
                                            v-model="verif3"
                                            size="is-medium"
                                            expanded>
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </b-field>
                        <div class="field">
                            <router-link to="" class="has-text-white">If you didn't received a code! <router-link to="" class="has-text-primary">Resend</router-link>.</router-link>
                        </div>
                    <div class="field">
                        <div class="level">
                            <div>
                                <b-button type="submit is-dark" @click="back">Back</b-button>
                            </div>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="passes(verifCode)">Verify</b-button>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
                <ValidationObserver ref="observer1" v-slot="{ passes }" v-if="state==2">
                    <div>
                        <div class="field">
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider vid="password" rules="required|confirmed:confirmation" name="Password" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="password" 
                                                type="password" name="password" placeholder="Password" password-reveal required>
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider vid="confirmation" rules="required|confirmed:password" name="PasswordConfirmation" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="passwordConfirmation" 
                                                type="password" name="passwordConfirmation" placeholder="Password Confirmation" password-reveal required>
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                        </div>
                        <div class="field">
                            <div class="level">
                                <div class="level-left">
                                    <b-button type="submit is-dark" @click="back">Back</b-button>
                                </div>
                                <div class="level-right">
                                    <b-button type="submit is-primary" @click="passes(changePass)">Change</b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
            </div>
            <div class="links">
                <router-link to="login" class="has-text-white">Already registered? <router-link to="login" class="has-text-primary">Sign In</router-link>.</router-link>
                <router-link to="register" class="has-text-white">I'm a new user, <router-link to="register" class="has-text-primary">create an account</router-link>.</router-link>
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
                verif0: null,
                verif1: null,
                verif2: null,
                verif3: null,
                state: 0,
                password: "PhoeniX96&",
                passwordConfirmation: "PhoeniX96&"
            }
        },
        components: {
            ValidationObserver,
            ValidationProvider
        },
        methods: {
            sendCode: async function(){
                notificationManager.notify("We've send a verification code to your email. Please check your email and spam.");
                this.next();
            },
            verifCode: async function(){
                notificationManager.notify("Your code is correct. Now you can enter your new password.");
                this.next();
            },
            changePass: async function(){
                notificationManager.success("You password has been changed.");
                this.next();
            },
            next: function(){
                this.state++;
            },
            back: function(){
                this.state--;
            }
        },
        mounted: async function() {
            if (authenticationService.IsSignedIn()) {
                this.$router.push({ name: "launcher" });
            }
        }
    }
</script>