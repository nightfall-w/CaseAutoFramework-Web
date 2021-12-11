<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-14 15:48:21
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-15 16:38:18
 -->
<template>
  <div>
    <div class="content">
      <el-form
        @submit.native.prevent="saveProject"
        ref="project"
        :model="project"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="project.name"
            size="medium"
            :clearable="true"
            maxlength="30"
            show-word-limit
            placeholder="请输入项目名称"
            style="width: 65%"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="desc">
          <el-input
            v-model="project.desc"
            type="textarea"
            :autosize="true"
            maxlength="200"
            show-word-limit
            placeholder="请输入项目描述"
            style="width: 65%"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用环境变量？">
          <el-switch
            v-model="env_variable"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            @change="env_switch"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="项目环境变量" v-show="env_variable">
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
              style="width: 25%"
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
              style="width: 25%"
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
          <el-button type="primary" style="margin-left: 40px" @click="add_env"
            >添加一条</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div v-if="save_label.sign == 'save'">
        <el-button
          style="margin: 10px 0 0 33%"
          type="primary"
          @click="save_project('project', false)"
          >保存</el-button
        >
        <el-button
          style="margin-left: 10px"
          type="primary"
          @click="save_project('project', true)"
          >保存并关联gitlab仓库</el-button
        >
      </div>
      <div v-else-if="save_label.sign == 'update'">
        <el-button
          style="margin: 10px 0 0 33%"
          type="primary"
          @click="update_project('project', false)"
          >更新</el-button
        >
        <el-button
          style="margin-left: 10px"
          type="primary"
          @click="update_project('project', true)"
          >更新并修改关联的gitlab仓库</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  height: calc(100vh - 250px);
  overflow-y: auto;
  padding: 20px 0 0 20%;
  box-shadow: 0px 0px 10px rgba(142, 146, 146, 0.322);
  border-radius: 15px;
  background-color: rgba(219, 233, 248, 0.178);
}
.footer {
  position: fixed;
  bottom: 0px;
  z-index: 999;
  width: 100%;
  height: 60px;
  box-shadow: 0px 0px 10px rgba(142, 146, 146, 0.322);
  border-radius: 15px;
  background-color: rgba(238, 241, 241, 0.322);
}
</style>

<script>
import { updateProject, saveProject, getProject } from "network/project";
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
    const validateProjectName = (rule, value, callback) => {
      console.log(this.project_name_old);
      if (this.project.name && this.project.name != this.project_name_old) {
        //   检查模板名称是否已经存在
        getProject(null, null, this.project.name).then((res) => {
          if (res.count > 0) {
            let projectExist = false;
            for (let i in res.results) {
              // 说明项目名称已经存在
              if (res.results[i].name === this.project.name) {
                projectExist = true;
                break;
              }
            }
            if (projectExist) {
              return callback(new Error("已经存在相同的项目名"));
            } else {
              return callback();
            }
          } else {
            return callback();
          }
        });
      } else {
        return callback();
      }
    };
    return {
      currentPage: this.$route.path,
      project_name_old: this.fatherProject.name,
      project: this.fatherProject,
      env_variable: false,
      env_dict: this.fatherEnvDict,
      rules: {
        name: [
          { required: true, message: "项目名称是必填项", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
          { validator: validateProjectName, trigger: "blur" },
        ],
        desc: [
          { required: false, trigger: "blur" },
          {
            min: 0,
            max: 200,
            message: "长度在 0 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.save_label.sign == "update") {
      this.env_variable = true;
    }
  },
  computed: {
    save_label() {
      if (this.currentPage == "/toolsweb/project/edit") {
        return { sign: "update" };
      } else if (this.currentPage == "/toolsweb/project/create") {
        return { sign: "save" };
      }
    },
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
    env_switch() {
      if (!this.env_variable) {
        this.env_dict = [
          {
            key: "",
            value: "",
            required: false,
          },
        ];
      }
    },
    update_project(formName, replace_gitproject = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let env_variable = {};
          for (this.item in this.env_dict) {
            if (
              !this.env_dict[this.item].key & !this.env_dict[this.item].value
            ) {
              continue;
            } else {
              env_variable[this.env_dict[this.item].key] =
                this.env_dict[this.item].value;
            }
          }
          const data = {
            name: this.project.name,
            desc: this.project.desc,
            update_user: localStorage.getItem("userName"),
            env_variable: env_variable,
          };
          updateProject(this.project.id, data)
            .then((res) => {
              if (res.id) {
                if (replace_gitproject) {
                  this.$router.push({
                    path: "/toolsweb/project/case",
                    query: { project_id: res.id },
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: "更新成功!",
                  });
                  this.$router.push("/toolsweb/project/index");
                }
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message({
                type: "error",
                message: "更新失败!",
              });
            });
        } else {
        }
      });
    },
    save_project(formName, replace_gitproject = false) {
      let env_variable = {};
      for (this.item in this.env_dict) {
        if (!this.env_dict[this.item].key & !this.env_dict[this.item].value) {
          continue;
        } else {
          env_variable[this.env_dict[this.item].key] =
            this.env_dict[this.item].value;
        }
      }
      let username = localStorage.getItem("userName");
      let data = {
        name: this.project.name,
        desc: this.project.desc,
        update_user: username,
        create_user: username,
        env_variable: env_variable,
      };
      console.log(data);
      saveProject(data)
        .then((res) => {
          if (res.id) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
            this.$router.push({
              path: "/toolsweb/project/case",
              query: { project_id: res.id },
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
