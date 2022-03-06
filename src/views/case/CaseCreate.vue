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
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="同步分支用例"
    >
    </el-page-header>
    <br />
    <br />
    <el-tabs class="tab" v-model="tabActiveName" type="border-card">
      <br />
      <br />
      <br />
      <el-tab-pane :key="'one'" :label="'one'" :name="'one'">
        <span slot="label"><i class="el-icon-s-operation"></i> 选择分支</span>
        <span style="margin-left: 2%; color: #606266">选择case所在分支:</span>
        <el-select
          style="margin-left: 2%"
          v-model="branchValue"
          @change="pullBranch"
          filterable
          clearable
          placeholder="请选择case所在分支"
        >
          <el-option
            v-for="item in branchs"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-tab-pane>
      <el-tab-pane :key="'two'" :label="'two'" :name="'two'">
        <span slot="label"><i class="el-icon-download"></i> 拉取代码</span>
        <div>
          <h2
            v-if="percentage != 100"
            style="margin-left: 32%; color: lightgray"
          >
            正在努力同步中,请稍加等待......
          </h2>
          <h2
            v-if="percentage === 100"
            style="margin-left: 30%; color: lightgray"
          >
            同步远程case完成，<a
              href="url"
              style="color: cornflowerblue"
              @click.prevent="skip2createTestplan"
              >去创建测试计划</a
            >？
          </h2>
          <br />
          <el-progress
            style="margin-left: 35%"
            type="dashboard"
            :status="progress_status"
            :width="200"
            :percentage="percentage"
            :color="colors"
          ></el-progress>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-steps
      :active="step_active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="选择分支"></el-step>
      <el-step title="拉取代码"></el-step>
    </el-steps>
  </div>
</template>
<style scoped>
.el-select {
  width: 30%;
}
.tab {
  height: 400px;
}
</style>
<script>
import { getBranchList, askPullBranch } from "network/case";
import { getProjectDetail } from "network/project";
export default {
  data() {
    return {
      tabActiveName: "one",
      step_active: 0,
      gitlab_url: "",
      token: "",
      projectValue: "",
      projectName: "",
      checkedProjectObj: null,

      branchs: [],
      branchValue: "",

      percentage: 0,
      progress_status: "",
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
    };
  },
  created() {
    getProjectDetail(sessionStorage.getItem("currentProjectID"))
      .then((res) => {
        if (res.bound_case_info) {
          const bound_case_info = res.bound_case_info;
          this.gitlab_url = bound_case_info.gitlab_service;
          this.token = bound_case_info.token;
          this.projectValue = bound_case_info.case_project_id;
          this.projectName = bound_case_info.case_project_name;
          this.getBranchByProjectId(this.projectValue);
        }
      })
      .catch((err) => {});
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/casetestplan/list");
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_SERVER_WS + "/cap/ws/casepull/result/";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("websocket连接已经建立");
    },
    websocketonerror() {
      //连接建立失败重连
      if (this.$route.path === "/toolsweb/case/create") {
        this.ws_retry -= 1;
        console.log(this.ws_retry);
        if (this.ws_retry >= 0) {
          this.initWebSocket();
        }
      }
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata);
      if (redata.progress) {
        this.percentage = Math.floor(redata.progress);
      }
      if (redata.status === "DONE") {
        this.percentage = 100;
        this.websock.close();
        this.step_active = 4;
        this.$notify({
          title: "成功",
          message: "拉取远程代码完成！",
          type: "success",
        });
      } else if (redata.status === "FAILED") {
        this.progress_status = "exception";
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      if (this.$route.path === "/toolsweb/case/create") {
        this.ws_retry -= 1;
        console.log(this.ws_retry);
        if (this.ws_retry >= 0) {
          this.initWebSocket();
        }
      }
    },
    getBranchByProjectId(value) {
      if (!value) {
        return false;
      }
      this.branchs = [];
      this.branchValue = "";

      // getBranchList;
      if (!this.token) {
        return false;
      }
      this.branchs = [];
      getBranchList(this.token, this.projectValue)
        .then((res) => {
          this.branchs = res.result;
          this.step_active = 1;
          this.tabActiveName = "one";
          this.$notify({
            title: "成功",
            message: "获取分支成功 请进行下一步操作",
            type: "success",
          });
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err.message,
          });
        });
    },
    pullBranch() {
      this.initWebSocket();
      let project_id = this.projectValue;
      this.percentage = 0;
      this.progress_status = "";
      askPullBranch(this.token, project_id, this.branchValue)
        .then((res) => {
          console.log(res);
          this.step_active = 1;
          this.tabActiveName = "two";
          this.$notify({
            title: "成功",
            message: "pull请求已经成功, 请等待完成",
            type: "success",
          });
          //发起websocket请求 获取分支pull状态
          let actions = {
            token: this.token,
            project_id: project_id,
            branch_name: this.branchValue,
          };
          this.websocketsend(JSON.stringify(actions));
        })
        .catch((err) => {
          this.$notify.error({
            title: "错误",
            message: err.message,
          });
        });
    },

    // 仪表盘进度增加
    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
    // 仪表盘进度减少
    decrease() {
      this.percentage -= 10;
      if (this.percentage < 0) {
        this.percentage = 0;
      }
    },
    skip2createTestplan() {
      this.$router.push({
        path: "/toolsweb/casetestplan/create",
        query: {
          gitlab_url: this.gitlab_url,
          gitlab_project: this.projectName,
          gitlab_branch: this.branchValue,
        },
      });
    },
  },
};
</script>
