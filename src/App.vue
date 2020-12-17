<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-11-16 22:38:44
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 15:53:36
 -->
<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <div class="topbar-logo topbar-btn">
        <a href="/">
          <img
            src="~assets/images/logo.svg"
            width="100%"
            height="60px"
            style="background:#000;"
          />
        </a>
      </div>
      <el-menu router :default-active="$route.path">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-grid"></i>项目管理
          </template>
          <el-menu-item index="/project/index">项目列表</el-menu-item>
          <el-menu-item index="/project/create">项目创建</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-unfold"></i>接口管理
          </template>
          <el-menu-item index="/interface/create">接口创建</el-menu-item>
          <el-menu-item index="/interface/list">接口列表</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-edit-outline"></i>case管理
          </template>
          <el-menu-item index="/case/create">case添加</el-menu-item>
          <el-menu-item index="/case/list">case列表</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-document"></i>测试计划
          </template>
          <el-menu-item index="/testplan/list">测试计划列表</el-menu-item>
          <el-menu-item index="/testplan/create">测试计划创建</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-s-data"></i>测试报告
          </template>
          <el-menu-item index="/report/list">测试报告列表</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        style="text-align: right; font-size: 12px; background:#000; color:#FFF"
      >
        <i class="el-icon-user-solid" style="margin-right: 20px;"></i>
        <el-dropdown split-button type="primary" style="margin-right: 20px;">
          <span style="color:#FFF">admin</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
@import "assets/css/base.css";
@import "assets/css/normalize.css";

body,
html {
  margin: 0;
  padding: 0;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
