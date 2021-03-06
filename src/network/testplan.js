/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-02-06 21:08:28
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-20 22:48:23
 */
import axios from "./axios";

export function createCaseTestplan(testplan_name, description, parallel, case_paths, project_id, gitlab_url, gitlab_project_name, branch_name, timer_enable, crontab) {
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
            branch_name: branch_name,
            timer_enable: timer_enable,
            crontab: crontab,
        }
    });
}

export function updateCaseTestplan(testplan_id, testplan_name, description, parallel, case_paths, project_id, gitlab_url, gitlab_project_name, branch_name, timer_enable, crontab) {
    return axios({
        url: "/api/caseTestPlan/" + testplan_id + "/",
        method: "put",
        data: {
            name: testplan_name,
            description: description,
            parallel: parallel,
            case_paths: case_paths,
            project_id: project_id,
            gitlab_url: gitlab_url,
            gitlab_project_name: gitlab_project_name,
            branch_name: branch_name,
            timer_enable: timer_enable,
            crontab: crontab,
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


export function runCaseTestplan(projectId, testPlanId) {
    return axios({
        url: "/api/testPlan/runCaseTestPlan/",
        method: "post",
        data: {
            projectId: projectId,
            testPlanId: testPlanId,
        }
    });
}

export function getCaseTasksInfo(case_testplan_id, limit, offset) {
    return axios({
        url: "/api/testPlan/caseTask/",
        method: "get",
        params: {
            caseTestPlanUid: case_testplan_id,
            limit: limit,
            offset: offset
        }
    })
}

export function getCaseJobsInfo(case_task_id) {
    return axios({
        url: "/api/caseJob/",
        method: "get",
        params: {
            task_id: case_task_id,
        }
    })
}

export function getApilist(project_id) {
    return axios({
        url: "/api/interface/",
        method: "get",
        params: {
            projectId: project_id,
        }
    })
}

export function createApiTestplan(name, description, projectId, interfaceIds) {
    return axios({
        url: "/api/apiTestPlan/",
        method: "post",
        data: {
            name: name,
            description: description,
            project_id: projectId,
            interfaceIds: interfaceIds,
        }
    });
}

export function updateApiTestplan(id, name, description, projectId, interfaceIds) {
    return axios({
        url: "/api/apiTestPlan/" + id + "/",
        method: "put",
        data: {
            name: name,
            description: description,
            project_id: projectId,
            interfaceIds: interfaceIds,
        }
    });
}

export function getApiTestplans(project_id, api_testplan_name, limit, offset) {
    return axios({
        url: "/api/apiTestPlan/",
        method: "get",
        params: {
            projectId: project_id,
            api_testplan_name: api_testplan_name,
            limit: limit,
            offfset: offset
        }
    });
}

export function readApiTestplan(id, projectId) {
    return axios({
        url: "/api/apiTestPlan/" + id + "/",
        method: "get",
        params: {
            projectId: projectId
        }
    });
}

export function deleteApiTestplan(id) {
    return axios({
        url: "/api/apiTestPlan/" + id + "/",
        method: "delete",
    });
}

export function runApiTestplan(projectId, testPlanId) {
    return axios({
        url: "/api/testPlan/runApiTestPlan/",
        method: "post",
        data: {
            projectId: projectId,
            testPlanId: testPlanId,
        }
    });
}

export function getApiTasksInfo(api_testplan_id, limit, offset) {
    return axios({
        url: "/api/testPlan/apiTask/",
        method: "get",
        params: {
            ApiTestPlanUid: api_testplan_id,
            limit: limit,
            offset: offset
        }
    })
}

export function getApiJobsInfo(api_task_id) {
    return axios({
        url: "/api/apiJob/",
        method: "get",
        params: {
            task_id: api_task_id,
        }
    })
}