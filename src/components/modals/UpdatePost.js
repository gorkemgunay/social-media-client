import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useSocketContext } from "../../contexts/SocketContext";
import { useUserContext } from "../../contexts/UserContext";
import useAxiosPrivate from "../../useAxiosPrivate";
import PostSchema from "../../validations/PostSchema";
import Form from "../Form";
import Input from "../Input";
import Textarea from "../Textarea";
import Button from "../Button";

function UpdatePost({ post, setShowModal }) {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const axiosPrivate = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      title: post.title,
      body: post.body,
    },
    validationSchema: PostSchema,
    onSubmit: async (values) => {
      const response = await axiosPrivate.patch(`/posts/${post._id}`, {
        title: values.title,
        body: values.body,
      });
      const data = response?.data;
      if (data) {
        socket.emit("updatePost", { ...data, user: { ...user } });
        values.title = "";
        values.body = "";
        toast.success("Post updated successfully.");
        setShowModal(false);
      }
    },
  });
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center transition-all bg-black/40">
      <Form
        className="max-w-2xl w-full flex-col p-8 bg-white rounded-xl"
        onSubmit={formik.handleSubmit}>
        <h3>Update Post</h3>
        <Input
          name="title"
          label="Post Title"
          placeholder="Please enter post title."
          onChange={formik.handleChange}
          value={formik.values.title}
          error={formik.errors.title}
        />
        <Textarea
          name="body"
          label="Post Body"
          placeholder="Please enter post content."
          onChange={formik.handleChange}
          value={formik.values.body}
          error={formik.errors.body}
        />
        <Button
          className="text-sm"
          disabled={
            !formik.values.title ||
            !formik.values.body ||
            !formik.isValid ||
            formik.isSubmitting
          }
          loading={formik.isSubmitting}>
          Update Post
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

export default React.memo(UpdatePost);
