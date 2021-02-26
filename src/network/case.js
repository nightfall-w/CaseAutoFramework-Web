/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-02-27 02:05:48
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-27 02:15:45
 */
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

export function getCaseContent(gitlab_url, project_name, branch_name, case_path) {
  return axios({
    url: "/api/case/tree/",
    method: "get",
    params:{
      gitlab_url: gitlab_url,
      project_name: project_name,
      branch_name: branch_name,
      path: case_path
    }
  });
}