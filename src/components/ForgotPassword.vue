<template>
    <section class="login-register is-fullheight">
        <div class="login-register-body">
            <div class="field-box">
                <img class="logo" src="../assets/images/Evorine-Logo.png"/>
                <h1 class="login-register-heading">{{$t('reset-password')}}</h1>
                <!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
                <ValidationObserver ref="observer" v-slot="{ passes }" v-if="state==0">
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <ValidationProvider rules="required|email" name="Email" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                    <b-input size="is-medium" icon-pack="fa" icon="envelope" v-model="email"
                                        type="email" name="email" :placeholder="$t('email')">
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
                                <b-button type="submit is-primary" @click="passes(sendCode)">{{$t('send')}}</b-button>
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
                            <b-tooltip :label="$t('not-implemented-feature')"
                                position="is-right">
                                <router-link to="" class="has-text-white">{{$t('didnt-received-code')}} <router-link to="" class="has-text-primary">{{$t('resend')}}</router-link>.</router-link>
                            </b-tooltip>
                            
                        </div>
                    <div class="field">
                        <div class="level">
                            <div>
                                <b-button type="submit is-dark" @click="back">{{$t('back')}}</b-button>
                            </div>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="passes(verifCode)">{{$t('verify')}}</b-button>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
                <ValidationObserver ref="observer1" v-slot="{ passes }" v-if="state==2">
                    <div>
                        <div class="field">
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider vid="password" rules="required|confirmed:confirmation|min:6" name="Password" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="password" 
                                                type="password" name="password" :placeholder="$t('password')" password-reveal required>
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider vid="confirmation" rules="required|confirmed:password|min:6" name="PasswordConfirmation" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="lock" v-model="passwordConfirmation" 
                                                type="password" name="passwordConfirmation" :placeholder="$t('password-confirmation')" password-reveal required>
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                        </div>
                        <div class="field">
                            <div class="level">
                                <div class="level-left">
                                    <b-button type="submit is-dark" @click="back">{{$t('back')}}</b-button>
                                </div>
                                <div class="level-right">
                                    <b-tooltip :label="$t('not-implemented-feature')"
                                        position="is-right">
                                        <b-button type="submit is-primary" @click="passes(changePass)">{{$t('update')}}</b-button>
                                    </b-tooltip>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
            </div>
            <div class="links">
                <router-link to="login" class="has-text-white">{{$t('already-registered')}} <router-link to="login" class="has-text-primary">{{$t('sign-in')}}</router-link>.</router-link>
                <router-link to="register" class="has-text-white">{{$t('new-user-create-label')}} <router-link to="register" class="has-text-primary">{{$t('register')}}</router-link>.</router-link>
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
                verif0: null,
                verif1: null,
                verif2: null,
                verif3: null,
                state: 0,
                password: null,
                passwordConfirmation: null
            }
        },
        components: {
            ValidationObserver,
            ValidationProvider
        },
        methods: {
            sendCode: async function(){
                notificationManager.notify(this.$t('verification-code-sent'));
                this.next();
            },
            verifCode: async function(){
                notificationManager.notify(this.$t('verification-code-correct'));
                this.next();
            },
            changePass: async function(){
                notificationManager.success(this.$t('password-updated'));
                this.$router.push({ name: "login" });
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