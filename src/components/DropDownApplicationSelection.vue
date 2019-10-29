<template>

    <b-dropdown v-model="currentApplication" aria-role="list" v-if="this.applications">
        <button class="button is-danger" type="button" slot="trigger" v-if="currentApplication">
            <template >
                <b-icon pack="fas" icon="gamepad"></b-icon>
                <span>{{currentApplication.name}}</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item v-for="application in applications" :key="application.applicationid" :value="application" @click="changeApplication" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="user"></b-icon>
                <div class="media-content">
                    <h3>{{application.name}}</h3>
                    <small></small>
                </div>
            </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
    import axios from 'axios';
    export default {
        props: {
        },
        data() {
            return {
                currentApplication: null,
                applications:null,
            }
        },
        methods: {
            changeApplication: function() {
                this.$store.commit('setSelectedApplicationId', this.currentApplication.applicationId);
            },
        },
        async mounted () {
            this.applications = await this.$root.$ApplicationLibrary.getAllGameList();
            this.currentApplication =  this.applications.find(x => x.applicationId == this.$store.state.selectedApplicationId)
            if(!this.currentApplication)
                this.$store.commit('setSelectedApplicationId', this.applications[0].applicationId);
        }
    }
</script>