import axios from './axios'

export function getProject(limit, offset) {
    return axios({
        url: '/api/project/',
        method: "get",
        params: {
            limit: limit,
            offset: offset,
        }
    })
}

export function getProjectDetail(id) {
    return axios({
        url: '/api/project/' + id + '/',
        method: "get"
    })
}