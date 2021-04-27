import Vue from 'vue'
import Vuex from 'vuex';
import { InstallationInfo } from '@/models/InstallationInfo';
import { ApplicationStatus, InstallationActionType } from '@/models/ApplicationStatus';
import ApplicationState from '@/store/ApplicationState';

Vue.use(Vuex)

const state : ApplicationState = {
    isSignedIn: false,
    username: "",
    jwt: "",
    isOffline: undefined,
    selectedApplicationId: undefined,
    installedApplications: [],
    applicationStatuses: [],
    isMinimizeInsteadClose: false,
    isMinimizeAsked: false,
    isLaunchWithWindows: false,
    isLaunchWithWindowsAsked: false
}


const store = new Vuex.Store({
    state,
    mutations: {
        initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
				// Replace the state object with the stored item
                const soteObject = localStorage.getItem('store');
                if (soteObject) {
                    this.replaceState(
                        Object.assign(state, JSON.parse(soteObject))
                    );
                }
			}
        },
        
        signIn(state) {
            state.isSignedIn = true;
        },
        signOut(state) {
            state.isSignedIn = false;
        },

        setUsername(state, username) {
            state.username = username;
        },
        setJWT(state, jwt) {
            state.jwt = jwt;
        },
        addNewApplication(state, installation: InstallationInfo) {
            state.installedApplications.push(installation);
        },
        changeApplicationVersion(state, payload:{applicationId: string, versionId: string, version: string}) {
            const installedApp = state.installedApplications.find(x => x.applicationId == payload.applicationId);
            if(!installedApp) throw "Application is not installed !"
            installedApp.versionId = payload.versionId;
            installedApp.version = payload.version;
        },
        removeApplication(state, installation: InstallationInfo) {
            const appIndex = state.installedApplications.findIndex(x => x.applicationId == installation.applicationId);
            state.installedApplications.splice(appIndex, 1);
        },
        setOfflineStatus(state, isOffline: boolean) {
            state.isOffline = isOffline;
        },
        setSelectedApplicationId (state, selectedApplicationId: string) {
            state.selectedApplicationId = selectedApplicationId;
        },
        getInstalledApplication (state, applicationId: string) {
            return state.installedApplications.find(x => x.applicationId == applicationId);
        },
        setApplicationInstallationActionType (state, payload: { applicationId: string, actionType: InstallationActionType }) {
            let status = state.applicationStatuses.find(x => x.applicationId == payload.applicationId);
            if (!status) {
                status = ApplicationStatus.createDefault(payload.applicationId);
                state.applicationStatuses.push(status);
            }
            status.currentActionType = payload.actionType;
        },
        markApplicationAsHasUpdate (state, payload: { applicationId: string, hasUpdate: boolean }) {
            let status = state.applicationStatuses.find(x => x.applicationId == payload.applicationId);
            if (!status) {
                status = ApplicationStatus.createDefault(payload.applicationId);
                state.applicationStatuses.push(status);
            }
            status.hasUpdate = payload.hasUpdate;
        },
        setMinimize(state, value : boolean){
            state.isMinimizeInsteadClose = value;
            state.isMinimizeAsked = true;
        },
        setWindowsStart(state, value : boolean){
            state.isLaunchWithWindows = value;
            state.isLaunchWithWindowsAsked = true;
        }
    },
    actions: {
        signIn ({ commit }, signInContext) {
            commit('setJWT', signInContext.jwt);
            commit('setUsername', signInContext.username);
            commit('signIn');
        },
        signOut ({ commit }) {
            commit('setJWT', "");
            commit('setUsername', "");
            commit('signOut');
        },
        addNewApplication ({ commit }, installation: InstallationInfo) {
            commit('addNewApplication', installation);
        },
        changeApplicationVersion ({ commit }, payload:{applicationId: string, versionId: string, version: string}) {
            commit('changeApplicationVersion', payload);
        },
        removeApplication ({ commit }, installation: InstallationInfo) {
            commit('removeApplication', installation);
        },
        setOfflineStatus ({ commit }, isOffline: boolean) {
            commit('setOfflineStatus', isOffline);
        },
        setSelectedApplicationId ({ commit }, selectedApplicationId: string) {
            commit('setSelectedApplicationId', selectedApplicationId);
        },
        getInstalledApplication ({ commit }, applicationId: string) {
            commit('getInstalledApplication', applicationId);
        },
        setApplicationInstallationActionType ({ commit }, payload: { applicationId: string, actionType: InstallationActionType }) {
            commit('setApplicationInstallationActionType', payload);
        },
        markApplicationAsHasUpdate ({ commit }, payload: { applicationId: string, hasUpdate: boolean }) {
            commit('markApplicationAsHasUpdate', payload);
        },
        setMinimize ({ commit }, value : boolean) {
            commit('setMinimize', value);
        },
        setWindowsStart ({ commit }, value : boolean) {
            commit('setWindowsStart', value);
        }
    }
})
store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});

export default store