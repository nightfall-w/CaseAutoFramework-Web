<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-12-17 11:44:09
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 13:22:30
 -->
<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="项目创建"
    >
    </el-page-header>
    <br />
    <br />
    <detail :fatherProject="project" :fatherEnvDict="env_dict"></detail>
  </div>
</template>

<script>
import Detail from "content/project/detail";
export default {
  data() {
    return {
      project: {
        name: "",
        desc: "",
      },
      env_dict: [
        {
          key: "",
          value: "",
          required: false,
        },
      ],
    };
  },
  components: {
    Detail,
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/project/index");
    },
  },
};
</script>