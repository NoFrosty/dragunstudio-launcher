import { Logger } from 'winston';
import { NotificationManager } from './NotificationManager';

interface ServiceBase {
    readonly notification : NotificationManager;
    readonly logger : Logger;
}

export default ServiceBase;