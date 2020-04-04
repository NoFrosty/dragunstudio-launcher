interface NotificationManager {
    alert(message : string) : void;
    confirm(message : string) : Promise<boolean>;
    
    notify(message : string) : void;
    success(message : string) : void;
    success(message : string) : void;
    error(message : string) : void;
    warning(message : string) : void;
    information(message : string) : void;

    snack (message : string) : void;
}

export {
    NotificationManager
}