<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-01-23 16:14:54
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-20 23:23:49
-->
<template>
  <div>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail
      :fatherCaseBaseInfo="caseBaseInfo"
      :fatherTestplanInfo="testPlanInfo"
      :fatherTimerEnable="timerEnable"
      :fatherCrontab="crontab"
      :fatherCases="cases"
    ></detail>
  </div>
</template>

<script>
import Detail from "content/testplan/detail_case";
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
      cases: [],
      timerEnable: false,
      crontab: "",
    };
  },
  components: {
    Detail,
  },
};
</script>