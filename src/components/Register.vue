<template>
	<section class="login-register is-fullheight">
		<div class="login-register-body">
			<div class="field-box">
				<img
					class="logo"
					src="../assets/images/Evorine-Logo.png"
				>
				<h1 class="login-register-heading">
					{{ $t('register') }}
				</h1>
				<!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
				<ValidationObserver
					v-if="state==0"
					ref="observer0"
					v-slot="{ passes }"
				>
					<div class="field">
						<div class="field">
							<p class="control has-icons-left has-icons-right">
								<ValidationProvider
									v-slot="{ errors, valid }"
									rules="required|email"
									name="Email"
								>
									<b-field
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
										:message="errors"
									>
										<b-input
											v-model="email"
											size="is-medium"
											icon-pack="fa"
											icon="envelope"
											type="email"
											name="email"
											:placeholder="$t('email')"
										/>
									</b-field>
								</ValidationProvider>
							</p>
						</div>
						<b-field grouped>
							<p class="control is-expanded">
								<ValidationProvider
									v-slot="{ errors, valid }"
									:rules="{required: {}}"
									name="SelectedDay"
								>
									<b-field
										:message="errors"
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
									>
										<b-select
											v-model="selectedDay"
											:placeholder="$t('day')"
											name="selectedDay"
											size="is-medium"
											expanded
										>
											<option
												v-for="day in 31"
												:key="day"
												:value="day"
											>
												{{ day }}
											</option>
										</b-select>
									</b-field>
								</ValidationProvider>
							</p>
							<p class="control is-expanded">
								<ValidationProvider
									v-slot="{ errors, valid }"
									:rules="{required: {}}"
									name="SelectedMonth"
								>
									<b-field
										:message="errors"
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
									>
										<b-select
											v-model="selectedMonth"
											:placeholder="$t('month')"
											name="selectedMonth"
											size="is-medium"
											expanded
										>
											<option
												v-for="month in 12"
												:key="month"
												:value="month"
											>
												{{ month }}
											</option>
										</b-select>
									</b-field>
								</ValidationProvider>
							</p>
							<p class="control is-expanded">
								<ValidationProvider
									v-slot="{ errors, valid }"
									:rules="{required: {}}"
									name="SelectedYear"
								>
									<b-field
										:message="errors"
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
										expanded
									>
										<b-select
											v-model="selectedYear"
											:placeholder="$t('year')"
											name="selectedYear"
											size="is-medium"
											expanded
										>
											<option
												v-for="year in yearRange"
												:key="year"
												:value="year"
											>
												{{ year }}
											</option>
										</b-select>
									</b-field>
								</ValidationProvider>
							</p>
						</b-field>
						<div
							v-if="allCountryList"
							class="field"
						>
							<p class="control has-icons-left has-icons-right">
								<ValidationProvider
									v-slot="{ errors, valid }"
									rules="required"
									name="SelectedCountry"
								>
									<b-field
										:message="errors"
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
									>
										<b-select
											v-model="selectedCountry"
											:placeholder="$t('country')"
											icon="globe"
											icon-pack="fas"
											name="selectedCountry"
											size="is-medium"
										>
											<option
												v-for="country in allCountryList"
												:key="country.id"
												:value="country.id"
											>
												{{ country.name }}
											</option>
										</b-select>
									</b-field>
								</ValidationProvider>
							</p>
						</div>
						<div class="field">
							<div class="level">
								<div class="level-left" />
								<div class="level-right">
									<b-button
										type="submit is-primary"
										@click="passes(next)"
									>
										{{ $t('next') }}
									</b-button>
								</div>
							</div>
						</div>
					</div>
				</ValidationObserver>
				<ValidationObserver
					v-if="state==1"
					ref="observer1"
					v-slot="{ passes }"
				>
					<div>
						<div class="field">
							<div class="field">
								<p class="control has-icons-left has-icons-right">
									<ValidationProvider
										v-slot="{ errors, valid }"
										rules="required|alpha_dash"
										name="FirstName"
									>
										<b-field
											:type="{ 'is-danger': errors[0], 'is-success': valid }"
											:message="errors"
										>
											<b-input
												v-model="firstName"
												size="is-medium"
												icon-pack="fa"
												icon="user"
												type="text"
												name="firstName"
												:placeholder="$t('first-name')"
											/>
										</b-field>
									</ValidationProvider>
								</p>
							</div>
							<div class="field">
								<p class="control has-icons-left has-icons-right">
									<ValidationProvider
										v-slot="{ errors, valid }"
										rules="required|alpha_dash"
										name="LastName"
									>
										<b-field
											:type="{ 'is-danger': errors[0], 'is-success': valid }"
											:message="errors"
										>
											<b-input
												v-model="lastName"
												size="is-medium"
												icon-pack="fa"
												icon="user"
												type="text"
												name="lastName"
												:placeholder="$t('last-name')"
											/>
										</b-field>
									</ValidationProvider>
								</p>
							</div>
						</div>
						<div class="field">
							<div class="field">
								<p class="control has-icons-left has-icons-right">
									<ValidationProvider
										v-slot="{ errors, valid }"
										vid="password"
										rules="required|confirmed:confirmation|min:6"
										name="Password"
									>
										<b-field
											:type="{ 'is-danger': errors[0], 'is-success': valid }"
											:message="errors"
										>
											<b-input
												v-model="password"
												size="is-medium"
												icon-pack="fa"
												icon="lock"
												type="password"
												name="password"
												:placeholder="$t('password')"
												password-reveal
												required
											/>
										</b-field>
									</ValidationProvider>
								</p>
							</div>
							<div class="field">
								<p class="control has-icons-left has-icons-right">
									<ValidationProvider
										v-slot="{ errors, valid }"
										vid="confirmation"
										rules="required|confirmed:password|min:6"
										name="PasswordConfirmation"
									>
										<b-field
											:type="{ 'is-danger': errors[0], 'is-success': valid }"
											:message="errors"
										>
											<b-input
												v-model="passwordConfirmation"
												size="is-medium"
												icon-pack="fa"
												icon="lock"
												type="password"
												name="passwordConfirmation"
												:placeholder="$t('password-confirmation')"
												password-reveal
												required
											/>
										</b-field>
									</ValidationProvider>
								</p>
							</div>
						</div>
						<div class="field">
							<div class="level">
								<div class="level-left">
									<b-button
										type="submit is-dark"
										@click="back"
									>
										{{ $t('back') }}
									</b-button>
								</div>
								<div class="level-right">
									<b-button
										type="submit is-primary"
										@click="passes(next)"
									>
										{{ $t('next') }}
									</b-button>
								</div>
							</div>
						</div>
					</div>
				</ValidationObserver>
				<ValidationObserver
					v-if="state==2"
					ref="observer2"
					v-slot="{ passes }"
				>
					<div>
						<div class="field">
							<p class="control has-icons-left has-icons-right">
								<ValidationProvider
									v-slot="{ errors, valid }"
									:rules="{required: {}}"
									name="Username"
								>
									<b-field :type="{ 'is-danger': errors[0], 'is-success': valid }">
										<b-input
											v-model="username"
											size="is-medium"
											icon-pack="fa"
											icon="user"
											type="text"
											name="username"
											:placeholder="$t('user-name')"
										/>
										<p class="control">
											<b-button
												size="is-medium"
												class="button is-primary"
												@click="generateUsername()"
											>
												{{ $t('generate') }}
											</b-button>
										</p>
									</b-field>
								</ValidationProvider>
							</p>
						</div>

						<div class="field">
							<ValidationProvider
								v-slot="{ errors, valid }"
								:rules="{ required: { allowFalse: true } }"
								name="News"
							>
								<b-tooltip
									:label="$t('not-implemented-feature')"
									position="is-right"
								>
									<b-field
										:type="{ 'is-danger': errors[0], 'is-success': valid }"
										:message="errors"
									>
										<b-checkbox
											v-model="news"
											:value="false"
										>
											{{ $t('email-offer-label') }}
										</b-checkbox>
									</b-field>
								</b-tooltip>
							</ValidationProvider>
						</div>
						<div class="field">
							<ValidationProvider
								v-slot="{ errors, valid }"
								:rules="{ required: { allowFalse: false } }"
								name="Politics"
							>
								<b-field
									:type="{ 'is-danger': errors[0], 'is-success': valid }"
									:message="errors"
								>
									<b-checkbox
										v-model="politics"
										:value="false"
									>
										{{ $t('read-accept-label') }} <a
											class="has-text-primary"
											@click="showPrivacyPolicy"
										>{{ $t('privacy') }}</a>
									</b-checkbox>
								</b-field>
							</ValidationProvider>
						</div>
						<!--
                        <div class="field">By Clicking on «Create», I agree to the <a @click="showPrivacyPolicy" class="has-text-primary">Evorine End User License Agreement</a> and <router-link to="" class="has-text-primary">Anti-cheating Agreement</router-link>.
                        </div>
                        -->
						<div class="field">
							<div class="level">
								<div class="level-left">
									<b-button
										type="submit is-dark"
										@click="back"
									>
										{{ $t('back') }}
									</b-button>
								</div>
								<div class="level-right">
									<b-button
										type="submit is-primary"
										@click="passes(test)"
									>
										{{ $t('create') }}
									</b-button>
								</div>
							</div>
						</div>
					</div>
				</ValidationObserver>
			</div>
			<div class="links">
				<router-link
					to="login"
					class="has-text-white"
				>
					{{ $t('already-registered') }}
					<router-link
						to="login"
						class="has-text-primary"
					>
						{{ $t('sign-in') }}
					</router-link>.
				</router-link>
			</div>
		</div>
		<b-modal
			:width="1200"
			:active.sync="isPrivacyPolicyModalActive"
			class="popup-install"
		>
			<PrivacyPolicy />
		</b-modal>
	</section>
