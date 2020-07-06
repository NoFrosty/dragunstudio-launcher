import { required, email, alpha, confirmed, digits, alpha_dash, alpha_spaces, min } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "This field is required"
});

extend("email",  {
    ...email,
    message: "This field must be a valid email"
});

extend("alpha",{
    ...alpha
});

extend("confirmed",{
    ...confirmed,
    message: "Password does not match"
});

extend("alpha_dash",alpha_dash)

extend("alpha_spaces",alpha_spaces)

extend("digits", digits);
extend("min",{
    ...min,
    message: "Password must be minimum of 6 character"
})

