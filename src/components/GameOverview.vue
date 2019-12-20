<template>
    <div>
        <section>
            <b-modal :active.sync="isNewsModalActive" class="popup-news">
               <FullNews/>
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
                <div class="tile is-ancestor" v-if="articles">
                    <div class="tile is-vertical is-6" v-if="articles.length == 0">
                        <div class="tile is-parent">
                            <article class="tile is-child box">
                            <p class="title">{{articles[0].title}}</p>
                            <p class="subtitle">{{articles[0].publishDate}}</p>
                            </article>
                        </div>
                    </div>
                    <div class="tile is-vertical" v-if="articles.length > 0">
                        <div class="tile is-parent" v-if="articles.length > 0">
                            <article class="tile is-child box">
                            <p class="title">One</p>
                            <p class="subtitle">Subtitle</p>
                            </article>
                        </div>
                        <div class="tile" v-if="articles.length > 1">
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
        <ApplicationUpdateProgress v-if="isUpdating" />
    </div>
</template>
<script>
    import axios from 'axios';
    import FullNews from '@/components/FullNews.vue'
    import ApplicationUpdateProgress from '@/components/ApplicationUpdateProgress.vue'
    import { InstallationActionType } from '@/models/ApplicationStatus'

    export default {
        props: {
            applicationId: null
        },
        data() {
            return {
                isNewsModalActive: false,
                articles: null
            }
        },
        computed: {
            isSignedIn: function() {
                return this.$store.state.isSignedIn;
            },
            isUpdating() {
                let status = this.$store.state.applicationStatuses.find(x => x.applicationId == this.applicationId);
                if (status) {
                    return status.currentActionType == InstallationActionType.Update;
                }
                return false;
            }
        },
        methods: {
        },
        mounted: async function () {
            let articleResponse = await axios.get(process.env.VUE_APP_API_LINK + '/article');
            this.articles = articleResponse.data;
            console.log(this.articles)
        },
        components: {
            ApplicationUpdateProgress,
            FullNews
        }
    }
</script>