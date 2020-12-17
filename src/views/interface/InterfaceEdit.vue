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
export default {
  data() {
    return {
      ruleForm: {
        name: "测试测试",
        mode: "GET",
        addr: "http://192.168.21.203",
        headers: [{ key: "hhhh", value: "kkkkk" }],
        formData: [{ key: "jjjjj", value: "uuuuu" }],
        urlEncoded: [{ key: "ttttt", value: "9999999999" }],
        raw: "{}",
        params: [{ key: "nh", value: "jjj" }],
        asserts: [{ key: "huhu", assertType: "iii", examineValue: "oo" }],
        desc: "676"
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
