<template>
    <section class="login-register is-fullheight">
        <div class="login-register-body">
            <div class="field-box">
                <img class="logo" src="../assets/images/Evorine-Logo.png"/>
                <h1 class="login-register-heading">{{$t('register')}}</h1>
                <!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
                <ValidationObserver ref="observer0" v-slot="{ passes }" v-if="state==0">
                    <div class="field">
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
                        <b-field grouped>
                            <p class="control is-expanded">
                                <ValidationProvider :rules="{required: {}}" name="SelectedDay" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }" >
                                        <b-select
                                            :placeholder="$t('day')"
                                            name="selectedDay"
                                            v-model="selectedDay"
                                            size="is-medium"
                                            expanded>
                                            <option :value="day" :key="day" v-for="day in 31">{{day}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                            <p class="control is-expanded">
                                <ValidationProvider :rules="{required: {}}" name="SelectedMonth" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                        <b-select
                                            :placeholder="$t('month')"
                                            name="selectedMonth"
                                            v-model="selectedMonth"
                                            size="is-medium"
                                            expanded>
                                            <option :value="month" :key="month" v-for="month in 12">{{month}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                            <p class="control is-expanded">
                                <ValidationProvider :rules="{required: {}}" name="SelectedYear" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }" expanded>
                                        <b-select
                                            :placeholder="$t('year')"
                                            name="selectedYear"
                                            v-model="selectedYear"
                                            size="is-medium"
                                            expanded>
                                            <option :value="year" :key="year" v-for="year in yearRange">{{year}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </b-field>
                        <div class="field" v-if="allCountryList">
                            <p class="control has-icons-left has-icons-right">
                                <ValidationProvider rules="required" name="SelectedCountry" v-slot="{ errors, valid }">
                                    <b-field 
                                    :message="errors"
                                    :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                        <b-select
                                            :placeholder="$t('country')"
                                            icon="globe"
                                            icon-pack="fas"
                                            name="selectedCountry"
                                            size="is-medium"
                                            v-model="selectedCountry">
                                            <option :value="country.id" :key="country.id" v-for="country in allCountryList">{{country.name}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        <div class="field">
                            <div class="level">
                                <div class="level-left">
                                </div>
                                <div class="level-right">
                                    <b-button type="submit is-primary" @click="passes(next)">{{$t('next')}}</b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
                <ValidationObserver ref="observer1" v-slot="{ passes }" v-if="state==1">
                    <div>
                        <div class="field">
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider rules="required|alpha_dash" name="FirstName" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="user" v-model="firstName"
                                                type="text" name="firstName" :placeholder="$t('first-name')">
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider rules="required|alpha_dash" name="LastName" v-slot="{ errors, valid }">
                                        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                            <b-input size="is-medium" icon-pack="fa" icon="user" v-model="lastName"
                                                type="text" name="lastName" :placeholder="$t('last-name')">
                                            </b-input>
                                        </b-field>
                                    </ValidationProvider>
                                </p>
                            </div>
                        </div>
                        <div class="field">
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <ValidationProvider vid="password" rules="required|confirmed:confirmation" name="Password" v-slot="{ errors, valid }">
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
                                    <ValidationProvider vid="confirmation" rules="required|confirmed:password" name="PasswordConfirmation" v-slot="{ errors, valid }">
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
                                    <b-button type="submit is-primary" @click="passes(next)">{{$t('next')}}</b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
                <ValidationObserver ref="observer2" v-slot="{ passes }" v-if="state==2">
                    <div>
                        <div class="field">
                            <p class="control has-icons-left has-icons-right">
                                <ValidationProvider :rules="{required: {}}" name="Username" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" >
                                        <b-input size="is-medium" icon-pack="fa" icon="user" v-model="username"
                                            type="text" name="username" :placeholder="$t('user-name')">
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        
                        <div class="field">
                            <ValidationProvider :rules="{ required: { allowFalse: true } }" name="News" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                    <b-checkbox :value="false" v-model="news">
                                        {{$t('email-offer-label')}}
                                    </b-checkbox>
                                </b-field>
                            </ValidationProvider>
                        </div>
                        <div class="field">
                            <ValidationProvider :rules="{ required: { allowFalse: false } }" name="Politics" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                    <b-checkbox :value="false" v-model="politics">
                                        {{$t('read-accept-label')}} <router-link to="" class="has-text-primary">{{$t('privacy')}}</router-link>
                                    </b-checkbox>
                                </b-field>
                            </ValidationProvider>
                        </div>
                        <div class="field">By Clicking on «Create», I agree to the <a @click="showPrivacyPolicy" class="has-text-primary">Evorine End User License Agreement</a> and <router-link to="" class="has-text-primary">Anti-cheating Agreement</router-link>.
                        </div>
                        
                        <div class="field">
                            <div class="level">
                                <div class="level-left">
                                    <b-button type="submit is-dark" @click="back">{{$t('back')}}</b-button>
                                </div>
                                <div class="level-right">
                                    <b-button type="submit is-primary" @click="passes(test)">{{$t('create')}}</b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ValidationObserver>
            </div>
            <div class="links">
                <router-link to="login" class="has-text-white">{{$t('already-registered')}} <router-link to="login" class="has-text-primary">{{$t('sign-in')}}</router-link>.</router-link>
            </div>
            
        </div>
        <b-modal :width="1200" :active.sync="isPrivacyPolicyModalActive" class="popup-install">
            <PrivacyPolicy/>
        </b-modal>
    </section>
</template>
<script>
    import { authenticationService, notificationManager } from '@/services/services'
    import { ValidationObserver, ValidationProvider } from "vee-validate";
    import { ErrorBag } from 'vee-validate';
    import { countries } from 'countries-list';
    import * as VeeValidate from 'vee-validate';
    import PrivacyPolicy from './PrivacyPolicy.vue'

    export default {
        data() {
            return {
                username: null,
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                passwordConfirmation: null,
                selectedCountry: null,
                allCountryList: [],
				selectedDay: null,
				selectedMonth: null,
                selectedYear: null,
                yearRange: [],
                politics: true,
                news: false,
                isPrivacyPolicyModalActive: false,
                state: 0
            }
        },
        components: {
            ValidationObserver,
            ValidationProvider,
            PrivacyPolicy
        },
        methods: {
            goToLogin: function(){
                this.$router.push({ name: "login" });
            },
            next: function(){
                this.state++;
            },
            back: function(){
                this.state--;
            },
            test: async function() {
                var isSignUp = await authenticationService.AttemptSignUp({
                    username: this.username,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    country: this.selectedCountry,
                    email: this.email,
                    password: this.password,
                    birthday: new Date(this.selectedYear, this.selectedMonth-1, this.selectedDay, 10)
                });
                if(!isSignUp){
                    notificationManager.error("An error occured");
                }
                if(isSignUp.isSuccessfull) {
                    this.$router.push({ name: "login" });
                    notificationManager.notify("Account created succesfully !");
                }
                else{
                    if(isSignUp.isEmailTaken){
                        notificationManager.error("Email already taken");
                        this.email = null;
                        
                    }
                    if(isSignUp.isUsernameTaken){
                        notificationManager.error("Username already taken");
                        this.username = null;
                    }
                }
            },
            showPrivacyPolicy: function(){
                this.isPrivacyPolicyModalActive = true;
            }
        },
        mounted: async function() {
            this.allCountryList = Object.keys(countries).map(x => {return{"id": x, "name": countries[x].name}})

            for (var i = 2020; i >= 1900; i--) {
                this.yearRange.push(i);
            }
        }
    }
</script>