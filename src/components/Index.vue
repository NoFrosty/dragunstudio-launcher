<template>
	<div>
		<Navbar />
		<div class="columns">
			<div class="column left-column">
				<div class="left-column-alerts">
					<PatchFull
						v-if="article"
						class="patchzone"
						:article="article"
					/>
				</div>
				<ApplicationOverview
					v-if="!article"
					:application-id="activeApplicationId"
				/>
			</div>
			<div
				v-if="activeApplication"
				class="column column-is-fixed is-17 right-column"
			>
				<div class="nav-users">
					<UserPanel class="nav-users-profile" />
				</div>
				<ApplicationCommandCenter />
			</div>
		</div>
		<b-modal
			:width="900"
			:active.sync="isSettingsModalActive"
			class="popup-install"
			:can-cancel="false"
		>
			<Settings />
		</b-modal>
		<b-modal
			:width="1300"
			:active.sync="isAccountSettingsModalActive"
			class="popup-account-settings"
			:can-cancel="false"
		>
			<AccountSettings />
		</b-modal>
	</div>
</template>

<script>
import ApplicationOverview from "@/components/ApplicationOverview";
import ApplicationCommandCenter from "@/components/ApplicationCommandCenter";
import Navbar from "@/components/Navbar.vue";
import UserPanel from "@/components/UserPanel.vue";
import {
    applicationLibrary,
    eventBus
} from '@/services/services'
import PatchFull from './PatchFull.vue'
import Settings from './Settings.vue'
import AccountSettings from './AccountSettings.vue'
export default {
    name: "WarpLauncher",
    components: {
        Navbar,
        UserPanel,
        ApplicationOverview,
        ApplicationCommandCenter,
        PatchFull,
        Settings,
        AccountSettings
    },
    data() {
        return {
            article: null,
            isSettingsModalActive: false,
            isAccountSettingsModalActive: false,
        };
    },
    computed: {
        activeApplicationId: function () {
            return this.$store.state.selectedApplicationId;
        },
    },
    mounted: async function () {
        eventBus.subscribe('on-article-open', this.onArticleReceived);
        eventBus.subscribe('on-article-close', this.onArticleReceived);
        eventBus.subscribe('on-settings-open', this.openSettings);
        eventBus.subscribe('on-accountsettings-open', this.openAccountSettings);

    },
    methods: {
        onArticleReceived(article) {
            this.article = article
        },
        openSettings() {
            this.isSettingsModalActive = true;
        },
        openAccountSettings() {
            this.isAccountSettingsModalActive = true;
        },
    },
    asyncComputed: {
        activeApplication: async function () {
            if (!this.activeApplicationId) {
                let result = await applicationLibrary.getAllGameList();
                this.$store.commit('setSelectedApplicationId', result[0].applicationId);
            }
            return await applicationLibrary.getGameFromId(this.activeApplicationId);
        }
    },
};
</script>
