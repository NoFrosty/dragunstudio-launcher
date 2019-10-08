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
                    <p class="login-subheading">Fill out thisto access super awesome imaginary control panel</p>
                    <form method="" action="">
                      <div class="field">
                        <p class="control has-icons-left has-icons-right">
                          <input class="input is-medium" type="email" placeholder="Email" value="" name="email" autofocus="" required>
                          <span class="icon is-medium is-left">
                            <i class="fa fa-envelope"></i>
                          </span>
                          <span class="icon is-small is-right">
                            <i class="fa fa-check"></i>
                          </span>
                        </p>
                      </div>
                      <div class="field">
                        <p class="control has-icons-left has-icons-right">
                          <input class="input is-medium" type="password" placeholder="Password" name="password" required>
                          <span class="icon is-medium is-left">
                            <i class="fa fa-lock"></i>
                          </span>
                          <span class="icon is-small is-right">
                            <i class="fa fa-eye"></i>
                          </span>
                        </p>
                      </div>
                      <div class="field is-grouped is-grouped-centered login-btn-group">
                        <div class="buttons">
                          <b-button type="is-primary">Login</b-button>
                          <b-button type="is-warning">Register</b-button>
                          <b-button type="is-danger">Forgot Password</b-button>
                          <b-button type="is-info" tag="router-link" to="/">Without login</b-button>
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
    components: {
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