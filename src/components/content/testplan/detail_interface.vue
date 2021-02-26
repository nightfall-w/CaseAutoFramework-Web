<template>
  <div
    style="
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    "
  >
    <div style="text-align: center">
      <el-form
        ref="testplanInfo"
        style="text-align: center"
        :label-position="labelPosition"
        label-width="80px"
        :model="testplanInfo"
        :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="testplanInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="描述说明" prop="description">
          <el-input
            v-model="testplanInfo.description"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <p style="text-align: center; margin: 50px 0 20px; color: #67c23a">
      <i class="el-icon-info"></i>从左侧接口列表选择并添加到右侧测试计划列表
    </p>
    <div style="text-align: center">
      <el-transfer
        style="text-align: left; display: inline-block"
        target-order="push"
        v-model="value"
        filterable
        :render-content="renderFunc"
        :titles="['接口列表', '测试计划列表']"
        :button-texts="['到左边', '到右边']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="api_list"
      >
      </el-transfer>
    </div>
    <p style="text-align: center; margin: 50px 0 50px">
      <el-button
        v-if="getPageUrlIsEdit != true"
        type="primary"
        @click="submitForm('testplanInfo')"
        >立即创建</el-button
      >
      <el-button
        v-else-if="getPageUrlIsEdit == true"
        type="primary"
        @click="updateForm('testplanInfo')"
        >更新提交</el-button
      >
    </p>
  </div>
</template>

<style>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.el-transfer-panel {
  width: 600px;
  height: 500px;
}
.el-transfer-panel__list.is-filterable {
  height: 500px;
}
</style>

<script>
import {
  getApilist,
  createApiTestplan,
  updateApiTestplan
} from "network/testplan";

export default {
  name: "apiTestplanDetail",
  props: {
    fatherTestplanInfo: {
      type: Object
    },
    fatherValue: {
      type: Array
    }
  },
  data() {
    return {
      labelPosition: "right",
      testplanInfo: this.fatherTestplanInfo,
      api_list: [],
      value: this.fatherValue,
      rules: {
        name: [
          {
            required: true,
            message: "请输入接口测试计划名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur"
          }
        ]
      },
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        );
      }
    };
  },
  created() {
    this.syncApilist();
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    syncApilist() {
      getApilist(sessionStorage.getItem("currentProjectID"))
        .then(res => {
          console.log(res);
          for (let i = 0; i < res.results.length; i++) {
            this.api_list.push({
              key: i,
              id: res.results[i].id,
              label: `${res.results[i].name}（${res.results[i].addr}）`
              // disabled: i % 4 === 0
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.value.length === 0) {
            this.$notify.error({
              title: "错误",
              message: "测试计划列表至少包含1个接口!"
            });
            return false;
          } else {
            let interfaceIds = [];
            for (let i = 0; i < this.value.length; i++) {
              //pass
              console.log(this.value[i]);
              interfaceIds.push(this.api_list[this.value[i]].id);
            }
            console.log(interfaceIds);
            createApiTestplan(
              this.testplanInfo.name,
              this.testplanInfo.description,
              sessionStorage.getItem("currentProjectID"),
              JSON.stringify(interfaceIds)
            )
              .then(res => {
                console.log(res);
                this.$message({
                  message: "测试计划创建成功",
                  type: "success"
                });
              })
              .catch(err => {
                console.log(err);
                this.$message.error("很抱歉，创建失败");
              });
          }
          return false;
        }
      });
    },
    updateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.value.length === 0) {
            this.$notify.error({
              title: "错误",
              message: "测试计划列表至少包含1个接口!"
            });
            return false;
          } else {
            let interfaceIds = [];
            for (let i = 0; i < this.value.length; i++) {
              //pass
              console.log(this.value[i]);
              interfaceIds.push(this.api_list[this.value[i]].id);
            }
            console.log(interfaceIds);
            updateApiTestplan(
              this.$route.query.itemId,
              this.testplanInfo.name,
              this.testplanInfo.description,
              sessionStorage.getItem("currentProjectID"),
              JSON.stringify(interfaceIds)
            )
              .then(res => {
                console.log(res);
                this.$message({
                  message: "测试计划更新成功",
                  type: "success"
                });
              })
              .catch(err => {
                console.log(err);
                this.$message.error("很抱歉，更新失败");
              });
          }
          return false;
        }
      });
    }
  },
  computed: {
    getPageUrlIsEdit() {
      return this.$route.path == "/apitestplan/edit";
    }
  }
};
</script>
