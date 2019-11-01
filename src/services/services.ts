import awilix, { createContainer, InjectionMode, asClass, asValue } from 'awilix'

import router from '@/router'
import store from '@/store/store'

import AuthenticationService from "@/services/AuthenticationService";
import ApplicationLibrary from "@/services/ApplicationLibrary";
import InstallationManager from "@/services/InstallationManager";
import RepairService from "@/services/RepairService";
import Notifier from "@/services/Notifier";

const services = createContainer({
    injectionMode: InjectionMode.CLASSIC
}) 

services.register({
    store: asValue(store),
    router: asValue(router),
    
    authenticationService: asClass(AuthenticationService).singleton(),
    applicationLibrary: asClass(ApplicationLibrary).singleton(),
    installationManager: asClass(InstallationManager).singleton(),
    repairService: asClass(RepairService).singleton(),
    notifier: asClass(Notifier).singleton()
});

const authenticationService = services.resolve<AuthenticationService>('authenticationService');
const applicationLibrary = services.resolve<ApplicationLibrary>('applicationLibrary');
const installationManager = services.resolve<InstallationManager>('installationManager');
const repairService = services.resolve<RepairService>('repairService');
const notifier = services.resolve<Notifier>('notifier');

export default services;
export {
    authenticationService,
    applicationLibrary,
    installationManager,
    repairService,
    notifier
};