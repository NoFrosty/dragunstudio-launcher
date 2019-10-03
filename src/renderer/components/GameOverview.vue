<template>
    <div class="overview">
        <div class="overview-panel">
        </div>

        <div class="columns">
            <div class="column is-2">
                <DropDownGameMode />
                <b-button size="is-large">Play</b-button>
            </div>
            <div class="column">
                <nav class="level">
                    <div class="level-left">
                    </div>
                    <!-- Right side -->
                    <div class="level-right">
                        <a class="level-item"><b-icon pack="fas" icon="pause" size="is-small"></b-icon></a>
                        <a class="level-item"><b-icon pack="fas" icon="play" size="is-small"></b-icon></a>
                        <a class="level-item"><b-icon pack="fas" icon="cog" size="is-small"></b-icon></a>
                    </div>
                </nav>
                <progress class="progress is-info" value="15" max="100">15%</progress>
                <nav class="level">
                    <!-- Left side -->
                    <div class="level-left">
                        <div class="level-item">
                            <DropDownGameMode />
                        </div>
                    </div>

                    <!-- Right side -->
                    <div class="level-right">
                        <p class="level-item">1.26 GB OUT OF 2.17 GB</p>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
    import DropDownGameMode from './DropDownGameMode.vue';
    export default {
        components: {
            DropDownGameMode
        }
    }
</script>