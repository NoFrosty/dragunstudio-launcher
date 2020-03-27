<template>
    <div class="column-is-fixed is-23  column is-paddingless details-news-article">
            <div class="details-news-text-container">
                <b-taglist class="is-marginless">
                    <b-tag type="is-primary">Gameplay Update</b-tag>
                </b-taglist>
                <h1>{{article.title}}</h1>
                <p>{{timeCalc}}</p>
            </div>
        </div>
</template>

<script>
import moment from 'moment'
export default {
    props: {
        article:null
    },
    computed:{
        timeCalc() {
            let date = new Date(this.article.publishDate)
            return moment(this.article.publishDate).fromNow();
        }
    }
}
</script>