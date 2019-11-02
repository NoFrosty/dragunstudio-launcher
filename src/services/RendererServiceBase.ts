import services from '@/container';
import { Logger } from 'winston';
import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { NotificationManager } from './NotificationManager';
import ServiceBase from '@/services/ServiceBase';
import RendererNotificationManager from './RendererNotificationManager';

abstract class RendererServiceBase implements ServiceBase {
    private _store : Store<ApplicationState>;
    private _notificationManager : NotificationManager;
    private _logger : Logger;

    // A dark magic is going on here!
    // The shitty IoC library can't resolve super class' constructor arguments.
    // So we are temporarily not injecting the services but using Service Locator anti pattern.
    constructor() {
        this._store = services.resolve<Store<ApplicationState>>('store');
        this._notificationManager = services.resolve<RendererNotificationManager>('notificationManager');
        this._logger = services.resolve<Logger>('logger');
    }

    public get store() : Store<ApplicationState> {
        return this._store;
    }

    public get notification() : NotificationManager {
        return this._notificationManager;
    }

    public get logger() : Logger {
        return this._logger;
    }
}

export default RendererServiceBase;