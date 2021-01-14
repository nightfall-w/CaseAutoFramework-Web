<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:57:26
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-09 16:54:05
 -->
<template>
  <div>
    <el-tabs v-model="tabActiveName" type="border-card">
      <el-tab-pane :key="'one'" :label="'one'" :name="'one'">
        <span slot="label"><i class="el-icon-key"></i> 身份令牌认证</span>
        <br />
        <br />
        <span style="margin-left:2%; color:#606266">描述( 非必填 ):</span>
        <el-input
          style="width:50%;margin-left:4%"
          placeholder="描述"
          v-model="desc"
          clearable
        >
        </el-input>
        <br />
        <br />
        <br />
        <span style="margin-left:2%; color:#606266">gitlab服务器地址:</span>
        <el-input
          style="width:50%;margin-left:2%"
          placeholder="gitlab地址"
          v-model="gitlab_url"
          clearable
        >
        </el-input>
        <br />
        <br />
        <br />
        <span style="margin-left:2%; color:#606266">私有身份令牌:</span>
        <el-input
          style="width:50%;margin-left:4%"
          placeholder="private token"
          v-model="private_token"
          clearable
          show-password
        >
        </el-input
        ><br /><br />
        <el-button
          @click="getGitlabProjectsByPrivateToken"
          style="margin-left: 2%"
          type="primary"
          :loading="step1SubmitButtonLoading"
          >提交</el-button
        >
      </el-tab-pane>
      <el-tab-pane :key="'two'" :label="'two'" :name="'two'">
        <span slot="label"
          ><i class="el-icon-s-platform"></i> 选择归属项目</span
        >
        <br />
        <br />
        <br />
        <span style="margin-left:2%; color:#606266">选择case所在项目:</span>
        <el-select
          style="margin-left:2%;"
          v-model="projects.projectName"
          clearable
          placeholder="请选择case所在项目"
        >
          <el-option
            v-for="item in projects"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
            >
          </el-option>
        </el-select>
      </el-tab-pane>
      <br />
      <br />
      <br />
      <el-tab-pane :key="'three'" :label="'three'" :name="'three'">
        <span slot="label"><i class="el-icon-s-operation"></i> 选择分支</span>
        选择分支</el-tab-pane
      >
      <el-tab-pane :key="'four'" :label="'four'" :name="'four'">
        <span slot="label"><i class="el-icon-download"></i> 拉取代码</span>
        拉取代码</el-tab-pane
      >
    </el-tabs>

    <el-steps
      :active="step_active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="身份令牌认证"></el-step>
      <el-step title="选择归属项目"></el-step>
      <el-step title="选择分支"></el-step>
      <el-step title="拉取代码"></el-step>
    </el-steps>
  </div>
</template>

<script>
import { getProjectList } from "network/case";
export default {
  data() {
    return {
      tabActiveName: "one",
      step_active: 0,
      desc: null,
      step1SubmitButtonLoading: false,
      gitlab_url: "",
      private_token: "",
      projects: []
    };
  },
  methods: {
    getGitlabProjectsByPrivateToken() {
      this.step1SubmitButtonLoading = true;
      getProjectList(this.gitlab_url, this.private_token, this.desc)
        .then(res => {
          this.step1SubmitButtonLoading = false;
          this.projects = [];
          for (let key in res.result) {
            this.projects.push({
              projectName: key,
              projectId: res.result[key]
            });
          }
          this.step_active = 1;
          this.tabActiveName = "two";
          console.log(this.projects);
          this.$notify({
            title: "成功",
            message: "验证通过 请进行下一步操作",
            type: "success"
          });
        })
        .catch(err => {
          this.step1SubmitButtonLoading = false;
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: err.message
          });
        });
    }
  }
};
</script>
