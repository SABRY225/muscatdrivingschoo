import axios from "axios";
console.log(process.env.REACT_APP_API_KEY);
const instance = axios.create({
 // baseURL: process.env.REACT_APP_API_KEY,
  BASE_URL : process.env.REACT_APP_API_KEY,
  "Content-Type": "multipart/form-data",
});

export default instance;
