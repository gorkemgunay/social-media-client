import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useHandleFetchUser } from "../api/user";
import { Header, Footer, Form, Input, Button } from "../components";
import useAxiosPrivate from "../useAxiosPrivate";
import ResetPasswordSchema from "../validations/ResetPasswordSchema";

function ProfileSettings() {
  const axiosPrivate = useAxiosPrivate();
  useHandleFetchUser();

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      const response = await axiosPrivate.post("/user/reset-password", {
        password: values.password,
        newPassword: values.newPassword,
        newPasswordConfirm: values.newPasswordConfirm,
      });
      const data = response?.data;
      if (data.error) {
        toast.error(data.error);
      } else {
        values.password = "";
        values.newPassword = "";
        values.newPasswordConfirm = "";
        toast.success("Successfully reset password.");
      }
    },
  });

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h2 className="mb-4">Profile Settings</h2>

        <Form onSubmit={formik.handleSubmit} className="flex-col w-full">
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="******"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.errors.password}
          />

          <Input
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="******"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            error={formik.errors.newPassword}
          />

          <Input
            type="password"
            name="newPasswordConfirm"
            label="Confirm New Password"
            placeholder="******"
            onChange={formik.handleChange}
            value={formik.values.newPasswordConfirm}
            error={formik.errors.newPasswordConfirm}
          />
          <Button
            disabled={
              !formik.values.password ||
              !formik.values.newPassword ||
              !formik.values.newPasswordConfirm ||
              formik.values.newPassword !== formik.values.newPasswordConfirm ||
              !formik.isValid ||
              formik.isSubmitting
            }
            loading={formik.isSubmitting}
            className="bg-red-500 dark:bg-red-700 text-xs sm:text-sm h-6 sm:h-10">
            Reset Password
          </Button>
        </Form>
      </div>
      <Footer />
    </>
  );
}

export default ProfileSettings;
