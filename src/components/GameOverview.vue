<template>
    <div v-if="this.actualGame">
        <section>
            <b-modal :active.sync="isNewsModalActive" class="popup-news">
               <FullNews/>
            </b-modal>
             <b-modal :active.sync="isInstallModalActive" class="popup-install" v-if="selectedApplication">
               <Install :application="selectedApplication"/>
            </b-modal>
        </section>
        <div class="overview-panel">
            <div class="overview-panel-left">
                <div class="scrollable" v-if="news">
                    <p class="title is-3">News</p>
                    <a v-bind:key="item.id" v-for="item in news" @click="isNewsModalActive = true">
                        <article class="content">
                            <p class="title is-4">{{item.title}}</p>
                            <p v-if="item.article.length<350" class="article">{{item.article}}</p>
                            <p v-else class="article">{{item.article.substring(0,350)+"..."}}</p>
                            <time datetime="2016-1-1">{{item.publishDate}}</time>
                        </article>
                    </a>
                </div>
            </div>
            <div class="overview-panel-right">
                <div class="scrollable">
                    <p class="article">Last played : 3 days ago</p>
                    <p class="article">Time played : 115 hours</p>
                    <p class="article">Lasts Achievments : </p>
                </div>
            </div>
        </div>
        <b-button size="is-large" class="is-primary" @click="isInstallModalActive = true" v-if="!installation">Install</b-button>
        <div class="overview-download" v-else>
            <div class="overview-download-top">
                <div class="overview-download-top-right">
                    <div>
                        <a>
                            <b-icon pack="fas" icon="pause" size="is-small" type="is-primary"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="play" size="is-small" type="is-primary"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="cog" size="is-small" type="is-primary"></b-icon>
                        </a>
                    </div>
                </div>
            </div>

            <div class="overview-download-bottom">
                <div class="overview-download-bottom-left">
                    <b-button size="is-large" class="is-primary" @click="confirm">Play</b-button>
                </div>
                <div class="overview-download-bottom-right">
                    <progress class="progress is-primary" :value="percentage" max="100" show-value format="percent">15%</progress>
                    <nav class="level">
                        <!-- Left side -->
                        <div class="level-left">
                            <DropDownGameMode class="level-item" v-model="gameMode" />
                            <b-dropdown aria-role="list" class="is-up">
                                <button class="button is-primary is-auto" slot="trigger">
                                    <b-icon pack="fas" icon="cog"></b-icon>
                                </button>
                                <b-dropdown-item aria-role="listitem">Settings</b-dropdown-item>
                                <b-dropdown-item aria-role="listitem">Repair</b-dropdown-item>
                                <b-dropdown-item aria-role="listitem" @click="uninstallApplication">Uninstall</b-dropdown-item>
                            </b-dropdown>
                        </div>

                        <!-- Right side -->
                        <div class="level-right">
                            <p class="level-item">{{totalReceived.size}} {{totalReceived.suffixe}} out of {{totalToReceive.size}} {{totalToReceive.suffixe}}</p>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        GAME_MODE
    } from '@/services/constants.ts'
    import DropDownGameMode from './DropDownGameMode.vue';
    import FullNews from './FullNews.vue'
    import Install from './Install.vue'
    import axios from 'axios';
    import { InstallationInfo } from '@/models/InstallationInfo';

    export default {
        data() {
            return {
                gameMode: GAME_MODE.PUBLIC,
                isNewsModalActive: false,
                isInstallModalActive: false,
                news: null,
                applicationInfo:null,
                actualGame: {
                    applicationId : null,
                    path : "",
                    exeName : ""
                },
                percentage: 0,
                totalReceived: null,
                totalToReceive: null,
            }
        },
        components: {
            DropDownGameMode,
            FullNews,
            Install
        },
        computed: {
            isSignedIn: function() {
                return this.$store.state.isSignedIn;
            },
            installation: function() {
                if (!this.$store.state.selectedApplicationId) {
                    return null;
                }
                let app = this.$store.state.installedApplications.find(x => x.applicationId == this.$store.state.selectedApplicationId);
                return app;
            }
        },
        asyncComputed: {
            selectedApplication: async function() {
                if (!this.$store.state.selectedApplicationId) {
                    return null;
                }
                return await this.$root.$ApplicationLibrary.getGameFromId(this.$store.state.selectedApplicationId);
            }
        },
        methods: {
            
            confirm() {
                if(!this.$store.state.isSignedIn){
                    this.$buefy.dialog.confirm({
                        message: 'Continue without logged in?',
                        onConfirm: () => this.$buefy.toast.open('User confirmed without logged in')
                    })
                }
            },
            AddApplication: function() {
                var installationInfo = {
                    applicationId : this.$store.state.selectedApplicationId,
                    path : "",
                    exeName : ""
                }
                //this.$store.commit('addNewApplication', installationInfo);
                this.actualGame = this.$store.state.installedApplications.find(x => x.applicationId == this.$store.state.selectedApplicationId);
            },
            uninstallApplication(){
                this.$root.$InstallationManager.uninstallApplication(this.selectedApplication.applicationId);
            },
            calculateData() {
                window.setInterval(() => {
                    this.percentage = this.$root.$InstallationManager.getPercentage();
                    this.totalReceived = this.$root.$InstallationManager.getTotalReceived();
                    this.totalToReceive = this.$root.$InstallationManager.getTotal();
                }, 100)
            },
        },
        mounted: async function () {
            let newsResponse = await axios.get(process.env.VUE_APP_API_LINK + '/news');
            this.news = newsResponse.data;

            this.interval = setInterval(() => this.calculateData(), 100);

            
        },
    }
</script>