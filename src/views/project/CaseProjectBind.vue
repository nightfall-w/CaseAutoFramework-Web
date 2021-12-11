<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="关联用例项目工程"
    >
    </el-page-header>
    <br />
    <br />
    <el-tabs v-model="tabActiveName" type="border-card">
      <el-tab-pane :key="'one'" :label="'one'" :name="'one'">
        <span slot="label"><i class="el-icon-key"></i> 身份令牌认证</span>
        <br />
        <br />
        <span style="margin-left: 2%; color: #606266">描述( 非必填 ):</span>
        <el-input
          style="width: 50%; margin-left: 4%"
          placeholder="描述"
          v-model="desc"
          clearable
        >
        </el-input>
        <br />
        <br />
        <br />
        <span style="margin-left: 2%; color: #606266">gitlab服务器地址:</span>
        <el-input
          style="width: 50%; margin-left: 2%"
          placeholder="gitlab地址"
          v-model="gitlab_url"
          clearable
        >
        </el-input>
        <br />
        <br />
        <br />
        <span style="margin-left: 2%; color: #606266">私有身份令牌:</span>
        <el-input
          style="width: 50%; margin-left: 4%"
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
        <span style="margin-left: 2%; color: #606266">选择case所在项目:</span>
        <el-select
          style="margin-left: 2%"
          v-model="projectValue"
          filterable
          @change="selectCaseProject"
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
    </el-tabs>
    <el-steps
      :active="step_active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="身份令牌认证"></el-step>
      <el-step title="选择归属项目"></el-step>
    </el-steps>
  </div>
</template>

<style scoped>
.el-select {
  width: 30%;
}
</style>

<script>
import { getProjectList } from "network/case";
import { updateProject } from "network/project";
export default {
  data() {
    return {
      tabActiveName: "one",
      step_active: 0,
      step1SubmitButtonLoading: false,

      token: "",  // 对private_token加密的token
      desc: "",
      gitlab_url: "",
      private_token: "",
      projects: [],
      projectValue: "",
      checkedProjectObj: null,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/project/index");
    },
    getGitlabProjectsByPrivateToken() {
      this.step1SubmitButtonLoading = true;
      this.projects = [];
      this.token = "";
      this.branchs = [];
      this.projectValue = "";
      getProjectList(this.gitlab_url, this.private_token, this.desc)
        .then((res) => {
          this.step1SubmitButtonLoading = false;
          this.token = res.token;
          for (let key in res.result) {
            this.projects.push({
              projectName: key,
              projectId: res.result[key],
            });
          }
          this.step_active = 1;
          this.tabActiveName = "two";
          console.log(this.projects);
          this.$notify({
            title: "成功",
            message: "验证通过 请进行下一步操作",
            type: "success",
          });
        })
        .catch((err) => {
          this.step1SubmitButtonLoading = false;
          console.log(err);
          this.$notify.error({
            title: "错误",
            message: err.message,
          });
        });
    },
    selectCaseProject(value) {
      if (!value) {
        return false;
      }
      this.branchValue = "";
      let projectObj = {};
      projectObj = this.projects.find((item) => {
        //遍历list的数据
        return item.projectId === value; //筛选出匹配数据
      });
      console.log(projectObj.projectId); //获取list里面的name
      this.checkedProjectObj = projectObj;

      // getBranchList;
      if (!this.token) {
        return false;
      }
      this.confirmBind();
    },
    confirmBind() {
      let projectName = "";
      for (let i in this.projects) {
        if (this.projects[i].projectId == this.projectValue) {
          projectName = this.projects[i].projectName;
          break;
        }
      }
      this.$confirm(
        "确认将项目测试用例关联为: " +
          "<b style='color:tomato'>" +
          projectName +
          "</b>",
        "确认信息",
        {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "放弃",
        }
      )
        .then(() => {
          const platformProjectId = this.$route.query.project_id;
          const data = {
            bound_case_info: {
              gitlab_service: this.gitlab_url,
              token: this.token,
              case_project_id: this.projectValue,
              case_project_name: projectName,
            },
            update_user: localStorage.getItem("userName"),
          };
          updateProject(platformProjectId, data)
            .then((res) => {
              if (res.id) {
                this.$message({
                  type: "success",
                  message: "更新成功!",
                });
                this.$router.push("/toolsweb/project/index");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                type: "error",
                message: "更新失败!",
              });
            });
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "放弃保存并重新选择" : "重新选择",
          });
        });
    },
  },
};
</script>
