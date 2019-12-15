enum InstallationActionType {
    NoAction,
    Update,
    Uninstall
}

interface ApplicationStatus {
    hasUpdate : boolean
    currentActionType : InstallationActionType
    applicationId : string
}

namespace ApplicationStatus {
    export function createDefault(applicationId: string) : ApplicationStatus {
        return {
            applicationId: applicationId,
            currentActionType: InstallationActionType.NoAction,
            hasUpdate: false
        };
    }
}

export { ApplicationStatus, InstallationActionType }