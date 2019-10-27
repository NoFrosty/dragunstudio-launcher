import { InstallationInfo } from '@/models/InstallationInfo';

interface ApplicationState {
    isSignedIn : boolean
    username : string
    jwt : string,
    isOffline?: boolean,
    installedApplications: InstallationInfo[]
}

export default ApplicationState