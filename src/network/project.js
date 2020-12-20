import axios from "./axios";

export function getProject(limit, offset, projectName=null) {
  return axios({
    url: "/api/project/",
    method: "get",
    params: {
      projectName: projectName,
      limit: limit,
      offset: offset
    }
  });
}

export function getProjectDetail(id) {
  return axios({
    url: "/api/project/" + id + "/",
    method: "get"
  });
}

export function updateProject(id, data) {
  return axios({
    url: "/api/project/" + id + "/",
    method: "put",
    data: data
  });
}

export function deleteProject(id) {
  return axios({
    url: "/api/project/" + id + "/",
    method: "delete"
  });
}

export function saveProject(data) {
  return axios({
    url: "/api/project/",
    method: "post",
    data: data
  });
}
