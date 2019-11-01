import awilix, { asClass } from 'awilix'

import AuthenticationService from "@/services/AuthenticationService";
import ApplicationLibrary from "@/services/ApplicationLibrary";
import InstallationManager from "@/services/InstallationManager";
import RepairService from "@/services/RepairService";
import Notifier from "@/services/Notifier";

export function registerServices(container : awilix.AwilixContainer) {
    container.register({
        authenticationService: asClass(AuthenticationService).singleton(),
        applicationLibrary: asClass(ApplicationLibrary).singleton(),
        installationManager: asClass(InstallationManager).singleton(),
        repairService: asClass(RepairService).singleton(),
        notifier: asClass(Notifier).singleton()
    });
}