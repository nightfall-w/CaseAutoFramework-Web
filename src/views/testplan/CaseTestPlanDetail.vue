<template>
  <div>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail
      :fatherCaseBaseInfo="caseBaseInfo"
      :fatherTestplanInfo="testPlanInfo"
      :fatherCaes="cases"
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
      cases: [],
    };
  },
  components: {
    Detail,
  },
  mounted() {
    getCaseTestplanDetail(2, 18)
      .then((res) => {
        this.case_paths = res.case_paths;
        this.testPlanInfo.name = res.name;
        this.testPlanInfo.description = res.description;
        this.testPlanInfo.parallel = res.parallel;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>