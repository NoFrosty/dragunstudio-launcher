<template>
    <div class="window-controller">
        <div class="draggable">
        </div>
        <div class="window-controller-btn">
            <a v-if="updateAvailable" @click="update()"><b-icon class="update-available" pack="fas" icon="download" size="is-small"></b-icon></a>
            <a @click="openDevTool()"><b-icon pack="fas" icon="code" size="is-small" type="is-white"></b-icon></a>
            <a ><b-icon pack="fas" icon="cogs" size="is-small" type="is-white"></b-icon></a>
            <a @click="minimizeApp()"><b-icon pack="fas" icon="window-minimize" size="is-small" type="is-white"></b-icon></a>
            <a @click="fullScreenApp()"><b-icon pack="fas" icon="square" size="is-small" type="is-white"></b-icon></a>
            <a @click="closeApp()"><b-icon pack="fas" icon="times" size="is-small" type="is-white"></b-icon></a>
        </div>
        <b-modal :width="900" :active.sync="isInstallModalActive" class="popup-install" :can-cancel="false" >
            <PopUpInfo/>
        </b-modal>
    </div>
</template>

<script>
const {BrowserWindow} = require('electron').remote
import { ipcRenderer } from 'electron'
import PopUpInfo from './PopUpInfo.vue'
export default {
    data() {
        return {
            isInstallModalActive: false,
            updateAvailable: false
        }
    },
    components: {
        PopUpInfo
    },
    methods: {
        startClose() {
            this.isInstallModalActive = true;
        },
        closeApp(){
            if(!this.$store.state.isMinimizeAsked){
                this.isInstallModalActive = true
                return ;
            }
            else{
                BrowserWindow.getFocusedWindow().close();
            }
        },
        update(){

        },
        minimizeApp(){
            BrowserWindow.getFocusedWindow().minimize();
        },
        openDevTool(){
            BrowserWindow.getFocusedWindow().openDevTools();
        },
        fullScreenApp(){
            let window = BrowserWindow.getFocusedWindow();
            if(window.isMaximized())
                window.unmaximize();
            else
                window.maximize();
        }
    },
    mounted: function() {
        ipcRenderer.on("launcher-update-available", (event, value) => {
          this.updateAvailable = value;
        });
    },
}
</script>

<style lang="scss" scoped>

</style>