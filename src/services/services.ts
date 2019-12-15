import { asClass, asValue } from 'awilix'

import services from '@/container'

import router from '@/router'
import store from '@/store/store'

import AuthenticationService from "@/services/AuthenticationService";
import ApplicationLibrary from "@/services/ApplicationLibrary";
import InstallationManager from "@/services/InstallationManager";
import RepairService from "@/services/RepairService";
import RendererNotificationManager from "@/services/RendererNotificationManager";
import PatchManager from "@/services/PatchManager";
import logger from "@/services/logger";
import { EventBus } from "ts-bus";

const eventBus = new EventBus();

services.register({
    store: asValue(store),
    router: asValue(router),
    eventBus: asValue(eventBus),
    
    authenticationService: asClass(AuthenticationService).singleton(),
    applicationLibrary: asClass(ApplicationLibrary).singleton(),
    installationManager: asClass(InstallationManager).singleton(),
    repairService: asClass(RepairService).singleton(),
    patchManager: asClass(PatchManager).singleton(),
    notificationManager: asClass(RendererNotificationManager).singleton(),
    logger: asValue(logger)
});


// Also export singleton instances so we won't need to search IoC all the time and can import them directly
const authenticationService = services.resolve<AuthenticationService>('authenticationService');
const applicationLibrary = services.resolve<ApplicationLibrary>('applicationLibrary');
const installationManager = services.resolve<InstallationManager>('installationManager');
const repairService = services.resolve<RepairService>('repairService');
const patchManager = services.resolve<PatchManager>('patchManager');
const notificationManager = services.resolve<RendererNotificationManager>('notificationManager');

export {
    store,
    router,
    eventBus,
    services,
    authenticationService,
    applicationLibrary,
    installationManager,
    repairService,
    notificationManager,
    patchManager,
    logger
};
export default services;