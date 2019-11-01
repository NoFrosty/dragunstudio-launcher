import FileInfo from '@/models/FileInfo'

enum ActionType {
    CreateFile = 0,
    DeleteFile = 1,
    UpdateFile = 2,
    CopyFile = 3
}

interface UpdateAction {
    actionType: ActionType;
}

interface UpdateActionCreateFile extends UpdateAction {
    actionType: ActionType
    newFile: FileInfo
}

interface UpdateActionCopyFile extends UpdateAction {
    actionType: ActionType
    sourceFile: FileInfo
    destinationFile: FileInfo
}

interface UpdateActionDeleteFile extends UpdateAction {
    actionType: ActionType
    file: FileInfo
}

interface UpdateActionUpdateFile extends UpdateAction {
    actionType: ActionType
    oldFile: FileInfo
    newFile: FileInfo
    diffId: string
}

export {
    ActionType,
    UpdateAction,
    UpdateActionCreateFile,
    UpdateActionCopyFile,
    UpdateActionDeleteFile,
    UpdateActionUpdateFile
}