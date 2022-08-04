import { object, string, ref } from "yup";

const ResetPasswordSchema = object({
  password: string().min(6).required(),
  newPassword: string().min(6).required(),
  newPasswordConfirm: string()
    .min(6)
    .oneOf([ref("newPassword"), null], "Passwords must match")
    .required(),
});

export default ResetPasswordSchema;
