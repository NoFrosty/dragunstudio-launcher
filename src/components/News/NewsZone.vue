<template>
    <div class="columns details-news">
        <NewsArticle v-for="article in getArticles" :key="article.id" :article="article"/>
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
        this.getArticles;
    },
    asyncComputed: {
        getArticles: async function(){
            let parameters = {
                
                
                firstN: null
            };
            let articleResponse = await axios.get(process.env.VUE_APP_API_LINK + '/applications/' + this.applicationId + '/articles');
            return articleResponse.data;
        }
    },
    components: {
        NewsArticle
    }
}
</script>