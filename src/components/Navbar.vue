<template>
    <b-navbar class="is-transparent" :transparent="true">
        <template slot="brand">
            <b-navbar-item tag="router-link" to="launcher">
                <img
                    src="../assets/images/Evorine-Logo.png"
                    alt="Evorine"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item @click="changeApplication(application)"
            :class="{'is-active': application.applicationId == selectedApplicationId}"
            v-for="application in applications" 
            :key="application.applicationId">
                {{application.name}}
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import axios from 'axios';
import { applicationLibrary, installationManager } from '@/services/services'

export default {
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