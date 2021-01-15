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
          v-model="projectValue"
          @change="getBranchByProjectId"
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
        <span style="margin-left:2%; color:#606266">选择case所在分支:</span>
        <el-select
          style="margin-left:2%;"
          v-model="branchValue"
          @change="pullBranch"
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
      <el-tab-pane :key="'four'" :label="'four'" :name="'four'">
        <span slot="label"><i class="el-icon-download"></i> 拉取代码</span>
        <h2 style="margin-left:32%; color:lightgray">
          正在努力下载中,请稍加等待......
        </h2>
        <br />
        <el-progress
          style="margin-left:35%"
          type="dashboard"
          :width="200"
          :percentage="percentage"
          :color="colors"
        ></el-progress>
      </el-tab-pane>
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
import { getProjectList, getBranchList, askPullBranch } from "network/case";
export default {
  data() {
    return {
      tabActiveName: "one",
      step_active: 0,
      step1SubmitButtonLoading: false,

      token: "",
      desc: null,
      gitlab_url: "",
      private_token: "",
      projects: [],
      projectValue: "",
      checkedProjectId: null,

      branchs: [],
      branchValue: "",

      percentage: 0,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ]
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_SERVER_WS + "/ws/casepull/result/";
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
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata);
      if (redata.status === "DONE") {
        this.websock.close();
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    getGitlabProjectsByPrivateToken() {
      this.step1SubmitButtonLoading = true;
      this.projects = [];
      this.token = "";
      this.branchs = [];
      this.projectValue = "";
      getProjectList(this.gitlab_url, this.private_token, this.desc)
        .then(res => {
          this.step1SubmitButtonLoading = false;
          this.token = res.token;
          this.branchs = [];
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
    },
    getBranchByProjectId(value) {
      this.branchs = [];
      this.branchValue = "";
      let projectObj = {};
      projectObj = this.projects.find(item => {
        //遍历list的数据
        return item.projectId === value; //筛选出匹配数据
      });
      console.log(projectObj.projectId); //获取list里面的name
      this.checkedProjectId = projectObj.projectId;
      // getBranchList;
      if (!this.token) {
        return false;
      }
      this.branchs = [];
      getBranchList(this.token, projectObj.projectId)
        .then(res => {
          this.branchs = res.result;
          this.step_active = 2;
          this.tabActiveName = "three";
          this.$notify({
            title: "成功",
            message: "获取分支成功 请进行下一步操作",
            type: "success"
          });
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: err.message
          });
        });
    },
    pullBranch() {
      let project_id = this.checkedProjectId;
      askPullBranch(this.token, project_id, this.branchValue)
        .then(res => {
          console.log(res);
          this.step_active = 3;
          this.tabActiveName = "four";
          this.$notify({
            title: "成功",
            message: "pull请求已经成功, 请等待完成",
            type: "success"
          });
          //发起websocket请求 获取分支pull状态
          var sleep = function(time) {
            var startTime = new Date().getTime() + parseInt(time, 10);
            while (new Date().getTime() < startTime) {}
          };
          this.websock.onopen = this.websocketonopen();
          sleep(2000);
          let actions = {
            token: this.token,
            project_id: this.checkedProjectId,
            branch_name: this.branchValue
          };
          this.websocketsend(JSON.stringify(actions));
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: err.message
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
    }
  }
};
</script>
