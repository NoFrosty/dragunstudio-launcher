<template>
	<b-dropdown aria-role="list">
		<button
			slot="trigger"
			class="button is-fullwidth is-primary user-box online"
		>
			<div class="nav-profile-image">
				<figure class="image">
					<img
						class="is-rounded avatar"
						src="http://www.bootstrapdash.com/demo/purple/jquery/template/assets/images/faces/face1.jpg"
						alt="profile"
					>
				</figure>
				<span class="login-status" />
			</div>
			<div class="nav-profile-text">
				<span class="nav-profile-text-name">{{ this.$store.state.username }}</span>
				<!--<span class="nav-profile-text-status">Playing Warcraft IV</span>-->
			</div>
			<i class="mdi mdi-bookmark-check text-success nav-profile-badge" />
		</button>
		<b-dropdown-item
			v-if="isOffline"
			value="settings"
			@click="goOnline"
		>
			<b-icon
				pack="fas"
				icon="plug"
			/>
			{{ $t('go-online') }}
		</b-dropdown-item>

		<b-dropdown-item
			value="settings"
			@click="openSettings"
		>
			<b-tooltip
				:label="$t('not-implemented-feature')"
				position="is-left"
			>
				<b-icon
					pack="fas"
					icon="cog"
				/>
				{{ $t('settings') }}
			</b-tooltip>
		</b-dropdown-item>

		<b-dropdown-item
			value="accountsSettings"
			@click="openAccountSettings"
		>
			<b-tooltip
				:label="$t('not-implemented-feature')"
				position="is-left"
			>
				<b-icon
					pack="fas"
					icon="cog"
				/>
				{{ $t('account-settings') }}
			</b-tooltip>
		</b-dropdown-item>

		<b-dropdown-item
			value="logout"
			aria-role="menuitem"
			@click="logout"
		>
			<b-icon
				pack="fas"
				icon="sign-out-alt"
			/>
			{{ $t('logout') }}
		</b-dropdown-item>
	</b-dropdown>
</template>

<script>
import {
    authenticationService
} from '@/services/services'
import {
    eventBus
} from '@/services/services'
export default {
    data() {
        return {}
    },
    computed: {
        isSignedIn: function () {
            return this.$store.state.isSignedIn;
        },
        isOffline: function () {
            return this.$store.state.isOffline;
        }
    },
    methods: {
        logout: async function () {
            await authenticationService.SignOut();
        },
        goOnline: async function () {
            this.$router.push({
                name: "boot"
            })
        },
        openSettings() {
            eventBus.emitter.emit("on-settings-open");
        },
        openAccountSettings() {
            eventBus.emitter.emit("on-accountsettings-open");
        },
    }
}
</script>