</template>

<script>
import {
    authenticationService,
    notificationManager
} from '@/services/services'
import {
    ValidationObserver,
    ValidationProvider
} from "vee-validate";
import {
    countries
} from 'countries-list';
import PrivacyPolicy from './PrivacyPolicy.vue'
import UserNameGenerator from '@/services/UserNameGenerator';
export default {
    components: {
        ValidationObserver,
        ValidationProvider,
        PrivacyPolicy
    },
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
    mounted: async function () {
        this.allCountryList = Object.keys(countries).map(x => {
            return {
                "id": x,
                "name": countries[x].name
            }
        })

        for (var i = 2020; i >= 1900; i--) {
            this.yearRange.push(i);
        }
    },
    methods: {
        goToLogin: function () {
            this.$router.push({
                name: "login"
            });
        },
        next: function () {
            this.state++;
        },
        back: function () {
            this.state--;
        },
        test: async function () {
            var isSignUp = await authenticationService.AttemptSignUp({
                username: this.username,
                firstName: this.firstName,
                lastName: this.lastName,
                country: this.selectedCountry,
                email: this.email,
                password: this.password,
                birthday: new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay, 10)
            });
            if (!isSignUp) {
                notificationManager.error(this.$t('error-occured'));
            }
            if (isSignUp.isSuccessfull) {
                this.$router.push({
                    name: "login"
                });
                notificationManager.success(this.$t('account-created-succesfully'));
            } else {
                if (isSignUp.isEmailTaken) {
                    notificationManager.error(this.$t('email-already-taken'));
                    this.email = null;

                }
                if (isSignUp.isUsernameTaken) {
                    notificationManager.error(this.$t('username-already-taken'));
                    this.username = null;
                }
            }
        },
        showPrivacyPolicy: function () {
            this.isPrivacyPolicyModalActive = true;
        },
        generateUsername: function () {
            this.username = UserNameGenerator.generateUsername();
        },
    }
}
</script>
