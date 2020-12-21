import axios from "./axios";

export function createInterface(data) {
  return axios({
    url: "/api/interface/",
    method: "post",
    data: data
  });
}
