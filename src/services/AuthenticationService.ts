import axios from 'axios';
import RendererServiceBase from './RendererServiceBase';
import { eventBus } from '@/services/services';

class AuthenticationService extends RendererServiceBase {
    public onInitialize() {
        if (this.store.state.jwt) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.store.state.jwt;
        }
        else {
            this.SignOut();
        }
    }

    async AttemptSignIn(credentials: {email : string, password : string}, staySignedIn: boolean) : Promise<boolean> {
        const parameters = {
            Email: credentials.email,
            Password: credentials.password
        };
        try {
            const loginResult = await axios.post(process.env.VUE_APP_API_LINK + "/authenticate", parameters);
            if (loginResult.data.isSuccessfull) {
                this.store.dispatch('signIn', { 
                    jwt: staySignedIn ? loginResult.data.token : null,
                    username: loginResult.data.username
                });
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginResult.data.token;
                return true;
            }
            else{
                return false;
            }
        }
        catch {
            return false;
        }        
    }

    async AttemptSignUp(credentials: { username: string, firstName: string, lastName: string, country: string, email: string, password: string, birthday: Date}) {
        let signUpResult;
        const parameters = {
            Username: credentials.username,
            Email: credentials.email,
            FirstName: credentials.firstName,
            LastName: credentials.lastName,
            Birthday: credentials.birthday,
            Country: credentials.country,
            Password: credentials.password
        };
        try {
            signUpResult = await axios.post(process.env.VUE_APP_API_LINK + "/users", parameters);
            return signUpResult.data;
        }
        catch {
            return signUpResult;
        }        
    }

    async SignOut() {
        try {
            await axios.post(process.env.VUE_APP_API_LINK + "/authenticate/signout");
        }
        finally {
            this.store.dispatch('signOut');
            axios.defaults.headers.common['Authorization'] = null;
            eventBus.emitter.emit('on-signout');
        }
    }

    IsSignedIn() {
        return this.store.state.isSignedIn;
    }
}

export default AuthenticationService