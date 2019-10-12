<template>
    <b-dropdown class="is-up" v-model="currentGameMode" aria-role="list" v-bind:value="value" v-on:change="onChange">
        <button class="button is-primary" type="button" slot="trigger">
            <template>
                <b-icon pack="fas" :icon="GAME_MODE_ICONS[currentGameMode]"></b-icon>
                <span>{{GAME_MODE_NAME[currentGameMode]}}</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item v-for="mode in GameModeKeys" :key="mode" :value="GAME_MODE[mode]" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" :icon="GAME_MODE_ICONS[GAME_MODE[mode]]"></b-icon>
                <div class="media-content">
                    <h3>{{GAME_MODE_NAME[GAME_MODE[mode]]}}</h3>
                    <small>Version : 1.2.2</small>
                </div>
            </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
    import { GAME_MODE, GAME_MODE_ICONS, GAME_MODE_NAME } from '@/services/constants.ts'

    export default {
        props: {
            value: null
        },
        computed: {
            GAME_MODE: () => GAME_MODE,
            GAME_MODE_ICONS: () => GAME_MODE_ICONS,
            GAME_MODE_NAME: () => GAME_MODE_NAME,
            GameModeKeys: () => Object.keys(GAME_MODE)
        },
        data() {
            return {
                currentGameMode: this.value
            }
        },
        methods: {
            onChange: function(value) {
                this.$emit('input', value)
                this.$emit('game-mode-changed', value)
            }
        }
    }
</script>