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
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail :fatherRuleForm="ruleForm"></detail>
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
        raw: null,
        params: [],
        asserts: [],
        desc: "",
        parameters: {},
        extract: []
      }
    };
  },
  components: {
    Detail
  },
  methods: {
    saveProject() {
      console.log(this.project);
    },
    updateProject() {
      console.log(this.project);
    }
  }
};
</script>
