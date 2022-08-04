import { object, string } from "yup";

const RegisterSchema = object({
  name: string().min(3).required(),
  surname: string().min(3).required(),
  email: string().email().required(),
  password: string().min(6).required(),
});

export default RegisterSchema;
