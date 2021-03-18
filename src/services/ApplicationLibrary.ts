import RendererServiceBase from '@/services/RendererServiceBase';
import axios from 'axios';
import ApplicationInfo from "@/models/ApplicationInfo";
import Platforms from '@/models/Platforms';

class ApplicationLibrary extends RendererServiceBase {
    public async getAllGameList(): Promise<ApplicationInfo[]> {
        let currentOS = ApplicationLibrary.getOperatingSystem();
        
        if (this.store.state.isOffline) {
            let appData = localStorage.getItem("Applications");
            if (appData == null) {
                throw "Offline mode can't be used for first execution!";
            }
            let apps : ApplicationInfo[] = JSON.parse(appData);
            return apps;
        }
        else {
            let parameters={
                isPublished: false
            }
            let result = await axios.get<ApplicationInfo[]>(process.env.VUE_APP_API_LINK + '/applications?extended=true');
            let apps = result.data.filter(x => (x.platforms.some(p => p.operatingSystem==currentOS)));
            localStorage.setItem("Applications", JSON.stringify(apps));
            return result.data;
        }
    }

    public async getGameFromId(applicationId:string) : Promise<ApplicationInfo>{
        let apps : Promise<ApplicationInfo[]> = this.getAllGameList();
        var app = (await apps).find(x => x.applicationId == applicationId);
        if (app == null) {
            throw "No App found with this Id" + applicationId;
        }
        return app;
    }

    public static getOperatingSystem() : Platforms {
        switch(process.platform as String) {
            case "win32": return Platforms.Windows;
            case "linux": return Platforms.Linux;
            case "darwin": return Platforms.MacOS;
            default: throw `Unsupported operating system type '{process.platform}'`;
        }
    }
}

export default ApplicationLibrary