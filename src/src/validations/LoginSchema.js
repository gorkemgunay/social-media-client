import { object, string } from "yup";

const LoginSchema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

export default LoginSchema;
