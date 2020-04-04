import { NotificationManager } from './NotificationManager';

class MainNotificationManager implements NotificationManager {
    alert(message: string): void {
        throw new Error("Method not implemented.");
    }
    confirm(message: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    notify(message: string): void {
        throw new Error("Method not implemented.");
    }
    success(message: string): void {
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

const mainNotificationManager = new MainNotificationManager();

export default mainNotificationManager
export { MainNotificationManager }