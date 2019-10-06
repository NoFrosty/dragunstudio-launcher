import axios from 'axios';

class AuthService {
    constructor(store) {
        this.$store = store;
    }

    async AttemptSignIn({email, password}) {
        let parameters = {
            Email: email,
            Password: password
        };
        
        let loginResult = await axios.post(process.env.VUE_APP_API_LINK+"authenticate", parameters);
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
        await axios.post(process.env.VUE_APP_API_LINK+"authenticate/signout");
        this.$store.dispatch('signOut');
        axios.defaults.headers.common['Authorization'] = null;
    }
}

export default AuthService