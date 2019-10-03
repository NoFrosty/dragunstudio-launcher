<template>
    <div class="overview">
        <div class="overview-panel">
        </div>

        <div class="overview-download">
            <div class="overview-download-top">
                
                <div class="overview-download-top-right">
                    <div>
                        <a>
                            <b-icon pack="fas" icon="pause" size="is-small"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="play" size="is-small"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="cog" size="is-small"></b-icon>
                        </a>
                    </div>
                </div>
            </div>

            <div class="overview-download-bottom">
                <div class="overview-download-bottom-left">
                    <b-button size="is-large">Play</b-button>
                </div>
                <div class="overview-download-bottom-right">
                    <progress class="progress is-info" value="15" max="100">15%</progress>
                    <nav class="level">
                        <!-- Left side -->
                        <div class="level-left">
                            <DropDownGameMode class="level-item"/>
                            <DropDownGameMode class="level-item"/>
                        </div>

                        <!-- Right side -->
                        <div class="level-right">
                            <p class="level-item">1.26 GB OUT OF 2.17 GB</p>
                        </div>
                    </nav>
                </div>


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