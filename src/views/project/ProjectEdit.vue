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
      required_fields: ["host", "db_address", "db_port", "db_password"],
      project: {
        id: null,
        name: "",
        desc: ""
      },
      env_dict: []
    };
  },
  components: {
    Detail
  },
  mounted() {
    getProjectDetail(this.$route.query.itemId).then(res => {
      console.log(res);
      this.project.id = res.id;
      this.project.name = res.name;
      this.project.desc = res.desc;
      for (this.item in res.env_variable) {
        console.log(this.item);
        if (this.required_fields.indexOf(this.item) < 0) {
          this.env_dict.push({
            key: this.item,
            value: res.env_variable[this.item]
          });
        } else {
          this.env_dict.push({
            key: this.item,
            value: res.env_variable[this.item],
            required: true
          });
        }
      }
      console.log(this.env_dict);
    });
  }
};
</script>
