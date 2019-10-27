import Vue from 'vue'
import Vuex from 'vuex';
import ApplicationState from './State';

Vue.use(Vuex)

const state : ApplicationState = {
    isSignedIn: false,
    username: "",
    jwt: ""
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
        }
    }
})
store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});

export default store