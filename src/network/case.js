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

export function getBranchList(token, project_id) {
  return axios({
    url: "/api/case/branch/",
    method: "post",
    data:{
      token: token,
      project_id: project_id,
    }
  });
}

export function askPullBranch(token, project_id, branch) {
  return axios({
    url: "/api/case/branch_pull/",
    method: "post",
    data:{
      token: token,
      project_id: project_id,
      branch: branch
    }
  });
}

