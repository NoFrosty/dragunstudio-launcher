import services from '@/container';
import { Logger } from 'winston';
import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import Notifier from '@/services/Notifier';

abstract class ServiceBase {
    private _store : Store<ApplicationState>;
    private _notifier : Notifier;
    private _logger : Logger;

    // A dark magic is going on here!
    // The shitty IoC library can't resolve super class' constructor arguments.
    // So we are temporarily not injecting the services but using Service Locator anti pattern.
    constructor() {
        this._store = services.resolve<Store<ApplicationState>>('store');
        this._notifier = services.resolve<Notifier>('notifier');
        this._logger = services.resolve<Logger>('logger');
    }

    protected get store() : Store<ApplicationState> {
        return this._store;
    }

    protected get notifier() : Notifier {
        return this._notifier;
    }

    protected get logger() : Logger {
        return this._logger;
    }
}

export default ServiceBase;