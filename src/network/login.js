import axios from "./axios";

export function userLogin(data) {
  return axios({
    url: "/api/user/login/",
    method: "post",
    data: data
  });
}
