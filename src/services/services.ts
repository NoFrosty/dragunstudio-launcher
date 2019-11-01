import { asClass, asValue } from 'awilix'

import services from '@/container'

import router from '@/router'
import store from '@/store/store'

import AuthenticationService from "@/services/AuthenticationService";
import ApplicationLibrary from "@/services/ApplicationLibrary";
import InstallationManager from "@/services/InstallationManager";
import RepairService from "@/services/RepairService";
import Notifier from "@/services/Notifier";
import logger from "@/services/logger";


services.register({
    store: asValue(store),
    router: asValue(router),
    
    authenticationService: asClass(AuthenticationService).singleton(),
    applicationLibrary: asClass(ApplicationLibrary).singleton(),
    installationManager: asClass(InstallationManager).singleton(),
    repairService: asClass(RepairService).singleton(),
    notifier: asClass(Notifier).singleton(),
    logger: asValue(logger)
});


// Also export singleton instances so we won't need to search IoC all the time and can import them directly
const authenticationService = services.resolve<AuthenticationService>('authenticationService');
const applicationLibrary = services.resolve<ApplicationLibrary>('applicationLibrary');
const installationManager = services.resolve<InstallationManager>('installationManager');
const repairService = services.resolve<RepairService>('repairService');
const notifier = services.resolve<Notifier>('notifier');

export {
    services,
    authenticationService,
    applicationLibrary,
    installationManager,
    repairService,
    notifier,
    logger
};
export default services;