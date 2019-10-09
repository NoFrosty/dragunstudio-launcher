import {GameNameEnum} from "./GameNameEnum";
import { SemVersion } from './SemVersion';

export class Game {

    public GameName: GameNameEnum;
    public Path: string;
    public ExeName: string;
    public Size: number;
    public Version: SemVersion;

    constructor(gameName: GameNameEnum, path: string, exeName: string, size: number, version: SemVersion){
        this.GameName = gameName;
        this.Path = path;
        this.ExeName = exeName;
        this.Size = size;
        this.Version = version;
    }

}