<template>
	<div>
		<div
			v-if="installation"
			class="right-column-install"
		>
			<ApplicationUpdateProgress v-if="isUpdating" />
			<b-field grouped>
				<b-dropdown
					v-if="installation"
					class="is-up"
					aria-role="list"
					position="is-bottom-left"
				>
					<button
						slot="trigger"
						class="button is-dark is-auto is-medium"
					>
						<b-icon
							pack="fas"
							icon="cog"
						/>
					</button>
					<b-dropdown-item
						aria-role="listitem"
						@click="checkForUpdates"
					>
						{{ $t('check-for-updates') }}
					</b-dropdown-item>
					<b-dropdown-item
						aria-role="listitem"
						@click="openFileExplorer"
					>
						{{ $t('show-in-explorer') }}
					</b-dropdown-item>
					<b-dropdown-item
						aria-role="listitem"
						@click="openSettingsPanel"
					>
						{{ $t('settings') }}
					</b-dropdown-item>
					<b-dropdown-item aria-role="listitem">
						{{ $t('repair') }}
					</b-dropdown-item>
					<b-dropdown-item
						aria-role="listitem"
						@click="uninstallApplication"
					>
						{{ $t('uninstall') }}
					</b-dropdown-item>
				</b-dropdown>
				<DropDownGameMode
					v-model="gameMode"
					class=""
				/>
			</b-field>

			<b-tooltip
				position="is-left"
				:label="installation.version"
				:active="true"
				:delay="2500"
				animated
			>
				<b-button
					v-if="!isUpdating && !updateAvailable"
					type="is-primary is-large"
					expanded
					@click="launchGame"
				>
					{{ $t('play') }}
				</b-button>
				<b-button
					v-if="isUpdating && !updateAvailable"
					type="is-primary is-large"
					disabled
					expanded
				>
					{{ $t('play') }}
				</b-button>
				<b-button
					v-if="updateAvailable"
					type="is-primary is-large"
					expanded
					@click="updateApplication"
				>
					{{ $t('update') }}
				</b-button>
			</b-tooltip>

			<!--<b-button type="is-primary is-large" v-if="!isUpdating" expanded>Update</b-button>-->
		</div>
		<div
			v-else
			class="right-column-install"
		>
			<b-button
				type="is-primary is-large"
				@click="startInstallation"
			>
				{{ $t('install') }}/Buy
			</b-button>
		</div>
		<b-modal
			v-if="activeApplication"
			:width="900"
			:active.sync="isInstallModalActive"
			class="popup-install"
			:can-cancel="false"
		>
			<Install
				:application="activeApplication"
				@start="onStartInstall"
			/>
		</b-modal>
	</div>
</template>

<script>
import humanize from 'humanize'
import {
    ipcRenderer,
} from 'electron'
import DropDownGameMode from './DropDownGameMode.vue';
import ApplicationUpdateProgress from '@/components/ApplicationUpdateProgress.vue';
import Install from './Install.vue'
const path = require('path');
import {
    shell
} from 'electron'
import {
    GAME_MODE
} from '@/services/constants.ts'
import {
    InstallationActionType
} from '@/models/ApplicationStatus'
import {
    applicationLibrary,
    installationManager,
    eventBus,
    notificationManager
} from '@/services/services'

export default {
    name: "EvopeonsLauncher",
    components: {
        DropDownGameMode,
        ApplicationUpdateProgress,
        Install
    },
    data() {
        return {
            isInstallModalActive: false,
            gameMode: GAME_MODE.PUBLIC,
            applicationId: null,
            installationProgress: {
                percentage: 0,
                totalReceived: null,
                totalToReceive: null
            },
            updateAvailable: false
        };
    },
    computed: {
        activeApplicationId: function () {
            return this.$store.state.selectedApplicationId;
        },
        installation: function () {
            if (!this.activeApplicationId) {
                return null;
            }
            let ins = installationManager.getInstallationInfo(this.activeApplicationId);
            return ins;
        },
        isUpdating() {
            let status = this.$store.state.applicationStatuses.find(x => x.applicationId == this
                .activeApplicationId);
            if (status) {
                return status.currentActionType == InstallationActionType.Update;
            }
            return false;
        }
    },
    mounted() {
        if (this.installation)
            this.updateAvailable = this.checkForUpdates();
    },
    methods: {
        updateApplication() {
            installationManager.updateApplication(this.activeApplicationId, this.onProgress);
        },
        launchGame() {
            let pathExe = path.join(installationManager.getInstallationInfo(this.activeApplicationId).path, applicationLibrary.getGameExecutionPath(this.activeApplicationId));

            ipcRenderer.send("launch-application", pathExe);
        },
        startInstallation() {
            this.isInstallModalActive = true;
        },
        onStartInstall(installData) {
            installationManager.installApplicationMultiThread(
                this.activeApplicationId,
                installData.path,
                this.onProgress
            );
            this.$store.commit('setApplicationInstallationActionType', {
                applicationId: this.activeApplicationId,
                actionType: InstallationActionType.Update
            });
        },
        onProgress(progress) {
            if (progress.downloadedCount == progress.totalFileCount) {
                eventBus.emitter.emit("on-update-finish", progress);
                this.$store.commit('setApplicationInstallationActionType', {
                    applicationId: this.activeApplicationId,
                    actionType: InstallationActionType.NoAction
                });
                this.updateAvailable = false;
            } else {
                eventBus.emitter.emit("on-update-progress", progress);
            }

            if (progress) {
                this.installationProgress.percentage = progress.downloadedSize / progress.totalFileSize * 100;
                this.installationProgress.totalReceived = humanize.filesize(progress.downloadedSize);
                this.installationProgress.totalToReceive = humanize.filesize(progress.totalFileSize);
            }
        },
        async uninstallApplication() {
            if (await notificationManager.confirm(
                    "Are you sure you want to <b>uninstall</b> this application? This action cannot be undone."
                )) {
                installationManager.uninstallApplication(this.activeApplicationId)
            }
        },
        async checkForUpdates() {
            this.updateAvailable = await installationManager.checkUpdateAvailable(this.activeApplicationId);
        },
        openFileExplorer() {
            shell.showItemInFolder(installationManager.getInstallationInfo(this.activeApplicationId).path);
        },
        openSettingsPanel() {
            shell.beep();
        }
    },
    asyncComputed: {
        activeApplication: async function () {
            if (!this.activeApplicationId) {
                return null;
            }
            return await applicationLibrary.getGameFromId(this.activeApplicationId);
        }
    },
};
</script>
