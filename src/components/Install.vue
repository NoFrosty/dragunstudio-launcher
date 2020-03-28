<template>
    <div class="popup">
        <a class="modal-close-btn" @click="$parent.close()"><b-icon pack="fas" icon="times" size="is-small" type="is-white"></b-icon></a>
        <div class="popup-inner">
        <div class="popup-inner-text">
            <h1>Installation {{this.application.name}}</h1>
            <div class="installation-form">
                <b-field label="Size" custom-class="has-text-white">
                    15.13 Go
                </b-field>
                <b-field label="Location" custom-class="has-text-white">
                    <b-field grouped>
                        <b-input :value="this.path" expanded readonly></b-input>
                        <p class="control">
                            <b-button type="is-primary" @click="openDial()">Select another path</b-button>
                        </p>
                    </b-field>
                </b-field>
                <b-field label="Options" custom-class="has-text-white">
                    <b-checkbox :value="true" type="is-primary">
                        Keep this game updated automatically
                    </b-checkbox>
                </b-field>
                <b-field custom-class="has-text-white">
                    <b-checkbox :value="true" type="is-primary">
                        Add desktop shortcut for Project Crystal
                    </b-checkbox>
                </b-field>
            </div>
            <b-button type="is-primary" @click="install(); $parent.close()" expanded>Install</b-button>
        </div>
    </div>
  </div>
</template>

<script>
    import { ApplicationInfo } from '@/models/ApplicationInfo';
    import { DownloadManager, DownloadManagerOnProgressEvent } from '../services/DownloadManager';
    const os = require('os');
    const currentPlatform = os.platform();
    const {dialog} = require('electron').remote;
    const {remote} = require('electron')

    export default {
        data() {
            return {
                path : remote.app.getAppPath() + this.getSymbol() + this.application.name,
            }
        },
        props:{
            application: ApplicationInfo,
        },
        methods:{
            getSymbol(){
                if(currentPlatform == "win32")
                    return "\\";
                else
                    return "/"
            },
            openDial: async function() {
                const selectedPaths = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
                if(!selectedPaths.canceled)
                    this.path = selectedPaths.filePaths[0] + this.getSymbol() + this.application.name;
            },
            install() {
                this.$emit('start', {
                    path: this.path
                })
            }
        }
    }
</script>
<style lang="scss">
.modal .animation-content {
    z-index: 1;
    /* padding: 105px 90px 91px; */
    /* border-radius: 1.5rem; */
}
.popup{
    display: flex;
    flex-direction: row;
    .popup-inner{
        display: flex;
        flex-direction: row;
        .popup-inner-photo{
            height: 100%;
            width: 40%;
        }
        .popup-inner-text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 60%;
            height: 100%;
            padding: 2rem;
            h1{
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 2rem;
                text-transform: uppercase;
                color: #ffffff;
            }
            p{
                font-size: .875rem;
                color: #ffffff;
                line-height: 1.5;
            }
        }
    }
}
</style>