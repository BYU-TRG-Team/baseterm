import axios from "axios";

export default axios.create({
  baseURL: "/baseterm",
  responseType: 'json',
});