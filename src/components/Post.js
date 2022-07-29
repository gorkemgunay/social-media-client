import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSocketContext } from "../contexts/SocketContext";
import { useUserContext } from "../contexts/UserContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useHandleFetchComments } from "../api/comment";
import Button from "./Button";
import Comment from "./Comment";
import CommentsList from "./CommentsList";
import Form from "./Form";
import Input from "./Input";
import UpdatePost from "./modals/UpdatePost";

function Post({ post, substring = false, showComments = false }) {
  const [showModal, setShowModal] = useState(false);
  const { socket } = useSocketContext();
  const axiosPrivate = useAxiosPrivate();
  const { user } = useUserContext();
  const { comments, setComments } = useHandleFetchComments(post._id);

  useEffect(() => {
    socket.on("getNewComment", (newComment) => {
      if (newComment.post === post._id) {
        setComments((prev) => [...prev, newComment]);
      }
    });
  }, []);

  useEffect(() => {
    if (comments) {
      socket.on("getDeletedComment", (deletedComment) => {
        if (deletedComment.post === post._id) {
          setComments(
            comments.filter(
              (filterComment) => filterComment._id !== deletedComment._id,
            ),
          );
        }
      });
    }
  }, [comments]);

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: async (values) => {
      const response = await axiosPrivate.post("/comment", {
        text: values.text,
        postId: post._id,
      });
      const data = response?.data;
      if (data) {
        socket.emit("createComment", { ...data, user: { ...user } });
        values.text = "";
        toast.success("Comment created successfully.");
      }
    },
  });

  const createCommentFormContent = (
    <div>
      <Form onSubmit={formik.handleSubmit} className="justify-between">
        <Input
          name="text"
          label="Text"
          placeholder="Type your comment..."
          onChange={formik.handleChange}
          value={formik.values.text}
          error={formik.errors.text}
        />

        <Button
          className="text-sm flex-shrink-0 self-end"
          disabled={
            !formik.values.text || !formik.isValid || formik.isSubmitting
          }
          loading={formik.isSubmitting}>
          Send Comment
        </Button>
      </Form>
    </div>
  );

  const commentsListContent = (
    <>
      <h4>Comments</h4>
      <CommentsList>
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </CommentsList>
    </>
  );

  return (
    <>
      {showModal && <UpdatePost post={post} setShowModal={setShowModal} />}
      <div className="p-8 flex flex-col gap-4 border border-slate-100 rounded-xl">
        <div className="flex items-center justify-between">
          <Link to={`/post/${post._id}`}>
            <h3 className="inline-block text-indigo-600">{post.title}</h3>
          </Link>

          {user?._id === post.user._id && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50"
                onClick={() => setShowModal(true)}>
                Update
              </Button>
              <Button
                type="button"
                className="px-2 h-6 text-xs text-indigo-600 bg-indigo-50"
                onClick={async () => {
                  const response = await axiosPrivate.delete(
                    `/posts/${post._id}`,
                  );
                  const data = response?.data;
                  if (data) {
                    socket.emit("deletePost", data);
                    toast.success("Post deleted successfully.");
                  }
                }}>
                Delete
              </Button>
            </div>
          )}
        </div>
        {substring && post.body.length >= 250 && (
          <p>{post.body.substring(0, 249)}</p>
        )}
        {substring && post.body.length < 250 && <p>{post.body}</p>}
        {!substring && <p>{post.body}</p>}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${post?.user?._id}`}>
            <small className="text-slate-400 capitalize">
              {post.user.name} {post.user.surname}
            </small>
          </Link>
          {comments && comments?.length !== 0 && (
            <div>
              <small className="text-slate-400">
                {comments?.length <= 1
                  ? `${comments?.length} comment`
                  : `${comments?.length} comments`}
              </small>
            </div>
          )}
        </div>
        {showComments && (
          <>
            {comments && comments?.length !== 0 && commentsListContent}
            {createCommentFormContent}
          </>
        )}
      </div>
    </>
  );
}

export default React.memo(Post);
