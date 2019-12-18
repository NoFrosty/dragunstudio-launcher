<template>
    <ValidationObserver class="register is-fullheight" ref="observer" v-slot="{ passes }">
        <div class="register-body">
            <div class="field-box">
                
                    <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <ValidationProvider :rules="{required: {}}" name="Username" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" >
                                    <b-input size="is-medium" icon-pack="fa" icon="user" v-model="username"
                                        type="text" name="username" placeholder="User Name">
                                    </b-input>
                                </b-field>
                            </ValidationProvider>
                        </p>
                    </div>
                    <div class="field field-body">
                        <div class="field">
                            <p class="control has-icons-left has-icons-right">
                                <ValidationProvider rules="required|alpha" name="FirstName" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                        <b-input size="is-medium" icon-pack="fa" icon="user" v-model="firstName"
                                            type="text" name="firstName" placeholder="First Name">
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control has-icons-left has-icons-right">
                                <ValidationProvider rules="required|alpha" name="LastName" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                        <b-input size="is-medium" icon-pack="fa" icon="user" v-model="lastName"
                                            type="text" name="lastName" placeholder="Last Name">
                                        </b-input>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                    </div>
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
                    <div class="field field-body">
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
                    
                    <div class="field field-body">
                        <!--
                        <div class="field">
                            <p class="control has-icons-left has-icons-right">
                                <ValidationProvider :rules="{required: {}}" name="BirthDate" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                        <b-datepicker
                                            v-model="birthDate"
                                            placeholder="Birth Date"
                                            icon-pack="fa"
                                            icon="calendar-plus"
                                            name="birthDate"
                                            editable>
                                        </b-datepicker>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        -->
                        <div class="field">
                            <p class="control">
                                <ValidationProvider :rules="{required: {}}" name="SelectedDay" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" >
                                        <b-select
                                            placeholder="Day"
                                            name="selectedDay"
                                            v-model="selectedDay">
                                            <option :value="day" :key="day" v-for="day in 31">{{day}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control">
                                <ValidationProvider :rules="{required: {}}" name="SelectedMonth" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                        <b-select
                                            placeholder="Month"
                                            name="selectedMonth"
                                            v-model="selectedMonth">
                                            <option :value="month" :key="month" v-for="month in 12">{{month}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                        <div class="field" v-if="yearRange">
                            <p class="control">
                                <ValidationProvider :rules="{required: {}}" name="SelectedYear" v-slot="{ errors, valid }">
                                    <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                        <b-select
                                            placeholder="Year"
                                            name="selectedYear"
                                            v-model="selectedYear">
                                            <option :value="year" :key="year" v-for="year in yearRange">{{year}}</option>
                                        </b-select>
                                    </b-field>
                                </ValidationProvider>
                            </p>
                        </div>
                    </div>
                    <div class="field" v-if="allCountryList">
                        <p class="control has-icons-left has-icons-right">
                            <ValidationProvider :rules="{required: {}}" name="SelectedCountry" v-slot="{ errors, valid }">
                                <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }">
                                    <b-select
                                        placeholder="Country"
                                        icon="globe"
                                        icon-pack="fas"
                                        name="selectedCountry"
                                        v-model="selectedCountry">
                                        <option :value="country" :key="country" v-for="country in allCountryList">{{country}}</option>
                                    </b-select>
                                </b-field>
                            </ValidationProvider>
                        </p>
                    </div>
                    <div class="field">
                        <ValidationProvider :rules="{ required: { allowFalse: false } }" name="Politics" v-slot="{ errors, valid }">
                            <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
                                <b-checkbox :value="false" v-model="politics">
                                    J’ai lu et j'accepte la <a>Politique de confidentialité.</a>
                                </b-checkbox>
                            </b-field>
                        </ValidationProvider>
                    </div>
                    <div class="field">
                        <div class="level">
                            <div class="level-left">
                                <b-button type="submit is-warning" @click="goToLogin()">Login</b-button>
                            </div>
                            <div class="level-right">
                                <b-button type="submit is-primary" @click="passes(Test)">Create</b-button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        <div class="register-body">
            <div class="field-box">
                <div class="">
                    <span class="title-colored">Evo</span>
                    <span class="title-white">Launcher</span>
                </div>
                <h1 class="register-heading">Welcome !</h1>
                <p class="register-subheading">Nice to see you join our ranks!</p>
            </div>
        </div>
    </ValidationObserver>
</template>
<script>
    import { authenticationService, notificationManager } from '@/services/services'
    import { ValidationObserver, ValidationProvider } from "vee-validate";
    import { ErrorBag } from 'vee-validate';
    const countryList = require('country-list');
    export default {
        data() {
            return {
                username: "Frosty",
                firstName: "Calvin",
                lastName: "Dogus",
                birthDate: null,
                email: "aze@feds.fesf",
                password: "PhoeniX96&",
                passwordConfirmation: "PhoeniX96&",
                selectedCountry: null,
                allCountryList: null,
				selectedDay: null,
				selectedMonth: null,
                selectedYear: null,
                yearRange: [],
                politics: false
            }
        },
        components: {
            ValidationObserver,
            ValidationProvider,
        },
        methods: {
            goToLogin: function(){
                this.$router.push({ name: "login" });
            },
            Test: async function() {
                var isSignUp = await authenticationService.AttemptSignUp({
                    username: this.username,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    country: this.selectedCountry,
                    email: this.email,
                    password: this.password,
                    birthday: new Date(this.selectedYear, this.selectedMonth, this.selectedDay)
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
        },
        mounted: async function() {
            this.allCountryList = countryList.getNames();
            for (var i = 1900; i <= 2020; i++) {
                this.yearRange.push(i);
            }
        }
    }
</script>