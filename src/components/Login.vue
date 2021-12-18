<template>
	<section class="login-register is-fullheight">
		<div class="login-register-body">
			<div class="field-box">
				<img
					class="logo"
					src="../assets/images/Evorine-Logo.png"
				>
				<div class="lang-dropdown">
					<select v-model="$i18n.locale">
						<option
							v-for="(lang, i) in languageArray"
							:key="`lang${i}`"
							:value="lang"
						>
							{{ lang }}
						</option>
					</select>
				</div>
				<h1 class="login-register-heading">
					{{ $t('sign-in') }}
				</h1>
				<!--<p class="login-subheading">We don't need a healer for this, right?</p>-->
				<ValidationObserver
					ref="observer"
					v-slot="{ passes }"
				>
					<div class="field">
						<p class="control has-icons-left has-icons-right">
							<ValidationProvider
								v-slot="{ errors, valid }"
								rules="required|email"
								name="Email"
							>
								<b-skeleton
									height="2.8em"
									:active="loading"
								/>
								<b-field
									v-if="!loading"
									:type="{ 'is-danger': errors[0], 'is-success': valid }"
									:message="errors"
								>
									<b-input
										v-model="email"
										size="is-medium"
										icon-pack="fa"
										icon="envelope"
										:autofocus="true"
										type="email"
										name="email"
										:placeholder="$t('email')"
										@keyup.native.enter="passes(attemptSignIn)"
									/>
								</b-field>
							</ValidationProvider>
						</p>
					</div>
					<div class="field">
						<p class="control has-icons-left has-icons-right">
							<ValidationProvider
								v-slot="{ errors, valid }"
								rules="required"
								name="Password"
							>
								<b-skeleton
									height="2.8em"
									:active="loading"
								/>
								<b-field
									v-if="!loading"
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
										@keyup.native.enter="passes(attemptSignIn)"
									/>
								</b-field>
							</ValidationProvider>
						</p>
					</div>
					<div class="field">
						<div class="level">
							<a class="level-item">
								<b-skeleton :active="loading" />
							</a>
							<b-checkbox
								v-if="!loading"
								v-model="staySignedIn"
								:value="false"
							>
								{{ $t('stay-signed-in') }}
							</b-checkbox>
						</div>
					</div>
					<div class="field">
						<div class="level">
							<div />
							<div class="level-right">
								<b-button
									type="submit is-primary"
									@click="passes(attemptSignIn)"
								>
									{{ $t('sign-in') }}
								</b-button>
							</div>
						</div>
					</div>
				</ValidationObserver>
			</div>
			<div class="links">
				<router-link
					to="register"
					class="has-text-white"
				>
					{{ $t('new-user-create-label') }}
					<router-link
						to="register"
						class="has-text-primary"
					>
						{{ $t('register') }}
					</router-link>.
				</router-link>
				<b-tooltip
					:label="$t('not-implemented-feature')"
					position="is-right"
				>
					<router-link
						to="forgotpassword"
						class="has-text-white"
					>
						{{ $t('forgot-password-reset-label') }}
						<router-link
							to="forgotpassword"
							class="has-text-primary"
						>
							{{ $t('reset-password') }}
						</router-link>.
					</router-link>
				</b-tooltip>
			</div>
		</div>
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

export default {
    components: {
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            email: "",
            password: "",
            staySignedIn: false,
            languageArray: ['en', 'fr'],
            loading: false
        }
    },
    mounted: async function () {
        if (authenticationService.IsSignedIn()) {
            this.$router.push({
                name: "launcher"
            });
        }
    },
    methods: {
        attemptSignIn: async function () {
            var isLogged = await authenticationService.AttemptSignIn({
                email: this.email,
                password: this.password,
                staySignedIn: this.staySignedIn
            });
            if (isLogged) {
                this.$router.push({
                    name: "launcher"
                });
            } else {
                notificationManager.error("Login failed! Email or password does not match!");
            }
        }
    }
}
</script>
