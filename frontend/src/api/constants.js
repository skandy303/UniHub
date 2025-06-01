import axios from "axios";

export const client = axios.create({
  baseURL: "https://unihub-c09.me/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
