<template>
<!--
    <div class="modal-view">
        <div class="modal-view-head">
            <h2 class="modal-view-subject">Warcraft Installation</h2>
        </div>
        <div class="modal-view-news-body">
            <div class="field">
                <b-field grouped>
                    <b-field label="Size">
                        5.13214 Go
                    </b-field>
                    <b-field label="Install Location">
                        <b-select placeholder="Select a subject">
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                        </b-select>
                    </b-field>
                </b-field>
                 <b-field label="Install Location">
                    <b-checkbox :value="true"
                    type="is-primary">
                        Keep this game updated automatically
                    </b-checkbox>
                </b-field>
            </div>
        </div>
    </div>
    -->
    <div class="popup">
        <div class="popup-inner">
        <div class="popup-inner-photo">
            <img src="https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
        </div>
        <div class="popup-inner-text">
            <h1>{{this.application.name}} Installation </h1>
            <div class="field">
                            
                <b-field grouped>
                    <b-input :value="this.path" expanded readonly></b-input>
                    <p class="control">
                        <b-button type="is-primary" @click="openDial()">Select another path</b-button>
                    </p>
                </b-field>
                <b-field label="Size">
                    15.13 Go
                </b-field>
                <b-field label="Options">
                    <b-checkbox :value="true" type="is-primary">
                        Keep this game updated automatically
                    </b-checkbox>
                </b-field>
                <div class="buttons">
                    <b-button size="is-large" type="is-primary is-fullwidth" @click="install(); $parent.close()" expanded>Install</b-button>
                </div>

            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import { installationManager } from '@/services/services'
    import { ApplicationInfo } from '@/models/ApplicationInfo';
    const {dialog} = require('electron').remote;

    export default {
        data() {
            return {
                path : null,
            }
        },
        props:{
            application: ApplicationInfo,
        },
        methods:{
            openDial: async function() {
                const selectedPaths = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
                this.path = selectedPaths.filePaths[0] + "\\" + this.application.name;
            },
            install(){
                installationManager.installApplication(this.application.applicationId,this.path);
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