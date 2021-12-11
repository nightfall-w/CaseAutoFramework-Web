<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="接口测试计划编辑"
    >
    </el-page-header>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail
      :fatherTestplanInfo="testplanInfo"
      v-if="this.value != []"
      :fatherValue="value"
    ></detail>
  </div>
</template>

<script>
import Detail from "content/testplan/detail_interface";
import { readApiTestplan, getApilist } from "network/testplan";
export default {
  data() {
    return {
      testplanInfo: {
        name: "",
        description: "",
      },
      value: [],
    };
  },
  components: {
    Detail,
  },
  created() {
    readApiTestplan(
      this.$route.query.itemId,
      sessionStorage.getItem("currentProjectID")
    )
      .then((res) => {
        this.testplanInfo.name = res.name;
        this.testplanInfo.description = res.description;
        const testplan_apis = JSON.parse(res.interfaceIds);
        console.log(testplan_apis);
        getApilist(sessionStorage.getItem("currentProjectID")).then((res) => {
          console.log(res);
          for (let i = 0; i < res.results.length; i++) {
            if (testplan_apis.indexOf(res.results[i].id) > -1) {
              this.value.push(i);
            }
          }
          console.log(this.value);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/apitestplan/list");
    },
  },
};
</script>
