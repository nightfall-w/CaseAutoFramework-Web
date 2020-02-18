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
    <el-row style="margin-top:30px" type="flex" justify="center">
      <h3>编辑项目</h3>
    </el-row>
    <detail :fatherProject="project" :fatherEnvDict="env_dict"></detail>
  </div>
</template>

<script>
  import Detail from 'content/project/detail'
  export default {
    data() {
      return {
        project: {
          name: "波司登料箱",
          desc: "暂无描述"
        },
        env_dict: [
        {
          key: "host",
          value: "192.168.21.203",
          required: true
        },
        {
          key: "db_address",
          value: "192.168.21.203",
          required: true
        },
        {
          key: "db_port",
          value: "3306",
          required: true
        },
        {
          key: "db_password",
          value: "root123",
          required: true
        }]
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
        console.log(this.project)
      }
    }
  };
</script>