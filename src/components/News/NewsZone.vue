<template>
    <div class="columns details-news">
        <NewsArticle v-for="article in articles" :key="article.id" :article="article"/>
    </div>
</template>

<script>
import axios from 'axios';
import NewsArticle from './NewsArticle.vue'
export default {
    props: {
        applicationId: null
    },
    data(){
        return {
            articles: null
        }
    },
    mounted: async function(){
        let articleResponse = await axios.get(process.env.VUE_APP_API_LINK + '/article');
        this.articles = articleResponse.data;
    },
    components: {
        NewsArticle
    }
}
</script>