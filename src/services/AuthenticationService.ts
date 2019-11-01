import axios from 'axios';
import ServiceBase from '@/services/ServiceBase';

class AuthenticationService extends ServiceBase {

    async AttemptSignIn(credentials: {email : string, password : string}) {
        let parameters = {
            Email: credentials.email,
            Password: credentials.password
        };
        
        let loginResult = await axios.post(process.env.VUE_APP_API_LINK + "/authenticate", parameters);
        if (loginResult.data.isSuccessfull) {
            this.store.dispatch('signIn', { 
                jwt: loginResult.data.token,
                username: loginResult.data.username
            });
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.state.jwt;
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
            this.store.dispatch('signOut');
            axios.defaults.headers.common['Authorization'] = null;
        }
    }

    IsSignedIn() {
        return this.store.state.isSignedIn;
    }
}

export default AuthenticationService