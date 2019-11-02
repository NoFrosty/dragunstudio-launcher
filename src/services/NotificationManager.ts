enum InformationType {
    Information,
    Error,
    Warning
}

interface NotificationManager {
    alert(message : string, informationType : InformationType) : void;
    confirm(message : string, informationType : InformationType) : void;
    
    notify(message : string, informationType : InformationType) : void;
    error(message : string) : void;
    warning(message : string) : void;
    information(message : string) : void;

    snack (message : string) : void;
}

export {
    NotificationManager, InformationType
}