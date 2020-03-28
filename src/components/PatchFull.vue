<template>
    <div class="patchfull" v-if="article">
        <h1 class="patch-title">{{article.title}}</h1>
        <h2 class="patch-subtitle-author">By Frosty - 3 Days ago</h2>
        <b-taglist class="patch-tags is-marginless">
            <b-tag type="is-primary">Gameplay Update</b-tag>
        </b-taglist>
        <div class="content" v-html="articleContent"></div>
    </div>
</template>
<style>
#window{
        background-image: url("../assets/images/background/PatchBackground.jpg") !important;
}
</style>
<script>
import marked from 'marked'
export default {
    props:{
        article: null
    },
    computed:{
        articleContent() {
            console.log(this.article)
            return marked(this.article.content)
        }
    }
}
</script>