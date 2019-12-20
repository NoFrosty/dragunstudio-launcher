<template>
    <ul class="application-list">
        <li 
        class="application"
        v-bind:class="{ 'not-installed': !isInstalleds[application.applicationId], 'selected': application.applicationId == selectedApplicationId }"
        v-for="application in applications" 
        :key="application.applicationId">
            <a class="" @click="changeApplication(application)">
                <figure class="image is-48x48 app-icon-container">
                    <img class="app-icon" :src="'./images/app-icon/' + application.applicationId + '.png'" alt="icon">
                </figure>
                <span class="app-title">{{application.name}}</span>
            </a>
        </li>
    </ul>
</template>

<script>
import axios from 'axios';
import { applicationLibrary, installationManager } from '@/services/services'

export default {
    props: {
        value: null
    },
    data() {
        return {
            selectedApplicationId: null,
            applications: null
        };
    },
    computed: {
        isInstalleds: function(params) {
            let ins = {};
            if (this.applications) {
                this.applications.forEach(app => {
                    ins[app.applicationId] = installationManager.getInstallationInfo(app.applicationId) != undefined;
                });
            }
            return ins;
        }
    },
    methods: {
        setCurrentApplication: function(applicationId) {
            this.selectedApplicationId = applicationId;
            this.$store.commit('setSelectedApplicationId', applicationId);
        },
        changeApplication: function(application) {
            this.$emit('input', application);
            this.setCurrentApplication(application.applicationId);
        }
    },
    async mounted() {
        this.applications = await applicationLibrary.getAllGameList();
        let app =  this.applications.find(x => x.applicationId == this.$store.state.selectedApplicationId)
        this.setCurrentApplication(app.applicationId);
        // If app can't be found or no app is selected before, set first app as selected
        if(!this.$store.state.selectedApplicationId || !app) {
            this.$store.commit('setSelectedApplicationId', this.applications[0].applicationId);
        }
    }
};
</script>