<template>
    <div class="patchfull" v-if="article">
        <div class="patch-info">
            <nav class="breadcrumb has-pipe-separator" aria-label="breadcrumbs">
                <ul>
                    <li><a @click="closeArticle">Project Crystal</a></li>
                    <li class="is-active"><a href="#">News</a></li>
                    <li class="is-active"><a href="#" aria-current="page">{{article.title}}</a></li>
                </ul>
            </nav>
            <h2 class="patch-subtitle-author">By Frosty - 3 Days ago</h2>
            <b-taglist class="patch-tags is-marginless">
                <b-tag type="is-primary">Gameplay Update</b-tag>
            </b-taglist>
        </div>
        <div class="patch-text">
            <div class="content" v-html="articleContent"></div>
        </div>
    </div>
</template>
<style>
#window{
        background-image: url("../assets/images/background/PatchBackground.jpg") !important;
}
</style>
<script>
import marked from 'marked'
import {eventBus} from '@/services/services'

export default {
    props:{
        article: null
    },
    computed:{
        articleContent() {
            return marked(this.article.content)
        }
    },
    methods: {
        closeArticle() {
            eventBus.emitter.emit("on-article-close", null);
        }
    }
}
</script>