/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-02-27 02:05:48
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-12 23:55:07
 */
import axios from "./axios";

export function getProjectList(gitlab_url, private_token, desc=null) {
  return axios({
    url: "/cap/api/gitlabAuthentication/",
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
    url: "/cap/api/case/branch/",
    method: "post",
    data:{
      token: token,
      project_id: project_id,
    }
  });
}

export function askPullBranch(token, project_id, branch) {
  return axios({
    url: "/cap/api/case/branch_pull/",
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
    url: "/cap/api/case/tree/",
    method: "get",
    params:{
      gitlab_url: gitlab_url,
      project_name: project_name,
      branch_name: branch_name
    }
  });
}

export function getScriptCases(path) {
  return axios({
    url: "/cap/api/case/case_collect_list/",
    method: "get",
    params:{
      path: path,
    }
  });
}

export function getCaseContent(gitlab_url, project_name, branch_name, case_path) {
  return axios({
    url: "/cap/api/case/tree/",
    method: "get",
    params:{
      gitlab_url: gitlab_url,
      project_name: project_name,
      branch_name: branch_name,
      path: case_path
    }
  });
}