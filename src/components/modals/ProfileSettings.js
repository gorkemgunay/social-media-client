import React from "react";
import { useFormik } from "formik";
import { useUserContext } from "../../contexts/UserContext";
import Form from "../Form";
import Input from "../Input";
import Textarea from "../Textarea";
import Button from "../Button";

function ProfileSettings({ setShowModal }) {
  const { user } = useUserContext();

  const formik = useFormik({
    initialValues: {
      name: user?.name,
      surname: user?.surname,
      biography: user?.biography,
    },
    onSubmit: async () => {},
  });
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <Form
        className="max-w-4xl w-full flex-col p-8 bg-white rounded-xl"
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
        <Textarea
          name="biography"
          label="Profile Biography"
          placeholder="Please enter biography."
          onChange={formik.handleChange}
          value={formik.values.body}
          error={formik.errors.body}
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
          className="bg-red-500 text-sm"
          onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Form>
    </div>
  );
}

export default React.memo(ProfileSettings);
