import {GameNameEnum} from "./GameNameEnum";
import {Game} from "./Game";
import { SemVersion } from './SemVersion';
export class Launcher {

    public games: Game[];
    
    constructor () {
        this.games = new Array<Game>();
        this.games.push(new Game(GameNameEnum.Heroes, "", "", 0, new SemVersion(0,0,0)));
        this.games.push(new Game(GameNameEnum.Diablo, "", "", 0, new SemVersion(0,0,0)));
        this.games.push(new Game(GameNameEnum.LoL, "", "", 0, new SemVersion(0,0,0)));
    }

}