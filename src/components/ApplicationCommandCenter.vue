<template>
    <div class="application-command-center level-item">
        <div class="version" v-if="installation">
            Version: {{installation.version}}
        </div>

        <DropDownGameMode class="" v-model="gameMode" />

        <b-dropdown aria-role="list" position="is-bottom-left" v-if="installation">
            <button class="button is-dark is-auto" slot="trigger">
                <b-icon pack="fas" icon="cog"></b-icon>
            </button>
            <b-dropdown-item aria-role="listitem" @click="checkForUpdates">Check for updates</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="openFileExplorer">Open in explorer</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="openSettingsPanel">Settings</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Repair</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="uninstallApplication">Uninstall</b-dropdown-item>
        </b-dropdown>

        <b-button size="is-large" class="action-button is-primary" @click="startInstallation" v-if="!installation">INSTALL</b-button>
        <b-button size="is-large" class="action-button is-primary" v-if="installation">PLAY</b-button>

        <div>
            <b-modal :active.sync="isInstallModalActive" class="popup-install" v-if="activeApplication">
                <Install :application="activeApplication" v-on:start="onStartInstall" />
            </b-modal>
        </div>
    </div>
</template>

<script>
import humanize from 'humanize'
import DropDownGameMode from './DropDownGameMode.vue';
import Install from './Install.vue'
import { InstallationActionType } from '@/models/ApplicationStatus'
import {shell} from 'electron'
import {
    GAME_MODE
} from '@/services/constants.ts'
import { applicationLibrary, installationManager, eventBus, notificationManager } from '@/services/services'

export default {
    props: {
        applicationId: null
    },
    data() {
        return {
            isInstallModalActive: false,
            gameMode: GAME_MODE.PUBLIC,
            installationProgress: {
                percentage: 0,
                totalReceived: null,
                totalToReceive: null
            }
        }
    },
    computed: {
        installation: function() {
            if (!this.applicationId) {
                return null;
            }
            let ins = installationManager.getInstallationInfo(this.applicationId);
            return ins;
        }
    },
    asyncComputed: {
        activeApplication: async function() {
            if (!this.applicationId) {
                return null;
            }
            return await applicationLibrary.getGameFromId(this.applicationId);
        }
    },
    methods: {
        startInstallation() {
            this.isInstallModalActive = true;
        },
        onStartInstall(installData) {
            installationManager.installApplicationMultiThread(
                this.applicationId,
                installData.path,
                this.onProgress
            );
            this.$store.commit('setApplicationInstallationActionType', { applicationId: this.applicationId, actionType: InstallationActionType.Update });
        },
        onProgress(progress) {
            if (progress.downloadedCount == progress.totalFileCount) {
                eventBus.emitter.emit("on-update-finish", progress);
                this.$store.commit('setApplicationInstallationActionType', { applicationId: this.applicationId, actionType: InstallationActionType.NoAction });
            }
            else {
                eventBus.emitter.emit("on-update-progress", progress);
            }

            if(progress){
                this.installationProgress.percentage = progress.downloadedSize / progress.totalFileSize * 100;
                this.installationProgress.totalReceived = humanize.filesize(progress.downloadedSize);
                this.installationProgress.totalToReceive = humanize.filesize(progress.totalFileSize);
            }
        },
        async uninstallApplication(){
            if(await notificationManager.confirm("Are you sure you want to <b>uninstall</b> this application? This action cannot be undone.")){
                installationManager.uninstallApplication(this.applicationId)
            }
        },
        async checkForUpdates(){
            this.updateAvailable = await installationManager.checkUpdateAvailable(this.applicationId);
        },
        openFileExplorer(){
            shell.openItem(installationManager.getInstallationInfo(this.applicationId).path);
        },
        openSettingsPanel(){
            shell.beep();
        }
    },
    components: {
        DropDownGameMode,
        Install
    }
};
</script>