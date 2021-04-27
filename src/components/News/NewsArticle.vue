<template>
  <a
    class="column-is-fixed is-23  column is-paddingless details-news-article"
    @click="openArticle()"
  >
    <div class="details-news-text-container">
      <b-taglist class="is-marginless">
        <b-tag type="is-primary">Gameplay Update</b-tag>
      </b-taglist>
      <h1 class="has-text-white">{{ article.title }}</h1>
      <p class="has-text-white">{{ timeCalc }}</p>
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
            //let date = new Date(this.article.publishDate)
            return moment(this.article.publishDate).fromNow();
        },
    },
    methods: {
        openArticle() {
            eventBus.emitter.emit("on-article-open", this.article);
            eventBus.emitter.emit("on-background-changed", 'https://cdna.artstation.com/p/assets/images/images/012/086/010/large/mikael-gustafsson-amongtrees-2-8.jpg?1532971442');
        }
    }
}
</script>