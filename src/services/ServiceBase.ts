import services from '@/container';
import { Logger } from 'winston';
import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import Notifier from '@/services/Notifier';
import { NotificationManager } from './NotificationManager';

interface ServiceBase {
    readonly notification : NotificationManager;
    readonly logger : Logger;
}

export default ServiceBase;