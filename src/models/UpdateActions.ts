import FileInfo from '@/models/FileInfo'

enum ActionType {
    CreateFile = 0,
    DeleteFile = 1,
    UpdateFile = 2,
    CopyFile = 3
}

interface UpdateAction {
    ActionType: ActionType;
}

interface UpdateActionCreateFile extends UpdateAction {
    ActionType: ActionType
    NewFile: FileInfo
}

interface UpdateActionCopyFile extends UpdateAction {
    ActionType: ActionType
    SourceFile: FileInfo
    DestinationFile: FileInfo
}

interface UpdateActionDeleteFile extends UpdateAction {
    ActionType: ActionType
    File: FileInfo
}

interface UpdateActionUpdateFile extends UpdateAction {
    ActionType: ActionType
    OldFile: FileInfo
    NewFile: FileInfo
    DiffId: string
}

export {
    ActionType,
    UpdateAction,
    UpdateActionCreateFile,
    UpdateActionCopyFile,
    UpdateActionDeleteFile,
    UpdateActionUpdateFile
}