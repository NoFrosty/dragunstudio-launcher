<template>
    <div class="modal-view login">
        <div class="modal-view-head">
            <h2 class="modal-view-subject">Login</h2>
        </div>
         <b-field label="Email">
            <b-input
                type="email"
                :value="email"
                placeholder="Your email"
                required>
            </b-input>
        </b-field>

        <b-field label="Password">
            <b-input
                type="password"
                :value="password"
                password-reveal
                placeholder="Your password"
                required>
            </b-input>
        </b-field>
        <button class="button is-primary">Login</button>
    </div>
</template>
<script>
export default {
    data() {
            return {
                formProps: {
                    email: '',
                    password: ''
                }
            }
        }
}
</script>