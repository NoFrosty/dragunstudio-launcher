import services from '@/container';
import { Logger } from 'winston';
import { NotificationManager } from './NotificationManager';
import ServiceBase from '@/services/ServiceBase';
import RendererNotificationManager from './RendererNotificationManager';

abstract class MainServiceBase implements ServiceBase {
    private _notificationManager : NotificationManager;
    private _logger : Logger;

    constructor(notificationManager : RendererNotificationManager, logger : Logger) {
        this._notificationManager = notificationManager;
        this._logger = logger;
    }

    public get notification() : NotificationManager {
        return this._notificationManager;
    }

    public get logger() : Logger {
        return this._logger;
    }
}

export default MainServiceBase;