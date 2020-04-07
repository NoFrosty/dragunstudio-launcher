<template>
    <div class="details" v-if="activeApplication">
        <div class="details-not-installed" v-if="!installation">
            <div class="columns">
                <div class="column details-not-installed-left">
                    <div class="details-logo">
                        <figure class="image is-64x64">
                            <img src="https://bulma.io/images/placeholders/128x128.png">
                        </figure>
                        <h1>{{activeApplication.name}}</h1>
                    </div>
                    <div class="details-info">
                        <h1>What is {{activeApplication.name}}</h1>
                        <p>{{activeApplication.description}}</p>
                    </div>
                </div>
                <div class="column-is-fixed is-17 is-relative column details-not-installed-right">
                    <div>
                        <h1>Release Date</h1>
                        <p>01/01/2020</p>
                    </div>
                    <div>
                        <h1>Plateformes</h1>
                        <PlatformLabel v-for="platform in activeApplication.platforms" :key="platform.operatingSystem" :operating-system="platform.operatingSystem" />
                    </div>
                </div>
            </div>
        </div>
        <div class="details-installed" v-if="installation">
            <NewsZone :applicationId="activeApplication.applicationId" />
        </div>
    </div>
</template>

<script>
    import NewsZone from './News/NewsZone.vue';
    import PlatformLabel from './PlatformLabel.vue';
    import { applicationLibrary, installationManager } from '@/services/services';
    export default {
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
        },
        components: {
            NewsZone,
            PlatformLabel
        }
    };
</script>