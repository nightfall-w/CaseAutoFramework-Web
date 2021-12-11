<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-12-17 11:44:09
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-10 22:43:57
 -->
<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="项目编辑"
    >
    </el-page-header>
    <br />
    <br />
    <detail
      v-if="this.env_dict.lenght != 0 && this.project.name != ''"
      :fatherProject="project"
      :fatherEnvDict="env_dict"
    ></detail>
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
        desc: "",
      },
      env_dict: [],
    };
  },
  components: {
    Detail,
  },
  created() {
    getProjectDetail(this.$route.query.itemId).then((res) => {
      console.log(res);
      this.project.id = res.id;
      this.project.name = res.name;
      this.project.desc = res.desc;
      for (this.item in res.env_variable) {
        console.log(this.item);
        if (this.required_fields.indexOf(this.item) < 0) {
          this.env_dict.push({
            key: this.item,
            value: res.env_variable[this.item],
          });
        } else {
          this.env_dict.push({
            key: this.item,
            value: res.env_variable[this.item],
            required: true,
          });
        }
      }
      if (this.env_dict.length === 0) {
        this.env_dict.push({
          key: "",
          value: "",
        });
      }
    });
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/project/index");
    },
  },
};
</script>
