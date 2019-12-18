import { ToastProgrammatic, DialogProgrammatic} from 'buefy'
import { NotificationManager, InformationType } from './NotificationManager';

class RendererNotificationManager implements NotificationManager {
    alert(message: string, informationType: InformationType): void {
        throw new Error("Method not implemented.");
    }
    async confirm(message: string, informationType: InformationType): Promise<boolean> {
        return new Promise((resolve: any) =>{
            DialogProgrammatic.confirm({
                title: 'Confirmation',
                message: message,
                confirmText: 'Yes',
                type: 'is-primary',
                hasIcon: true,
                onConfirm: () => {
                    resolve(true)
                },
                onCancel: () => {
                    resolve(false);
                }
            });
        });
    }
    notify(message: string, informationType: InformationType): void {
        ToastProgrammatic.open({
            duration: 5000,
            message: message,
            position: 'is-top',
            type: 'is-success'
        });
    }
    error(message: string): void {
        ToastProgrammatic.open({
            duration: 5000,
            message: message,
            position: 'is-top',
            type: 'is-danger'
        });
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

export default RendererNotificationManager