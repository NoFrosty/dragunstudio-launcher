import { required, email, alpha, confirmed, digits } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "This field is required"
});

extend("email", {
  ...email,
  message: "This field must be a valid email"
});

extend("alpha",{
    ...alpha,
    message: "This field may contain only alphabetic characters"
});

extend("confirmed",{
    ...confirmed,
    message: "Password does not match"
});

extend("digits", digits);

