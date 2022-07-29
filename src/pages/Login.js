import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthContext } from "../contexts/AuthContext";
import { Button, Input, Form } from "../components";
import LoginSchema from "../validations/LoginSchema";
import axios from "../axios";

function Login() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthContext();

  const handleFetchLogin = async (email, password) => {
    const response = await axios.post("/user/login", {
      email,
      password,
    });
    const data = response?.data;
    return data;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const data = await handleFetchLogin(values.email, values.password);
      if (data.error) {
        toast.error(data.error);
      } else {
        setAccessToken(data.accessToken);
        localStorage.setItem("user", data.refreshToken);
        values.email = "";
        values.password = "";
        toast.success("Successfully logged in.");
        navigate("/", { replace: true });
      }
    },
  });

  return (
    <div className="max-w-2xl h-full flex items-center justify-center flex-col mx-auto">
      <h2 className="mb-4">Login Page</h2>
      <Form onSubmit={formik.handleSubmit} className="flex-col w-full">
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="example@mail.com"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="******"
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.errors.password}
        />
        <Button
          disabled={
            !formik.values.email ||
            !formik.values.password ||
            !formik.isValid ||
            formik.isSubmitting
          }
          loading={formik.isSubmitting}
          className="w-full text-sm">
          Login
        </Button>
      </Form>
      <p className="mt-4 text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-indigo-600">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
