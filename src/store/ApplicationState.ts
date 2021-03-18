import { InstallationInfo } from '@/models/InstallationInfo';
import { ApplicationStatus } from '@/models/ApplicationStatus';

interface ApplicationState {
    isSignedIn : boolean
    username : string
    jwt : string,
    isOffline?: boolean,
    selectedApplicationId?: string,
    installedApplications: InstallationInfo[],
    applicationStatuses: ApplicationStatus[],
    isMinimizeAsked: boolean,
    isMinimizeInsteadClose: boolean,
    isLaunchWithWindows: boolean,
    isLaunchWithWindowsAsked: boolean
}

export default ApplicationState