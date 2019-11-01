import { OSType } from './OSType';

export interface VersionInfo {
    versionId: string 
    applicationId: string 
    version: string 
    versionOrder: number
    releaseDate?: Date
    isReleased: boolean
    operatingSystem: OSType
}
