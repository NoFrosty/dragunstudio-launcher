import {GameNameEnum} from "../launcher/GameNameEnum";
import { SemVersion } from '../launcher/SemVersion';

export interface ApplicationInfo {
    ApplicationId: string;
    Name: string;
    IsPublished: boolean;
    InMaintenance: boolean;
    Path: string;
    ExeName: string;
    Size: number;
    Version: SemVersion;
}