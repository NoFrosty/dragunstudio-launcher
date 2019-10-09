<template>
    <section class="login is-fullheight">
      <div class="login-body">
          <div class="login-page">
              <div class="login-form-wrapper">
                <div class="field-box">
                    <div class="logo">
                    <img src="@/assets/logo.png"/>
                    </div>
                    <h1 class="login-heading">Welcome back !</h1>
                    <p class="login-subheading">We don't need a healer for this, right?</p>
                    <form v-on:submit.prevent="attemptSignIn">
                      <div class="field">
                        <p class="control has-icons-left has-icons-right">
                          <b-field>
                                <b-input size="is-medium" icon-pack="fa"
                                    icon="envelope" v-model="email" type="email"
                                    name="email"
                                    placeholder="Email" required>
                                </b-input>
                            </b-field>
                        </p>
                      </div>
                      <div class="field">
                        <p class="control has-icons-left has-icons-right">
                            <b-field>
                                <b-input size="is-medium" icon-pack="fa"
                                    icon="lock" v-model="password" type="password"
                                    name="password"
                                    placeholder="Password"
                                    password-reveal required>
                                </b-input>
                            </b-field>
                        </p>
                      </div>
                      <div class="field is-grouped is-grouped-centered login-btn-group">
                        <div class="buttons">
                          <b-button type="submit is-primary" @click="attemptSignIn">Login {{wrongIdentifier}}</b-button>
                          <b-button type="is-warning">Register</b-button>
                          <b-button type="is-danger">Forgot Password</b-button>
                          <b-button type="is-info" tag="router-link" :to="{name:'index'}">Without login</b-button>
                        </div>
                      </div>
                    </form>
                </div>
              </div>
              <!-- is-8 ends -->
          </div>
        <!-- div.container ends -->
      </div>
  </section>
</template>
<script>
  import AuthService  from '@/services/auth-service';
export default {
    data() {
        return {
            email: '',
            password: '',
            wrongIdentifier: false
        }
    },
    components: {
    },
    methods: {
        attemptSignIn: async function() {
            
            var isLogged = await this.$root.$AuthService.AttemptSignIn({
                email: this.email,
                password: this.password
            });
            console.log("isLogged :"+isLogged);
            if(isLogged){
                this.wrongIdentifier = false;
            }
            else{
                this.wrongIdentifier = true;
            }
        }
    },
}
</script>

<style>
.logo{
  text-align: center;
}
.login{
      height: 100%;
      display: flex;
}
.login-body{
      width: 100%;
}
.login .login-page{
  height: 100%;
  display: flex;
  align-items: center;
}
.login .login-sidebar, .login-form-wrapper{
  height: 100%;
  flex-grow: 1;
}
.field-box img{
  width: 50%;
}
.field-box .field{margin-bottom: 2.1em;}
.login-form-wrapper .field-box{
  flex-direction: column;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.login-form-wrapper .field-box .login-heading{
  font-size: 1.95em;
  text-align: center;
}
.login-form-wrapper .field-box .login-subheading{
  margin-bottom: 2em;
  font-size: 0.85em;
  color: #787877;
  text-align: center;
}
</style>