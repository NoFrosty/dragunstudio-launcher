const bsdiff = require('bsdiff-nodejs');

export default class PatchManager {
    public async Patch(oldFilePath:string, newFilePath:string, diffFilePath:string){
        bsdiff.patchSync(oldFilePath, newFilePath, diffFilePath);
    }
}