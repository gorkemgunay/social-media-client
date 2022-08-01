import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import RegisterSchema from "../validations/RegisterSchema";
import { Button, Form, Input } from "../components/index";
import { useSocketContext } from "../contexts/SocketContext";

function Register() {
  const { socket } = useSocketContext();

  const navigate = useNavigate();

  const handleFetchRegister = async (name, surname, email, password) => {
    const response = await axios.post("/user/register", {
      name,
      surname,
      email,
      password,
    });
    const data = response?.data;
    return data;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      const data = await handleFetchRegister(
        values.name,
        values.surname,
        values.email,
        values.password,
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        socket.emit("registeredUser", {
          _id: data._id,
          name: data.name,
          surname: data.surname,
        });
        toast.success("Successfully registered.");
        navigate("/login", { replace: true });
      }
    },
  });

  return (
    <div className="max-w-4xl px-4 h-screen flex items-center justify-center flex-col mx-auto">
      <h2 className="mb-4">Register Page</h2>
      <Form onSubmit={formik.handleSubmit} className="flex-col w-full">
        <Input
          name="name"
          label="Name"
          placeholder="John"
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
        <Input
          name="surname"
          label="Surname"
          placeholder="Doe"
          onChange={formik.handleChange}
          value={formik.values.surname}
          error={formik.errors.surname}
        />
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
            !formik.values.name ||
            !formik.values.surname ||
            !formik.values.email ||
            !formik.values.password ||
            !formik.isValid ||
            formik.isSubmitting
          }
          loading={formik.isSubmitting}
          className="w-full text-sm">
          Register
        </Button>
      </Form>
      <p className="mt-4 text-sm text-slate-400">
        Have an account?{" "}
        <Link to="/login" className="text-indigo-600">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
