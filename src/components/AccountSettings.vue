<template>
	<div class="popup popup-account-settings">
		<a
			class="modal-close-btn"
			@click="$parent.close()"
		>
			<b-icon
				pack="fas"
				icon="times"
				size="is-small"
				type="is-white"
			/>
		</a>
		<div class="tile is-ancestor account-settings">
			<div class="tile is-vertical">
				<div class="tile">
					<div class="tile is-parent is-vertical">
						<article class="tile is-child notification">
							<p class="title">
								{{ $t('account-settings') }}
							</p>
							<p class="subtitle">
								Resume
							</p>
						</article>
						<article class="tile is-child notification">
							<p class="title">
								Security
							</p>
							<p class="subtitle">
								Two Factor Authenticator
							</p>
							<p class="subtitle">
								Email Verification
							</p>
							<p class="subtitle">
								Phone Number Verification
							</p>
							<p class="subtitle">
								Change Password
							</p>
						</article>
					</div>
					<div class="tile is-parent">
						<article class="tile is-child notification">
							<p class="title">
								Your informations
							</p>
							<div class="content">
								<b-field
									:label="$t('email')"
									:label-position="labelPosition"
								>
									<b-input
										icon="envelope"
										value="john@doe.com"
									/>
								</b-field>
								<b-field
									:label="$t('user-name')"
									:label-position="labelPosition"
								>
									<b-input
										icon="user"
										value="JohnyDoe"
									/>
								</b-field>
								<b-field
									:label="$t('first-name')"
									:label-position="labelPosition"
								>
									<b-input
										icon="address-book"
										value="John"
									/>
								</b-field>
								<b-field
									:label="$t('last-name')"
									:label-position="labelPosition"
								>
									<b-input
										icon="address-book"
										value="Doe"
									/>
								</b-field>
								<b-field
									:label="$t('birthday')"
									:label-position="labelPosition"
								>
									<b-datepicker
										placeholder="Click to select..."
										icon="calendar-day"
										trap-focus
									/>
								</b-field>
								<b-field
									:label="$t('phone-number')"
									:label-position="labelPosition"
								>
									<b-input
										icon="phone"
										value="+33 6 00 00 00 00"
									/>
								</b-field>
								<b-field
									:label="$t('address')"
									:label-position="labelPosition"
								>
									<b-input
										icon="map-marked-alt"
										value="404 Street of nowhere"
									/>
								</b-field>

								<b-field>
									<p class="control">
										<b-field
											:label="$t('post-code')"
											:label-position="labelPosition"
										>
											<b-input
												icon="mailbox"
												value="404512"
											/>
										</b-field>
									</p>
									<p class="control is-expanded">
										<b-field
											:label="$t('country')"
											:label-position="labelPosition"
											custom-class="is-expanded"
										>
											<b-select
												icon="globe-europe"
												placeholder="Select a subject"
												class="is-expanded"
											>
												<option value="1">
													Unknown
												</option>
												<option value="2">
													France
												</option>
												<option value="2">
													Spain
												</option>
											</b-select>
										</b-field>
									</p>
								</b-field>
							</div>
							<b-button type="is-primary">
								{{ $t('update') }}
							</b-button>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            labelPosition: 'on-border'
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.tile {
    .button {
        float: right;
    }
}
</style>
