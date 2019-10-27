import {GameNameEnum} from "./GameNameEnum";
import { SemVersion } from './SemVersion';

export interface Application {

    ApplicationId: string;
    Name: string;
    IsPublished: boolean;
    InMaintenance: boolean;
    Path: string;
    ExeName: string;
    Size: number;
    Version: SemVersion;

}