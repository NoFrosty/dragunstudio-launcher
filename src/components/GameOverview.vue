<template>
    <div>
        <section>
            <b-modal :active.sync="isNewsModalActive" class="popup-news">
               <FullNews/>
            </b-modal>
             <b-modal :active.sync="isInstallModalActive" class="popup-install" v-if="selectedApplication">
               <Install :application="selectedApplication" v-on:start="onStartInstall" />
            </b-modal>
        </section>
        <!--
        <section class="overview-news">
            
            <div class="game-overview-right">
                <div class="game-overview-right-line">
                    <div class="card large">
                        <div class="card-image">
                            <figure class="image">
                                <img src="https://source.unsplash.com/uzDLtlPY8kQ" alt="Image">
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image is-96x96">
                                        <img src="https://cdn.discordapp.com/avatars/244932903530659841/0c924a19fcf1b5c59bc9dc1b58b61bb0.jpg?size=1024" alt="Image">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-4 no-padding">McSocks</p>
                                    <p><span class="title is-6"><a href="http://twitter.com/#">@twitterid</a></span></p>
                                    <p class="subtitle is-6">Developer</p>
                                </div>
                            </div>
                            <div class="content">
                                The soul of the Beast seemed lost forever. Then, by the full moon's light, a child was born; child with the unbridled soul of the Beast that would make all others pale in comparison.
                                <div class="background-icon"><span class="icon-facebook"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            -->
            <div class="overview-panel">
                <!--
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
                <b-carousel class="tile is-child"
                            :arrow="true"
                            :autoplay="true"
                            :pause-info="false"
                            :interval="5000"
                            icon-pack="fas"
                            icon-prev="arrow-left"
                            icon-next="arrow-right">
                                <b-carousel-item v-bind:key="item.id" v-for="item in news">
                                    <section :class="`hero is-medium is-primary is-bold`">
                                        <div class="hero-head">
                                            <div class="tags has-addons">
                                                <span class="tag is-black">News</span>
                                                <span class="tag is-primary">Patch Note</span>
                                                <span class="tag is-info">Evorine</span>
                                            </div>
                                        </div>
                                        <div class="hero-body has-text-centered">
                                            <h1 class="title">{{item.title}}</h1>
                                        </div>
                                        <div class="hero-foot has-text-right">
                                            <p v-if="item.article.length<350" class="article">{{item.article}}</p>
                                            <p v-else class="article">{{item.article.substring(0,350)+"..."}}</p>
                                            <time class="has-text-right" datetime="2016-1-1">{{item.publishDate}}</time>
                                        </div>
                                    </section>
                                </b-carousel-item>           
                            </b-carousel>
                -->
                <div class="tile is-ancestor">
                    <div class="tile is-vertical is-6">
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                            <p class="title">One</p>
                            <p class="subtitle">Subtitle</p>
                            </article>
                        </div>
                    </div>
                    <div class="tile is-vertical">
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                            <p class="title">One</p>
                            <p class="subtitle">Subtitle</p>
                            </article>
                        </div>
                        <div class="tile">
                            <div class="tile is-parent ">
                                <article class="tile is-child box">
                                <p class="title">One</p>
                                <p class="subtitle">Subtitle</p>
                                </article>
                            </div>
                            <div class="tile is-parent">
                                <article class="tile is-child box">
                                <p class="title">Two</p>
                                <p class="subtitle">Subtitle</p>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div class="overview-download">
            <nav class="level" >
                <!-- Left side -->
                <div class="level-left" v-if="totalReceived || totalToReceive">
                    <p class="level-item">{{totalReceived}} out of {{totalToReceive}}</p>
                </div>
                <!-- Right side -->
                <div class="level-right">
                    <p class="level-item">15 MIN PLEASE</p>
                </div>
            </nav>
            <div class="update-progress">
                <b-progress class="update-progress-bar" type="is-primary" :precision="2" :value="percentage" show-value format="percent"></b-progress>
                <a class="update-progress-control">
                    <b-icon pack="fas" icon="pause" size="is-medium" type="is-primary"></b-icon>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
    import humanize from 'humanize'
    import {
        GAME_MODE
    } from '@/services/constants.ts'
    import DropDownGameMode from './DropDownGameMode.vue';
    import FullNews from './FullNews.vue'
    import Install from './Install.vue'
    import axios from 'axios';

    import { applicationLibrary, installationManager, eventBus } from '@/services/services'

    export default {
        data() {
            return {
                gameMode: GAME_MODE.PUBLIC,
                isNewsModalActive: false,
                isInstallModalActive: false,
                news: null,
                percentage: 0,
                totalReceived: null,
                totalToReceive: null,
                updateAvailable: false,
                carousels: [
                    { text: 'Slide 1', color: 'primary' },
                    { text: 'Slide 2', color: 'info' },
                    { text: 'Slide 3', color: 'success' },
                    { text: 'Slide 4', color: 'warning' },
                    { text: 'Slide 5', color: 'danger' }
                ],
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
                let ins = installationManager.getInstallationInfo(this.$store.state.selectedApplicationId);
                return ins;
            }
        },
        asyncComputed: {
            selectedApplication: async function() {
                if (!this.$store.state.selectedApplicationId) {
                    return null;
                }
                return await applicationLibrary.getGameFromId(this.$store.state.selectedApplicationId);
            }
        },
        methods: {
            onProgress(progress) {
                if(progress){
                    this.percentage = progress.downloadedSize / progress.totalFileSize * 100;
                    this.totalReceived = humanize.filesize(progress.downloadedSize);
                    this.totalToReceive = humanize.filesize(progress.totalFileSize);
                }
            },
            onFinish(progress) {
                this.onProgress(progress);
            },
            onStartInstall(installData) {
                installationManager.installApplicationMultiThread(
                    this.$store.state.selectedApplicationId,
                    installData.path,
                    this.onProgress
                );
            },
            confirm() {
                if(!this.$store.state.isSignedIn){
                    this.$buefy.dialog.confirm({
                        message: 'Continue without logged in?',
                        onConfirm: () => this.$buefy.toast.open('User confirmed without logged in')
                    })
                }
            },
            uninstallApplication(){
                installationManager.uninstallApplication(this.selectedApplication.applicationId);
            },
            async checkForUpdates(){
                this.updateAvailable = await installationManager.checkUpdateAvailable(this.selectedApplication.applicationId);
            },
            onStartUpdate(){
                installationManager.updateApplication(this.$store.state.selectedApplicationId,this.onProgress);
            }
        },
        mounted: async function () {
            let newsResponse = await axios.get(process.env.VUE_APP_API_LINK + '/news');
            this.news = newsResponse.data;

            eventBus.subscribe('on-update-progress', this.onProgress);
            eventBus.subscribe('on-update-finish', this.onFinish);
            //this.checkForUpdates();
        },
    }
</script>