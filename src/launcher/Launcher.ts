import {GameNameEnum} from "./GameNameEnum";
import {Application} from "./Application";
import { SemVersion } from './SemVersion';
import { LauncherOptions } from './LauncherOptions';
import * as WebRequest from 'web-request'
import axios from 'axios';

export class Launcher {

    public applications: Array<Application>;
    public apiUrl: string;
    constructor () {
        this.apiUrl = process.env.VUE_APP_API_LINK+"";
        this.applications = this.getAllGameList();
        
    }

    private getAllGameList(): Array<Application>{
        var result:Array<Application> = new Array<Application>();
        let response = axios.get(process.env.VUE_APP_API_LINK+'application').then(function (response) {
            // handle success
            result = response.data;
            console.log(result);
          });
        return result;
    }
}