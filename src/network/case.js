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

export function getCaseTree(gitlab_url, project_name, branch_name) {
  return axios({
    url: "/api/case/tree/",
    method: "get",
    params:{
      gitlab_url: gitlab_url,
      project_name: project_name,
      branch_name: branch_name
    }
  });
}

export function createCaseTestplan(testplan_name, description, parallel, case_paths, project_id) {
  return axios({
    url: "/api/caseTestPlan/",
    method: "post",
    data:{
      name: testplan_name,
      description: description,
      parallel: parallel,
      case_paths: case_paths,
      project_id: project_id
    }
  });
}