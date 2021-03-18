<template>
    <div class="popup">
        <a class="modal-close-btn" @click="$parent.close()"><b-icon pack="fas" icon="times" size="is-small" type="is-white"></b-icon></a>
        <div class="popup-inner">
        <div class="popup-inner-text">
            <h1>Minimize the app instead of close ?</h1>
            <div class="field">
                <div class="level">
                    <div class="level-item has-text-centered">
                        <b-button type="submit is-dark" @click="closeApp(); $parent.close()" expanded>{{$t('close')}}</b-button>
                    </div>
                    <div class="level-item has-text-centered">
                        <b-button type="submit is-primary" @click="minimizeApp(); $parent.close()" expanded>{{$t('minimize')}}</b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, } from 'electron'
const {BrowserWindow} = require('electron').remote
    export default {
        data() {
            return {
                
            }
        },
        methods:{
            closeApp(){
                this.$store.commit('setMinimize', false); 
                ipcRenderer.send("application-setup", { isMinimizeInsteadClose: this.$store.state.isMinimizeInsteadClose, isLaunchWithWindows: this.$store.state.isLaunchWithWindows });
                BrowserWindow.getFocusedWindow().close();
            },
            minimizeApp(){
                this.$store.commit('setMinimize', true); 
                ipcRenderer.send("application-setup", { isMinimizeInsteadClose: this.$store.state.isMinimizeInsteadClose, isLaunchWithWindows: this.$store.state.isLaunchWithWindows });
                BrowserWindow.getFocusedWindow().close();
            }
        }
    }
</script>
<style lang="scss">
.level-item {
    &.has-text-centered{
        &:not(:last-child){
            margin-right: 1em;
        }
    }
}
</style>