<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="接口测试计划创建"
    >
    </el-page-header>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail :fatherTestplanInfo="testplanInfo" :fatherValue="value"></detail>
  </div>
</template>

<script>
import Detail from "content/testplan/detail_interface";
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
  methods: {
    goBack() {
      this.$router.push("/toolsweb/apitestplan/list");
    },
  },
};
</script>
