<template>
    <div class="popup">
        <a class="modal-close-btn" @click="$parent.close()"><b-icon pack="fas" icon="times" size="is-small" type="is-white"></b-icon></a>
        <div class="popup-inner install">
        <div class="popup-inner-text">
            <h1>Installation {{this.application.name}}</h1>
            <div class="installation-form">
                <b-field label="Installation Size" custom-class="has-text-white">
                    {{this.installationSize}}
                </b-field>
                <b-field label="Download Size" custom-class="has-text-white">
                    {{this.downloadSize}}
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
                        Add desktop shortcut for {{this.application.name}}
                    </b-checkbox>
                </b-field>
            </div>
            <b-button type="is-primary" @click="install(); $parent.close()" expanded>Install</b-button>
        </div>
    </div>
  </div>
</template>

<script>
    import ApplicationInfo from "@/models/ApplicationInfo";
    const os = require('os');
    const currentPlatform = os.platform();
    const {dialog} = require('electron').remote;
    const {remote} = require('electron')
    import axios from 'axios';
    import humanize from 'humanize'
    export default {
        data() {
            return {
                path : remote.app.getAppPath() + this.getSymbol() + this.application.name,
                installationSize : 0,
                downloadSize : 0
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
            },
            
        },
        mounted: async function(){
        },
        asyncComputed:{
            getAppSize: async function(){
                let params = { operatingSystem: 0 };
                if(currentPlatform == "win32")
                    params = { operatingSystem: 1 }
                else
                    params = { operatingSystem: 2 }
                let sizeResponse = await axios.get(process.env.VUE_APP_API_LINK + '/applications/' + this.application.applicationId + '/size',
                {params});
                this.downloadSize = humanize.filesize(sizeResponse.data.downloadSize);
                this.installationSize = humanize.filesize(sizeResponse.data.installationSize);
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