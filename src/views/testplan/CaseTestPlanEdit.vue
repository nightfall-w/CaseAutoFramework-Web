<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-01-23 16:14:54
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-20 23:24:02
-->
<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="编辑case测试计划"
    >
    </el-page-header>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail
      :fatherCaseBaseInfo="caseBaseInfo"
      :fatherTestplanInfo="testPlanInfo"
      :fatherTimerEnable="timerEnable"
      :fatherCrontab="crontab"
      :fatherEnvFile="envFile"
      v-if="this.cases != null"
      :fatherCases="cases"
    ></detail>
  </div>
</template>

<script>
import Detail from "content/testplan/detail_case";
import { getCaseTestplanDetail } from "network/testplan";
export default {
  data() {
    return {
      caseBaseInfo: {
        gitlab服务器: "",
        项目名: "",
        分支名: "",
      },
      testPlanInfo: {
        name: "",
        description: "",
        parallel: false,
      },
      cases: null,
      timerEnable: false,
      crontab: "",
      envFile: "",
    };
  },
  components: {
    Detail,
  },
  created() {
    getCaseTestplanDetail(
      this.$route.query.itemId,
      sessionStorage.getItem("currentProjectID")
    )
      .then((res) => {
        this.cases = res.case_paths;
        this.testPlanInfo.name = res.name;
        this.testPlanInfo.description = res.description;
        this.testPlanInfo.parallel = res.parallel;
        this.caseBaseInfo.gitlab服务器 = res.gitlab_url;
        this.caseBaseInfo.项目名 = res.gitlab_project_name;
        this.caseBaseInfo.分支名 = res.branch_name;
        this.timerEnable = res.timer_enable;
        this.crontab = res.crontab;
        this.envFile = res.env_file;
        console.log(this.cases);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/casetestplan/list");
    },
  },
};
</script>