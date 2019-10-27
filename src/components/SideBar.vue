<template>
    <b-menu >
        <b-menu-list v-if="applications">
            <MenuItem v-bind:key="application.applicationId" v-for="application in applications" icon="information-outline" :label="application.name" imagepath="../assets/images/pikachu.png"></MenuItem>
        </b-menu-list>
    </b-menu>
    
</template>

<script>
    import MenuItem from './buefyC/MenuItem.vue';
    import axios from 'axios';
    export default {
        data() {
            return {
                isActive: true,
                applications:null
            }
        },
        components: {
            MenuItem,
        },
        mounted () {
            axios.get(process.env.VUE_APP_API_LINK + '/application').then(response => (this.applications = response.data));
            
        }
    }
</script>