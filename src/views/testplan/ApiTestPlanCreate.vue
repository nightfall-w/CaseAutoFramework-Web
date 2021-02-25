<template>
  <div
    style="
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    "
  >
    <div style="text-align: center">
      <el-form
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
          hasChecked: '${checked}/${total}',
        }"
        @change="handleChange"
        :data="api_list"
      >
      </el-transfer>
    </div>
    <p style="text-align: center; margin: 50px 0 50px">
      <el-button type="primary">提交</el-button>
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
  height: 600px;
}
.el-transfer-panel__list.is-filterable {
  height: 500px;
}
</style>

<script>
import { getApilist, createApiTestplan } from "network/testplan";

export default {
  data() {
    return {
      labelPosition: "right",
      testplanInfo: {
        name: "",
        description: "",
      },
      api_list: [],
      value: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入接口测试计划名称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        );
      },
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
        .then((res) => {
          console.log(res);
          for (let i = 0; i < res.results.length; i++) {
            this.api_list.push({
              key: i,
              label: `${res.results[i].name}（${res.results[i].addr}）`,
              // disabled: i % 4 === 0
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm() {
      if (!this.value) {
        this.$notify.error({
          title: "错误",
          message: "测试计划列表至少包含一条接口!",
        });
        return false;
      }
    },
    // createApiTestplan()
    updateForm() {},
  },
};
</script>
