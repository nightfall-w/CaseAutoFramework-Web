/*
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-11-16 22:38:44
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 11:44:06
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

const ProjectList = () => import('views/project/ProjectList')
const ProjectCreate = () => import('views/project/ProjectCreate')
const ProjectEdit = () => import('views/project/ProjectEdit')
const CaseCreate = () => import('views/case/CaseCreate')
const CaseList = () => import('views/case/CaseList')
const InterfaceCreate = () => import('views/interface/InterfaceCreate')
const InterfaceList = () => import('views/interface/InterfaceList')
const InterfaceEdit = () => import('views/interface/InterfaceEdit')
const ReportList = () => import('views/report/ReportList')
const ReportDetail = () => import('views/report/ReportDetail')
const TestPlanList = () => import('views/testplan/TestPlanList')
const TestPlanCreate = () => import('views/testplan/TestPlanCreate')
const TestPlanDetail = () => import('views/testplan/TestPlanDetail')


Vue.use(VueRouter)

const routes = [
{
  path: '/',
  name: 'home',
  redirect: '/project/index'
},
{
  path: '/project/create',
  name: 'project-create',
  component: ProjectCreate
},
{
  path: '/project/index',
  name: 'project-list',
  component: ProjectList
},
{
  path: '/project/edit',
  name: 'project-edit',
  component: ProjectEdit
},
{
  path: '/case/create',
  name: 'case-create',
  component: CaseCreate
},
{
  path: '/case/list',
  name: 'case-list',
  component: CaseList
},
{
  path: '/interface/list',
  name: 'interface-list',
  component: InterfaceList
},
{
  path: '/interface/edit',
  name: 'interface-edit',
  component: InterfaceEdit
},
{
  path: '/interface/create',
  name: 'interface-create',
  component: InterfaceCreate
},
{
  path: '/report/list',
  name: 'report-list',
  component: ReportList
},
{
  path: '/report/detail',
  name: 'report-detail',
  component: ReportDetail
},
{
  path: '/testplan/detail',
  name: 'testplan-detail',
  component: TestPlanDetail
},
{
  path: '/testplan/list',
  name: 'testplan-list',
  component: TestPlanList
},
{
  path: '/testplan/create',
  name: 'testplan-create',
  component: TestPlanCreate
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router