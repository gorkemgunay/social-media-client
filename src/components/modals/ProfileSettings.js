import React from "react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import Form from "../Form";
import Input from "../Input";
import Textarea from "../Textarea";
import Button from "../Button";
import useAxiosPrivate from "../../useAxiosPrivate";
import { useSocketContext } from "../../contexts/SocketContext";

function ProfileSettings({ profile, setShowModal }) {
  const axiosPrivate = useAxiosPrivate();
  const { socket } = useSocketContext();

  const formik = useFormik({
    initialValues: {
      name: profile?.name,
      surname: profile?.surname,
      email: profile?.email,
      biography: profile?.biography,
    },
    onSubmit: async (values) => {
      const response = await axiosPrivate.post("/user/update", {
        name: values.name,
        surname: values.surname,
        biography: values.biography,
      });
      const data = response?.data;
      if (data) {
        socket.emit("updateProfileSettings", {
          profileId: profile?._id,
          name: values.name,
          surname: values.surname,
          biography: values.biography,
        });
        toast.success("Profile updated successfully.");
        setShowModal(false);
      }
    },
  });
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <Form
        className="max-w-4xl w-full flex-col p-8 bg-white dark:bg-slate-900 rounded-xl"
        onSubmit={formik.handleSubmit}>
        <h3>Profile Settings</h3>
        <Input
          name="name"
          label="Name"
          placeholder="Please enter your name."
          onChange={formik.handleChange}
          value={formik.values.name}
          error={formik.errors.name}
        />
        <Input
          name="surname"
          label="Surname"
          placeholder="Please enter your surname."
          onChange={formik.handleChange}
          value={formik.values.surname}
          error={formik.errors.surname}
        />

        <Input
          name="email"
          label="Email"
          value={formik.values.email}
          disabled
        />

        <Textarea
          name="biography"
          label="Profile Biography"
          placeholder="Please enter biography."
          onChange={formik.handleChange}
          value={formik.values.biography}
          error={formik.errors.biography}
        />
        <Button
          className="text-sm"
          disabled={
            !formik.values.name ||
            !formik.values.surname ||
            !formik.isValid ||
            formik.isSubmitting
          }
          loading={formik.isSubmitting}>
          Update Profile
        </Button>
        <Button
          type="button"
          className="bg-red-500 dark:bg-red-700 text-sm"
          onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Form>
    </div>
  );
}

export default React.memo(ProfileSettings);
