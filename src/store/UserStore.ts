import Vue from 'vue'
import Vuex from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { InstallationInfo } from '@/models/InstallationInfo';

Vue.use(Vuex)

const state : ApplicationState = {
    isSignedIn: false,
    username: "",
    jwt: "",
    isOffline: undefined,
    selectedApplicationId: undefined,
    installedApplications: []
}


const store = new Vuex.Store({
    state,
    mutations: {
        initialiseStore(state) {
			// Check if the ID exists
			if(localStorage.getItem('store')) {
				// Replace the state object with the stored item
                let soteObject = localStorage.getItem('store');
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
        removeApplication(state, installation: InstallationInfo) {
            let appIndex = state.installedApplications.findIndex(x => x.ApplicationId == installation.ApplicationId);
            state.installedApplications.splice(appIndex, 1);
        },
        setOfflineStatus(state, isOffline: boolean) {
            state.isOffline = isOffline;
        },
        setSelectedApplicationId (state, selectedApplicationId: string) {
            state.selectedApplicationId = selectedApplicationId;
        },
        getInstalledApplication (state, applicationId: string) {
            return state.installedApplications.find(x => x.ApplicationId == applicationId);
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
        }
    }
})
store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});

export default store