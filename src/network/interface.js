import axios from "./axios";

export function createInterface(data) {
  return axios({
    url: "/api/interface/",
    method: "post",
    data: data
  });
}

export function listInterface(projectId, offset, limit) {
  return axios({
    url: "/api/interface/",
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
    url: "/api/interface/"+id+"/",
    method: "delete",
    });
}

export function getInterfaceDeatil(interfaceId){
  return axios({
    url: "/api/interface/"+interfaceId+"/",
    method: "get",
  })
}