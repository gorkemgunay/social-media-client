import { object, string } from "yup";

const PostSchema = object({
  title: string().min(6).required(),
  body: string().min(6).required(),
});

export default PostSchema;
