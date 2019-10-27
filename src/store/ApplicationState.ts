import { InstallationInfo } from '@/models/InstallationInfo';

interface ApplicationState {
    isSignedIn : boolean
    username : string
    jwt : string,
    isOffline?: boolean,
    selectedApplicationId?: string,
    installedApplications: InstallationInfo[]
}

export default ApplicationState