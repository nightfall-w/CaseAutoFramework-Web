import axios from "./axios";

export function debugApi(data) {
  return axios({
    url: "/cap/api/interfaceTest/",
    method: "post",
    data: data
  })
}

export function createInterface(data) {
  return axios({
    url: "/cap/api/interface/",
    method: "post",
    data: data
  });
}

export function updateInterface(id, data) {
  return axios({
    url: "/cap/api/interface/" + id + "/",
    method: "put",
    data: data
  });
}

export function listInterface(projectId, offset, limit) {
  return axios({
    url: "/cap/api/interface/",
    method: "get",
    params: {
      projectId: projectId,
      limit: limit,
      offset: offset
    }
  });
}

export function deleteInterface(id) {
  return axios({
    url: "/cap/api/interface/" + id + "/",
    method: "delete",
  });
}

export function getInterfaceDeatil(interfaceId) {
  return axios({
    url: "/cap/api/interface/" + interfaceId + "/",
    method: "get",
  })
}