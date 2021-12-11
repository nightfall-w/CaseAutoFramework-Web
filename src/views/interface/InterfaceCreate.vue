<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:58:20
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 13:30:06
 -->
<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="接口创建"
    >
    </el-page-header>
    <br />
    <br />
    <detail
      :fatherRuleForm="ruleForm"
    ></detail>
  </div>
</template>

<script>
import Detail from "content/interface/detail";
export default {
  data() {
    return {
      ruleForm: {
        project: sessionStorage.getItem("currentProjectID"),
        name: "",
        request_mode: "GET",
        addr: "",
        headers: [],
        formData: [],
        urlencoded: [],
        raw: {},
        params: [],
        asserts: [],
        desc: "",
        parameters: {},
        extract: [],
      },
    };
  },
  components: {
    Detail,
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/interface/list");
    },
    saveProject() {
      console.log(this.project);
    },
    updateProject() {
      console.log(this.project);
    },
  },
};
</script>
