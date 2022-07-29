import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_URL,
});

// export const axiosPrivate = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
