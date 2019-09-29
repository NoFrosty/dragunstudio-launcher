<template>
    <section class="section">
        <nav class="level">
            <!-- Left side -->
            <div class="level-left">
                <div class="level-item">
                    <a class="button is-primary">Play</a>
                </div>
            </div>

            <!-- Right side -->
            <div class="level-right">
                <div class="level-item">
                    <progress class="progress is-info" value="15" max="100">15%</progress>
                </div>
                <a class="button is-primary">Play</a>
            </div>
        </nav>
        <div class="columns">
            <div class="column is-2">
                <DropDownGameMode />
                
            </div>
            <div class="column">
                <progress class="progress is-info" value="15" max="100">15%</progress>
            </div>
        </div>
    </section>
</template>
<script>
import DropDownGameMode from './DropDownGameMode.vue';
export default {
    components:{
        DropDownGameMode
    }
}
</script>