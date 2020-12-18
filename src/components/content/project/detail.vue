<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-14 15:48:21
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 13:23:58
 -->
<template>
  <el-form
    @submit.native.prevent="saveProject"
    ref="form"
    :model="project"
    label-width="120px"
  >
    <el-form-item label="项目名称">
      <el-input v-model="project.name"></el-input>
    </el-form-item>
    <el-form-item label="项目描述">
      <el-input v-model="project.desc" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="项目环境变量">
      <span style="margin-left: 20px; font-size: 12px; color: #919191"
        >注意： <el-badge is-dot class="item"></el-badge>表示必填项</span
      >
      <div
        v-for="(item, index) in env_dict"
        :key="index"
        style="margin: 10px 0"
      >
        <span style="padding: 0 15px">键</span>
        <el-input
          v-model="item.key"
          :inline="true"
          :value="item.key"
          style="width: 40%"
          placeholder="key"
        ></el-input>
        <span style="padding: 0 15px; padding-left: 40px"
          >值
          <el-badge is-dot class="item" v-show="item.required"></el-badge>
        </span>
        <el-input
          v-model="item.value"
          :inline="true"
          :value="item.value"
          style="width: 40%"
          placeholder="value"
        ></el-input>
        <el-button
          v-show="!item.required"
          style="margin-left: 20px"
          type="danger"
          icon="el-icon-minus"
          @click="minus_env(index, item.required)"
          circle
        ></el-button>
      </div>
      <el-button
        type="primary"
        style="width: 10%; margin-left: 35%"
        @click="add_env"
        >添加一条</el-button
      >
      <el-button
        v-if="currentPage == '/project/edit'"
        style="margin-left: 3%"
        type="primary"
        @click="update_project"
        >提交</el-button
      >
      <el-button
        v-else
        style="margin-left: 3%"
        type="primary"
        @click="save_project"
        >提交</el-button
      >
    </el-form-item>
    <!-- <el-form-item>

    </el-form-item> -->
  </el-form>
</template>

<script>
import { updateProject, saveProject } from "network/project";
export default {
  name: "projectDetail",
  props: {
    fatherProject: {
      type: Object,
    },
    fatherEnvDict: {
      type: Array,
    },
  },
  data() {
    return {
      currentPage: this.$route.path,
      project: this.fatherProject,
      env_dict: this.fatherEnvDict,
    };
  },
  mounted() {
    console.log(this.currentPage);
  },
  methods: {
    add_env() {
      console.log("+++");
      console.log(this.env_dict);

      this.env_dict.push({
        key: "",
        value: "",
        required: false,
      });
    },
    minus_env(index, required) {
      if (!required) {
        this.env_dict.splice(index, 1);
      }
    },
    update_project() {
      let env_variable = {};
      for (this.item in this.env_dict) {
        if (!this.env_dict[this.item].key & !this.env_dict[this.item].value) {
          continue;
        } else {
          env_variable[this.env_dict[this.item].key] = this.env_dict[
            this.item
          ].value;
        }
      }
      const data = {
        name: this.project.name,
        desc: this.project.desc,
        update_by: localStorage.getItem("userName"),
        env_variable: JSON.stringify(env_variable),
      };
      updateProject(this.project.id, data)
        .then((res) => {
          if (res.id) {
            this.$message({
              type: "success",
              message: "更新成功!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: "error",
            message: "更新失败!",
          });
        });
    },
    save_project() {
      let env_variable = {};
      for (this.item in this.env_dict) {
        if (!this.env_dict[this.item].key & !this.env_dict[this.item].value) {
          continue;
        } else {
          env_variable[this.env_dict[this.item].key] = this.env_dict[
            this.item
          ].value;
        }
      }
      let username = localStorage.getItem("userName");
      const data = {
        name: this.project.name,
        desc: this.project.desc,
        update_by: username,
        create_by: username,
        env_variable: JSON.stringify(env_variable),
      };
      saveProject(data)
        .then((res) => {
          if (res.id) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
          }
        })
        .catch((err) => {
          console.log(err),
            this.$message({
              type: "error",
              message: "创建失败!",
            });
        });
    },
  },
};
</script>
