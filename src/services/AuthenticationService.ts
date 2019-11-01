import axios from 'axios';
import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';

class AuthenticationService {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
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
        }
    }

    IsSignedIn() {
        return this.$store.state.isSignedIn;
    }
}

export default AuthenticationService