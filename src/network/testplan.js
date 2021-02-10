/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-02-06 21:08:28
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-10 15:43:39
 */
import axios from "./axios";

export function createCaseTestplan(testplan_name, description, parallel, case_paths, project_id, gitlab_url, gitlab_project_name, branch_name) {
    return axios({
        url: "/api/caseTestPlan/",
        method: "post",
        data: {
            name: testplan_name,
            description: description,
            parallel: parallel,
            case_paths: case_paths,
            project_id: project_id,
            gitlab_url: gitlab_url,
            gitlab_project_name: gitlab_project_name,
            branch_name: branch_name
        }
    });
}

export function getCaseTestplans(project_id, case_testplan_name, limit, offset) {
    return axios({
        url: "/api/caseTestPlan/",
        method: "get",
        params: {
            projectId: project_id,
            case_testplan_name: case_testplan_name,
            limit: limit,
            offfset: offset
        }
    });
}

export function deleteCaseTestplan(case_testplan_id) {
    return axios({
        url: "/api/caseTestPlan/" + case_testplan_id + "/",
        method: "delete",
    });
}

export function getCaseTestplanDetail(case_testplan_id, project_id) {
    return axios({
        url: "/api/caseTestPlan/" + case_testplan_id + "/",
        method: "get",
        params: { projectId: project_id }
    })
}
