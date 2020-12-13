<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-12-17 11:44:09
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 13:22:21
 -->
<template>
  <div>
    <el-row style="margin-top: 30px" type="flex" justify="center">
      <h3>编辑项目</h3>
    </el-row>
    <detail :fatherProject="project" :fatherEnvDict="env_dict"></detail>
  </div>
</template>

<script>
import Detail from "content/project/detail";
import { getProjectDetail } from "network/project";
export default {
  data() {
    return {
      project: {
        name: "",
        desc: "",
      },
      env_dict: [
        {
          key: "host",
          value: "192.168.21.203",
          required: true,
        },
        {
          key: "db_address",
          value: "192.168.21.203",
          required: true,
        },
        {
          key: "db_port",
          value: "3306",
          required: true,
        },
        {
          key: "db_password",
          value: "root123",
          required: true,
        },
      ],
    };
  },
  components: {
    Detail,
  },
  mounted() {
    getProjectDetail(this.$route.query.itemId).then((res) => {
      console.log(res);
      this.project.name = res.name;
      this.project.desc = res.desc;
      this.env_dict = res.env_variable;
    });
  },
  methods: {
    saveProject() {
      console.log(this.project);
    },
    updateProject() {
      console.log(this.project);
    },
  },
};
</script>