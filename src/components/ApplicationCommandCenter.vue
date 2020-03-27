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
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id efficitur lacus. Fusce
                            gravida tincidunt felis, eget congue sapien facilisis rutrum. Donec pretium metus eu massa
                            tempor ultrices. Integer sit amet nibh sapien. Vivamus quis lacinia lacus, quis fringilla
                            purus. Suspendisse dignissim scelerisque nisi, sed dictum magna. Vivamus nec dolor mollis,
                            facilisis enim at, tristique est.</p>
                    </div>
                </div>
                <div class="column-is-fixed is-17 is-relative column details-not-installed-right">
                    <div>
                        <h1>Release Date</h1>
                        <p>01/01/2020</p>
                    </div>
                    <div>
                        <h1>Plateforme</h1>
                        <p>{{compatiblePlatforme}}</p>
                    </div>
                    <b-button type="is-primary" @click="startInstallation">Install/Buy</b-button>
                </div>
            </div>
        </div>
        <div class="details-installed" v-if="installation">
            <div class="columns details-news">
                <div class="column-is-fixed is-23  column is-paddingless details-news-article" v-for="index in 5" :key="index">
                    <div class="details-news-text-container">
                        <b-taglist class="is-marginless">
                            <b-tag type="is-primary">Gameplay Update</b-tag>
                        </b-taglist>
                        <h1>Patch 2020 Gameplay: LUL</h1>
                    </div>
                </div>
            </div>
            <div class="column-is-fixed is-17 is-relative column details-installed-right">
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
                        <b-dropdown-item aria-role="listitem" @click="uninstallApplication">Uninstall</b-dropdown-item>
                    </b-dropdown>
                    <DropDownGameMode class="" v-model="gameMode" />
                </b-field>
                <b-button type="is-primary is-large" expanded>Play Now</b-button>
            </div>
        </div>
        <b-modal :width="900" :active.sync="isInstallModalActive" class="popup-install" :can-cancel="false"
            v-if="activeApplication">
            <Install :application="activeApplication" v-on:start="onStartInstall" />
        </b-modal>
    </div>
    <!--
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
    -->
</template>

<script>
    import humanize from 'humanize'
    import DropDownGameMode from './DropDownGameMode.vue';
    import Install from './Install.vue'
    import {
        OSType
    } from '../models/OSType'
    import {
        InstallationActionType
    } from '@/models/ApplicationStatus'
    import {
        shell
    } from 'electron'
    import {
        GAME_MODE
    } from '@/services/constants.ts'
    import {
        applicationLibrary,
        installationManager,
        eventBus,
        notificationManager
    } from '@/services/services'

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
            compatiblePlatforme: function () {
                return OSType[this.activeApplication.supportedOperatingSystems]
            },
            installation: function () {
                if (!this.applicationId) {
                    return null;
                }
                let ins = installationManager.getInstallationInfo(this.applicationId);
                return ins;
            }
        },
        asyncComputed: {
            activeApplication: async function () {
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
                this.$store.commit('setApplicationInstallationActionType', {
                    applicationId: this.applicationId,
                    actionType: InstallationActionType.Update
                });
            },
            onProgress(progress) {
                if (progress.downloadedCount == progress.totalFileCount) {
                    eventBus.emitter.emit("on-update-finish", progress);
                    this.$store.commit('setApplicationInstallationActionType', {
                        applicationId: this.applicationId,
                        actionType: InstallationActionType.NoAction
                    });
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
                    installationManager.uninstallApplication(this.applicationId)
                }
            },
            async checkForUpdates() {
                this.updateAvailable = await installationManager.checkUpdateAvailable(this.applicationId);
            },
            openFileExplorer() {
                shell.openItem(installationManager.getInstallationInfo(this.applicationId).path);
            },
            openSettingsPanel() {
                shell.beep();
            }
        },
        components: {
            DropDownGameMode,
            Install
        }
    };
</script>