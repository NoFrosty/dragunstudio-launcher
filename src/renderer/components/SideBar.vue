<template>
    <b-menu >
        <b-menu-list>
            <MenuItem icon="information-outline" label="Game 1" imagepath="../assets/images/pikachu.png"></MenuItem>
            <MenuItem icon="information-outline" label="Game 2" imagepath="../assets/images/pikachu.png"></MenuItem>
            <MenuItem icon="information-outline" label="Game 3" imagepath="../assets/images/pikachu.png"></MenuItem>
            <MenuItem icon="information-outline" label="Game 4" imagepath="../assets/images/pikachu.png"></MenuItem>
        </b-menu-list>
    </b-menu>
    
</template>

<script>
import MenuItem from './buefyC/MenuItem.vue';

    export default {
        data() {
            return {
                isActive: true
            }
        },
        components: {
            MenuItem,
        }
    }
</script>