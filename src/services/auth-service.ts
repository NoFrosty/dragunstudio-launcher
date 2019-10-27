import axios from 'axios';
import Vue from 'vue';
import { Store } from 'vuex';
import Router from 'vue-router'
import ApplicationState from '@/store/State';

class AuthService {
    private $store : Store<ApplicationState>;
    private $router : Router;

    constructor(store : Store<ApplicationState>, router : Router) {
        this.$store = store;
        this.$router = router;
    }

    async AttemptSignIn(credentials: {email : string, password : string}) {
        let parameters = {
            Email: credentials.email,
            Password: credentials.password
        };
        
        let loginResult = await axios.post(process.env.VUE_APP_API_LINK + "/authenticate", parameters);
        if (loginResult.data.isSuccessfull) {
            this.$store.dispatch('signIn', { 
                jwt: loginResult.data.token,
                username: loginResult.data.username
            }).then(() => {
            });
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.jwt;
            return true;
        }
        else{
            return false;
        }
        
    }

    async SignOut() {
        try {
            await axios.post(process.env.VUE_APP_API_LINK + "/authenticate/signout");
        }
        finally {
            this.$store.dispatch('signOut');
            axios.defaults.headers.common['Authorization'] = null;
            this.$router.push({ name: "login" });
        }
    }

    IsSignedIn() {
        return this.$store.state.isSignedIn;
    }
}

export default AuthService