export default interface FileInfo {
    type:'FileInfo'
    fileId : string
    versionId : string
    fileName  : string
    directoryPath : string
    hash : string
    size : number
    compressedSize : number
}