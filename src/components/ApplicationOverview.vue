<template>
	<div
		v-if="activeApplication"
		class="details"
	>
		<div
			v-if="!installation"
			class="details-not-installed"
		>
			<div class="columns">
				<div class="column details-not-installed-left">
					<div class="details-logo">
						<figure class="image is-64x64">
							<img src="https://bulma.io/images/placeholders/128x128.png">
						</figure>
						<h1>{{ activeApplication.name }}</h1>
					</div>
					<div class="details-info">
						<p>{{ activeApplication.description }}</p>
					</div>
				</div>
				<div class="column-is-fixed is-17 is-relative column details-not-installed-right">
					<div>
						<h1>{{ $t('release-date') }}</h1>
						<p>XX/XX/XXXX</p>
					</div>
					<div>
						<h1>{{ $t('platforms') }}</h1>
						<PlatformLabel
							v-for="platform in activeApplication.platforms"
							:key="platform.operatingSystem"
							:operating-system="platform.operatingSystem"
						/>
					</div>
				</div>
			</div>
		</div>
		<div
			v-if="installation"
			class="details-installed"
		>
			<NewsZone :application-id="activeApplication.applicationId" />
		</div>
	</div>
</template>

<script>
import NewsZone from './News/NewsZone.vue';
import PlatformLabel from './PlatformLabel.vue';
import {
    applicationLibrary,
    installationManager
} from '@/services/services';
export default {
    components: {
        NewsZone,
        PlatformLabel
    },
    props: {
        applicationId: null
    },
    data() {
        return {}
    },
    computed: {
        installation: function () {
            if (!this.applicationId) {
                return null;
            }
            let ins = installationManager.getInstallationInfo(this.applicationId);
            return ins;
        },
    },
    asyncComputed: {
        activeApplication: async function () {
            if (!this.applicationId) {
                return null;
            }
            return await applicationLibrary.getGameFromId(this.applicationId);
        }
    }
};
</script>
