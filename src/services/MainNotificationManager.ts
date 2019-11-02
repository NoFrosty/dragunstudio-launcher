import { NotificationManager, InformationType } from './NotificationManager';

class MainNotificationManager implements NotificationManager {
    alert(message: string, informationType: InformationType): void {
        throw new Error("Method not implemented.");
    }
    confirm(message: string, informationType: InformationType): void {
        throw new Error("Method not implemented.");
    }
    notify(message: string, informationType: InformationType): void {
        throw new Error("Method not implemented.");
    }
    error(message: string): void {
        throw new Error("Method not implemented.");
    }
    warning(message: string): void {
        throw new Error("Method not implemented.");
    }
    information(message: string): void {
        throw new Error("Method not implemented.");
    }
    snack(message: string): void {
        throw new Error("Method not implemented.");
    }
}

export default MainNotificationManager