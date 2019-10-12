import axios from 'axios';
import Vue from 'vue';
import { Store } from 'vuex';
import ApplicationState from '@/store/State';

class AuthService {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }

    async AttemptSignIn(credentials: {email : string, password : string}) {
        let parameters = {
            Email: credentials.email,
            Password: credentials.password
        };
        
        let loginResult = await axios.post(process.env.VUE_APP_API_LINK+"authenticate", parameters);
        if (loginResult.data.isSuccessfull) {
            this.$store.dispatch('signIn', { 
                jwt: loginResult.data.token,
                username: loginResult.data.username
            }).then(() => {
              });
              console.log("log true");
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.jwt;
            return true;
        }
        else{
            console.log("log false");

            return false;
        }
        
    }

    async SignOut() {
        await axios.post(process.env.VUE_APP_API_LINK+"authenticate/signout");
        this.$store.dispatch('signOut');
        axios.defaults.headers.common['Authorization'] = null;
    }
}

export default AuthService