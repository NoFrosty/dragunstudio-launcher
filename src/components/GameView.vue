<template>
    <div>
        <h1>HELLOOOO</h1>
        <div v-if="true">
            NO DESCRIPTION IN OFFLINE MODE!
        </div>
        <GameViewTabs v-else />
    </div>
</template>

<script>
    import GameViewTabs from "./components/GameViewTabs.vue";
    export default {
        computed: {
            isOffline: function() {
                return true;
                return this.$store.state.isOffline;
            }
        },
        components: {
            GameViewTabs
        }
    };
</script>