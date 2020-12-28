import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    baseURL: "https://messenger-web-socket.herokuapp.com/api",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};
