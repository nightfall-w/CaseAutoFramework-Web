<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:58:20
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 13:18:31
 -->
<template>
  <div>
    <el-row style="margin-top:30px" type="flex" justify="center">
      <h3>接口编辑</h3>
    </el-row>
    <detail :fatherRuleForm="ruleForm"></detail>
  </div>
</template>

<script>
import Detail from "content/interface/detail";
import { getInterfaceDeatil } from "network/interface";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        request_mode: "GET",
        addr: "",
        headers: {},
        formData: {},
        urlencoded: {},
        raw: "{}",
        params: {},
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
  mounted() {
    getInterfaceDeatil(this.$route.query.itemId).then(res => {
      this.ruleForm.desc = res.desc;
      this.ruleForm.name = res.name;
      this.ruleForm.request_mode = res.request_mode;
      this.ruleForm.addr = res.addr;
      this.ruleForm.headers = res.headers;
      this.ruleForm.urlencoded = res.urlencoded;
      this.ruleForm.raw = JSON.stringify(res.raw);
      this.ruleForm.asserts = res.asserts;
    });
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
