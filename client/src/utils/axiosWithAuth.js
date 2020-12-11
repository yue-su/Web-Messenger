import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    baseURL: "http://192.168.1.11:3001/api",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
