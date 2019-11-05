const bspatch = require('bspatch');
export default class PatchManager {
    
    public async Patch(oldFilePath:string, newFilePath:string, diffFilePath:string){
        bspatch.patchSync(oldFilePath, newFilePath, diffFilePath);
    }
}