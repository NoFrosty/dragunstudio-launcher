<template>
    <div>
        <div class="right-column-install" v-if="installation">
            <ApplicationUpdateProgress v-if="isUpdating" />
            <b-field grouped>
                <b-dropdown class="is-up" aria-role="list" position="is-bottom-left" v-if="installation">
                    <button class="button is-dark is-auto is-medium" slot="trigger">
                        <b-icon pack="fas" icon="cog"></b-icon>
                    </button>
                    <b-dropdown-item aria-role="listitem" @click="checkForUpdates">Check for updates
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="openFileExplorer">Open in explorer
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="openSettingsPanel">Settings</b-dropdown-item>
                    <b-dropdown-item aria-role="listitem">Repair</b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="uninstallApplication">Uninstall
                    </b-dropdown-item>
                </b-dropdown>
                <DropDownGameMode class="" v-model="gameMode" />
            </b-field>
            
            <b-tooltip position="is-left" :label="installation.version" :active="true" :delay="2500" animated>
            <b-button type="is-primary is-large" v-if="!isUpdating && !updateAvailable" expanded>Play Now</b-button>
            <b-button type="is-primary is-large" v-if="isUpdating && !updateAvailable" disabled expanded>Play Now</b-button>
            <b-button type="is-primary is-large" v-if="updateAvailable" @click="updateApplication" expanded>Update</b-button>
            </b-tooltip>

            <!--<b-button type="is-primary is-large" v-if="!isUpdating" expanded>Update</b-button>-->
        </div>
        <div class="right-column-install" v-else>
            <b-button type="is-primary is-large" @click="startInstallation">Install/Buy</b-button>
        </div>
        <b-modal :width="900" :active.sync="isInstallModalActive" class="popup-install" :can-cancel="false"
            v-if="activeApplication">
            <Install :application="activeApplication" v-on:start="onStartInstall" />
        </b-modal>
    </div>
</template>

<script>
    const GAME_TABS = {
        OVERVIEW: 0,
        ACTIVITIES: 1,
        ACHIEVEMENTS: 2
    };
    import humanize from 'humanize'

    import DropDownGameMode from './DropDownGameMode.vue';
    import ApplicationUpdateProgress from '@/components/ApplicationUpdateProgress.vue';
    import Install from './Install.vue'
 
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
        name: "evopeons-launcher",
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
        mounted() {
            if(this.installation)
                this.updateAvailable = this.checkForUpdates();
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
        methods: {
            updateApplication(){
                installationManager.updateApplication(this.activeApplicationId, this.onProgress);
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
        components: {
            DropDownGameMode,
            ApplicationUpdateProgress,
            Install
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