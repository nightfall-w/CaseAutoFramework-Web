import axios from "./axios";

export function getProjectList(gitlab_url, private_token, desc=null) {
  return axios({
    url: "/api/gitlabAuthentication/",
    method: "post",
    data:{
      gitlab_url: gitlab_url,
      private_token: private_token,
      desc: desc
    }
  });
}
