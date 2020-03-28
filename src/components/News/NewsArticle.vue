<template>
    <a class="column-is-fixed is-23  column is-paddingless details-news-article" @click="openArticle()">
        <div class="details-news-text-container">
            <b-taglist class="is-marginless">
                <b-tag type="is-primary">Gameplay Update</b-tag>
            </b-taglist>
            <h1>{{article.title}}</h1>
            <p>{{timeCalc}}</p>
        </div>
    </a>
</template>

<script>
import moment from 'moment'
import {eventBus} from '@/services/services'

export default {
    props: {
        article:null
    },
    computed:{
        timeCalc() {
            let date = new Date(this.article.publishDate)
            return moment(this.article.publishDate).fromNow();
        },
    },
    methods: {
        openArticle() {
            eventBus.emitter.emit("on-article-open", this.article);
        }
    }
}
</script>