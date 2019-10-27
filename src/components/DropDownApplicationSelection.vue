<template>

    <b-dropdown v-model="currentApplication" aria-role="list">
        <button class="button is-danger" type="button" slot="trigger">
            <template >
                <b-icon pack="fas" icon="user"></b-icon>
                <span>{{currentApplication.name}}</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item v-for="application in applications" :key="application.ApplicationId" :value="application"  aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="user"></b-icon>
                <div class="media-content">
                    <h3>{{application.name}}</h3>
                    <small></small>
                </div>
            </div>
        </b-dropdown-item>
    </b-dropdown>

    <!--
    <b-dropdown v-model="currentApplication" aria-role="list" v-bind:value="value" v-on:change="onChange">
        <button class="button is-primary" type="button" slot="trigger">
            <template>
                <b-icon pack="fas" :icon="aze"></b-icon>
                <span>{{applications[currentApplication]}}</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item v-for="application in applications" :key="application" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" :icon="application.name"></b-icon>
                <div class="media-content">
                    <h3>{{application.name}}</h3>
                    <small>Version : 1.2.2</small>
                </div>
            </div>
        </b-dropdown-item>
    </b-dropdown>
    -->
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
            onChange: function(value) {
                this.$emit('input', value)
                this.$emit('game-mode-changed', value)
            }
        },
        async mounted () {
            this.applications = await this.$root.$ApplicationLibrary.getAllGameList();
            this.currentApplication = this.applications[0];
            
        }
    }
</script>