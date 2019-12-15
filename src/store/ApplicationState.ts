import { InstallationInfo } from '@/models/InstallationInfo';
import { ApplicationStatus } from '@/models/ApplicationStatus';

interface ApplicationState {
    isSignedIn : boolean
    username : string
    jwt : string,
    isOffline?: boolean,
    selectedApplicationId?: string,
    installedApplications: InstallationInfo[],
    applicationStatuses: ApplicationStatus[]
}

export default ApplicationState