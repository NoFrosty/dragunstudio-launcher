import Platforms from './Platforms';
import { VersionInfo } from './VersionInfo';

export interface ApplicationInfo {
    applicationId: string;
    name: string;
    isPublished: boolean;
    inMaintenance: boolean;
    description: string;
    platforms: ApplicationPlatform[]
    lastVersions: VersionInfo[]
}

interface ApplicationPlatform{
    applicationId: string;
    operatingSystem: number;
    executablePath: string;
}