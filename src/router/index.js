/*
 * @Descripttion:
 * @version:
 * @Author: wangbaojun
 * @Date: 2019-11-16 22:38:44
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-01 22:52:57
 */
import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("views/home/Login");
const Index = () => import("views/container");
const ProjectList = () => import("views/project/ProjectList");
const ProjectCreate = () => import("views/project/ProjectCreate");
const ProjectEdit = () => import("views/project/ProjectEdit");
const ProjectCase = () => import("views/project/CaseProjectBind");
const CaseCreate = () => import("views/case/CaseCreate");
const InterfaceCreate = () => import("views/interface/InterfaceCreate");
const InterfaceList = () => import("views/interface/InterfaceList");
const InterfaceEdit = () => import("views/interface/InterfaceEdit");
const ReportList = () => import("views/report/ReportList");
const ReportDetail = () => import("views/report/ReportDetail");
const CaseTestPlanList = () => import("views/testplan/CaseTestPlanList");
const CaseTestPlanCreate = () => import("views/testplan/CaseTestPlanCreate");
const CaseTestPlanEdit = () => import("views/testplan/CaseTestPlanEdit");
const CaseTaskList = () => import("views/testplan/CaseTaskList");
const ApiTestPlanList = () => import("views/testplan/ApiTestPlanList");
const ApiTestPlanCreate = () => import("views/testplan/ApiTestPlanCreate");
const ApiTestPlanEdit = () => import("views/testplan/ApiTestPlanEdit");
const ApiTaskList = () => import("views/testplan/ApiTaskList");

Vue.use(VueRouter);

const routes = [
  {
    path: "/toolsweb/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "home",
    component: Index,
    redirect: "/toolsweb/project/index",
    meta: {
      requireAuth: true // 表示此接口必须登录才能访问
    },
    children: [
      {
        path: "/toolsweb/project/create",
        name: "project-create",
        component: ProjectCreate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/project/index",
        name: "project-list",
        component: ProjectList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/project/edit",
        name: "project-edit",
        component: ProjectEdit,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/project/case",
        name: "project-case",
        component: ProjectCase,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/case/create",
        name: "case-create",
        component: CaseCreate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/interface/list",
        name: "interface-list",
        component: InterfaceList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/interface/edit",
        name: "interface-edit",
        component: InterfaceEdit,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/interface/create",
        name: "interface-create",
        component: InterfaceCreate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/report/list",
        name: "report-list",
        component: ReportList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/report/detail",
        name: "report-detail",
        component: ReportDetail,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/casetestplan/list",
        name: "case-testplan-list",
        component: CaseTestPlanList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/casetestplan/create",
        name: "case-testplan-create",
        component: CaseTestPlanCreate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/casetestplan/edit",
        name: "case-testplan-edit",
        component: CaseTestPlanEdit,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/casetestplan/task",
        name: "case-testplan-task",
        component: CaseTaskList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/apitestplan/list",
        name: "api-testplan-list",
        component: ApiTestPlanList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/apitestplan/create",
        name: "api-testplan-create",
        component: ApiTestPlanCreate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/apitestplan/edit",
        name: "api-testplan-edit",
        component: ApiTestPlanEdit,
        meta: {
          requireAuth: true
        }
      },
      {
        path: "/toolsweb/apitestplan/task",
        name: "api-testplan-task",
        component: ApiTaskList,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
