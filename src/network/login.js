import axios from "./axios";

export function userLogin(data) {
  return axios({
    url: "/cap/api/user/login/",
    method: "post",
    data: data
  });
}
