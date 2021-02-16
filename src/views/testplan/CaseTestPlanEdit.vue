<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-01-23 16:14:54
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-16 21:25:24
-->
<template>
  <div>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail
      :fatherCaseBaseInfo="caseBaseInfo"
      :fatherTestplanInfo="testPlanInfo"
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
        console.log(this.cases);
        this.cases = res.case_paths;
        this.testPlanInfo.name = res.name;
        this.testPlanInfo.description = res.description;
        this.testPlanInfo.parallel = res.parallel;
        this.caseBaseInfo.gitlab服务器 = res.gitlab_url;
        this.caseBaseInfo.项目名 = res.gitlab_project_name;
        this.caseBaseInfo.分支名 = res.branch_name;
        console.log(res.case_paths);
        console.log(this.cases);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>