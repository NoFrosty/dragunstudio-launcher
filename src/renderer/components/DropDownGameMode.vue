<template>
    <b-dropdown class="is-up" v-model="gameMode" aria-role="list">
        <button class="button is-primary" type="button" slot="trigger">
            <template v-if="gameMode == 0">
                <b-icon pack="fas" icon="globe-europe"></b-icon>
                <span>Public</span>
            </template>
            <template v-if="gameMode == 1">
                <b-icon pack="fas" icon="flask"></b-icon>
                <span>Beta</span>
            </template>
            <template v-if="gameMode == 2">
                <b-icon icon="account-multiple"></b-icon>
                <span>Alpha</span>
            </template>
            <template v-if="gameMode == 3">
                <b-icon icon="account-multiple"></b-icon>
                <span>PreAlpha</span>
            </template>
            <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item :value="0" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="globe-europe"></b-icon>
                <div class="media-content">
                    <h3>Public</h3>
                    <small>Version : 1.2.2</small>
                </div>
            </div>
        </b-dropdown-item>

        <b-dropdown-item :value="1" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="flask"></b-icon>
                <div class="media-content">
                    <h3>Beta</h3>
                    <small>Version : 1.2.3-Beta</small>
                </div>
            </div>
        </b-dropdown-item>
        <b-dropdown-item :value="2" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="tint"></b-icon>
                <div class="media-content">
                    <h3>Alpha</h3>
                    <small>Version : 1.3.0-Alpha</small>
                </div>
            </div>
        </b-dropdown-item>
        <b-dropdown-item :value="3" aria-role="listitem">
            <div class="media">
                <b-icon class="media-left" pack="fas" icon="shield-alt"></b-icon>
                <div class="media-content">
                    <h3>Pre-Alpha</h3>
                    <small>Prototype</small>
                </div>
            </div>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
var GameModeEnum = {
    PUBLIC: 0,
    BETA: 1,
    ALPHA: 2,
    PREALPHA: 3,
};
    export default {
        props:{
            gameMode: {
                default: 0
            }
        },
    }
</script>