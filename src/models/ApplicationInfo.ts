import { OSType } from './OSType';

export interface ApplicationInfo {
    applicationId: string;
    name: string;
    isPublished: boolean;
    inMaintenance: boolean;
    supportedOperatingSystems : OSType
}