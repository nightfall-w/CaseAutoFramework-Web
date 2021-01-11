<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:57:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-02-18 17:40:53
 -->
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="接口名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="接口描述" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="请求地址" prop="addr">
        <el-input
          placeholder="请输入地址"
          v-model="ruleForm.addr"
          class="input-with-select"
        >
          <el-select
            v-model="ruleForm.request_mode"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option
              v-for="mode in modeList"
              :key="mode"
              :label="mode"
              :value="mode"
            ></el-option>
          </el-select>
          <el-button slot="append" @click="params2Show">Params</el-button>
        </el-input>
      </el-form-item>
      <el-form-item v-show="paramsShow">
        <el-row v-for="(param, index) in ruleForm.params" :key="index">
          <el-input
            style="width: 45%; margin-right: 15px"
            size="small"
            v-model="param.key"
            placeholder="key"
          ></el-input>
          <el-input
            style="width: 45%; margin-right: 15px"
            v-model="param.value"
            size="small"
            placeholder="value"
          ></el-input>
          <el-button
            style="margin-left: 30px"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="minusParamsItem(index)"
            circle
          ></el-button>
        </el-row>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="addParamsItem"
          circle
        ></el-button>
      </el-form-item>
      <el-form-item label="高级配置">
        <el-tabs type="border-card">
          <el-tab-pane label="Headers">
            <div v-for="(header, index) in ruleForm.headers" :key="index">
              <el-autocomplete
                size="small"
                style="width: 45%"
                popper-class="el-autocomplete"
                class="inline-input"
                v-model="header.key"
                :fetch-suggestions="querySearchKey"
                placeholder="key"
                @select="handleSelect"
              >
                <i
                  class="el-icon-edit el-input__icon"
                  slot="suffix"
                  @click="handleIconClick"
                ></i>
              </el-autocomplete>
              <el-autocomplete
                size="small"
                style="width: 45%"
                popper-class="el-autocomplete"
                class="inline-input"
                v-model="header.value"
                :fetch-suggestions="querySearchValue"
                placeholder="value"
                @select="handleSelect"
              >
                <i
                  class="el-icon-edit el-input__icon"
                  slot="suffix"
                  @click="handleIconClick"
                ></i>
              </el-autocomplete>
              <el-button
                style="margin-left: 30px"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="minusItem(index)"
                circle
              ></el-button>
            </div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addItem"
              circle
            ></el-button>
          </el-tab-pane>
          <el-tab-pane label="Body">
            <el-tabs>
              <el-tab-pane label="form-data" name="form-data">
                <el-row v-for="(item, index) in ruleForm.formData" :key="index">
                  <el-input
                    style="width: 40%; margin-right: 20px"
                    size="small"
                    v-model="item.key"
                    placeholder="key"
                  ></el-input>
                  <el-input
                    style="width: 40%"
                    v-model="item.value"
                    size="small"
                    placeholder="value"
                  ></el-input>
                  <el-button
                    style="margin-left: 30px"
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    @click="minusFormDataItem(index)"
                    circle
                  ></el-button>
                </el-row>
                <el-button
                  type="primary"
                  style="margin-left: 30px"
                  size="small"
                  icon="el-icon-plus"
                  @click="addFormDataItem"
                  circle
                ></el-button>
              </el-tab-pane>
              <el-tab-pane
                label="x-www-form-urlencoded"
                name="x-www-form-urlencoded"
              >
                <el-row
                  v-for="(item, index) in ruleForm.urlencoded"
                  :key="index"
                >
                  <el-input
                    style="width: 40%; margin-right: 20px"
                    size="small"
                    v-model="item.key"
                    placeholder="key"
                  ></el-input>
                  <el-input
                    style="width: 40%"
                    v-model="item.value"
                    size="small"
                    placeholder="value"
                  ></el-input>
                  <el-button
                    type="danger"
                    style="margin-left: 30px"
                    size="small"
                    icon="el-icon-delete"
                    @click="minusurlEncodedItem(index)"
                    circle
                  ></el-button>
                </el-row>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-plus"
                  @click="addurlEncodedItem"
                  circle
                ></el-button>
              </el-tab-pane>
              <el-tab-pane label="raw" name="raw" circle>
                <el-input v-model="ruleForm.raw" type="textarea"></el-input>
                <el-button size="small" @click="checkJson"
                  >json格式化校验</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="Assert">
            <el-row v-for="(assert, index) in ruleForm.asserts" :key="index">
              <el-select
                v-model="assert.assertType"
                size="small"
                placeholder="表达式类型"
              >
                <el-option
                  v-for="(asser_type, index) in assertTypes"
                  :key="index"
                  :label="asser_type.name"
                  :value="asser_type.value"
                ></el-option>
              </el-select>
              <el-input
                style="width: 20%; margin-left: 40px; margin-right: 40px"
                size="small"
                v-model="assert.expressions"
                placeholder="断言表达式"
              ></el-input>
              <el-select
                v-model="assert.calculate"
                size="small"
                placeholder="运算符"
              >
                <el-option
                  v-for="(asser_type, index) in operators"
                  :key="index"
                  :label="asser_type.name"
                  :value="asser_type.value"
                ></el-option>
              </el-select>
              <el-input
                style="width: 30%; margin: 0 40px"
                v-model="assert.expect"
                size="small"
                placeholder="期望值"
              ></el-input>
              <el-button
                style="margin-left: 30px"
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="minusAssertItem(index)"
                circle
              ></el-button>
            </el-row>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addAssertItem"
              circle
            ></el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          submitbnt
        }}</el-button>
        <el-button @click="resetForm('ruleForm', resetbnt)">{{
          resetbnt
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="stylus">
.el-autocomplete {
  margin-right: 10px;
}

.el-select .el-input {
  width: 120px;
}
</style>

<script>
import { createInterface, updateInterface } from "network/interface";
export default {
  name: "interfaceDetail",
  props: {
    fatherRuleForm: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: this.fatherRuleForm,
      paramsShow: false,
      assertTypes: [
        { name: "定界符", value: "delimiter" },
        { name: "正则表达式", value: "regular" }
      ],
      operators: [
        {
          name: "等于",
          value: "equals"
        },
        {
          name: "小于",
          value: "less_than"
        },
        {
          name: "小于等于",
          value: "less_than_or_equals"
        },
        {
          name: "大于",
          value: "greater_than"
        },
        {
          name: "大于等于",
          value: "greater_than_or_equals"
        },
        {
          name: "不等于",
          value: "not_equals"
        },
        {
          name: "字符串等于",
          value: "string_equals"
        },
        {
          name: "长度等于",
          value: "length_equals"
        },
        {
          name: "长度不等于",
          value: "length_not_equals"
        },
        {
          name: "长度大于",
          value: "length_greater_than"
        },
        {
          name: "长度大于等于",
          value: "length_greater_than_or_equals"
        },
        {
          name: "长度小于",
          value: "length_less_than"
        },
        {
          name: "长度小于等于",
          value: "length_less_than_or_equals"
        },
        {
          name: "包含",
          value: "contain"
        },
        {
          name: "不包含",
          value: "not_contain"
        },
        {
          name: "状态码等于",
          value: "state_code_contain"
        },
        {
          name: "状态码不等于",
          value: "state_code_not_contain"
        }
      ],
      headersKeys: [
        { value: "Accept" },
        { value: "Accept-Language" },
        { value: "Accept-Charset" },
        { value: "Accept-Encoding" },
        { value: "User-Agent" },
        { value: "Cookie" },
        { value: "Referer" },
        { value: "Content-Length" },
        { value: "Content-Encoding" },
        { value: "Content-Type" },
        { value: "Content-Location" },
        { value: "Cache-control" },
        { value: "Authorization" }
      ],
      headerValues: [
        { value: "text/html; charset=utf-8" },
        { value: "text/html; charset=iso-8859-1" },
        { value: "text/plain" },
        { value: "image/jpeg" },
        { value: "application/zip" },
        { value: "application/pdf" },
        { value: "audio/mpeg" },
        { value: "text/css" },
        { value: "text/javascript" },
        { value: "text/xml" },
        { value: "application/json" },
        { value: "application/octet-stream" },
        { value: "max-age=5" },
        { value: "no-cache" },
        { value: "no-store" },
        { value: "gzip, deflate, sdch" }
      ],
      calculate: [""],
      modeList: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      selectHeaderKeys: [],
      selectHeaderValues: [],
      rules: {
        name: [
          { required: true, message: "请输入接口名称", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        mode: [
          { required: true, message: "请选择请求方法", trigger: "change" }
        ],
        addr: [
          { required: true, message: "请输入接口地址", trigger: "blur" },
          {
            min: 6,
            max: 200,
            message: "长度在 6 到 200 个字符",
            trigger: "blur"
          }
        ],
        asserts: [],
        desc: [{ required: true, message: "请填写接口描述", trigger: "blur" }]
      }
    };
  },
  computed: {
    resetbnt() {
      if (this.$route.path.indexOf("edit") != -1) {
        return "恢复";
      } else {
        return "重置";
      }
    },
    submitbnt() {
      if (this.$route.path.indexOf("edit") != -1) {
        return "提交更改";
      } else {
        return "立即创建";
      }
    }
  },
  methods: {
    querySearchKey(queryString, cb) {
      var selectHeaderKeys = this.selectHeaderKeys;
      var results = queryString
        ? selectHeaderKeys.filter(this.createFilter(queryString))
        : selectHeaderKeys;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchValue(queryString, cb) {
      var selectHeaderValues = this.selectHeaderValues;
      var results = queryString
        ? selectHeaderValues.filter(this.createFilter(queryString))
        : selectHeaderValues;
      // 调用 callback 返回建议列表的数据
      console.log(results);
      cb(results);
    },
    createFilter(queryString) {
      return headers => {
        return (
          headers.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    loadHeadersKey() {
      return this.headersKeys;
    },
    loadHeadersValue() {
      return this.headerValues;
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    addItem() {
      console.log("+++");
      this.ruleForm.headers.push({ key: "", value: "" });
    },
    minusItem(index) {
      console.log("----");
      this.ruleForm.headers.splice(index, 1);
    },
    addParamsItem() {
      console.log("+++");
      this.ruleForm.params.push({ key: "", value: "" });
    },
    minusParamsItem(index) {
      this.ruleForm.params.splice(index, 1);
    },
    addFormDataItem() {
      console.log("+++");
      this.ruleForm.formData.push({ key: "", value: "" });
    },
    minusFormDataItem(index) {
      this.ruleForm.formData.splice(index, 1);
    },
    addurlEncodedItem() {
      console.log("+++");
      this.ruleForm.urlencoded.push({ key: "", value: "" });
    },
    minusurlEncodedItem(index) {
      this.ruleForm.urlencoded.splice(index, 1);
    },
    addAssertItem() {
      this.ruleForm.asserts.push({
        assertType: "",
        expressions: "",
        calculate: "",
        expect: ""
      });
      console.log(this.ruleForm);
    },
    minusAssertItem(index) {
      this.ruleForm.asserts.splice(index, 1);
    },
    checkJson() {
      let data = this.ruleForm.raw;
      if (typeof data == "string") {
        try {
          var obj = JSON.parse(data);
          if (typeof obj == "object" && obj) {
            this.$message({
              type: "success ",
              message: "检验通过"
            });
            return true;
          } else {
            this.$message({
              type: "error",
              message: "raw数据不是json格式"
            });
            return false;
          }
        } catch (e) {
          this.$message({
            type: "error",
            message: "raw数据不是json格式"
          });
          return false;
        }
      }
    },
    params2Show() {
      if (this.paramsShow === false) {
        this.paramsShow = true;
      } else {
        this.paramsShow = false;
      }
    },
    list2map(listObj) {
      let map = {};
      console.log(listObj);
      for (this.index in listObj) {
        if (listObj[this.index].key) {
          map[listObj[this.index].key] = listObj[this.index].value;
        } else {
          continue;
        }
      }
      console.log(map);
      return map;
    },
    submitForm(formName) {
      if (this.$route.path.indexOf("edit") != -1) {
        return this.updateForm(formName);
      } else {
        return this.createForm(formName);
      }
    },
    createForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.checkJson()) {
          let data = Object.assign({}, this.ruleForm);
          data.raw = JSON.parse(data.raw);
          console.log(data.headers);
          data.headers = this.list2map(data.headers);
          data.formData = this.list2map(data.formData);
          data.urlencoded.push.apply(data.urlencoded, data.params);
          data.params = [];
          this.ruleForm.params = [];
          console.log(data.urlencoded);
          data.urlencoded = this.list2map(data.urlencoded);
          createInterface(data)
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "创建成功!"
              });
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: "创建失败1!"
              });
            });
        } else {
          this.$message({
            type: "error",
            message: "创建失败2!"
          });
          return false;
        }
      });
    },
    updateForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.checkJson()) {
          let data = Object.assign({}, this.ruleForm);
          data.raw = JSON.parse(data.raw);
          console.log(this.ruleForm.raw);
          console.log(data.raw);
          updateInterface(data.id, data)
            .then(res => {
              console.log(res);
              this.$message({
                type: "success",
                message: "更新成功!"
              });
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: "更新失败1!"
              });
            });
        } else {
          this.$message({
            type: "error",
            message: "更新失败2!"
          });
          return false;
        }
      });
    },
    resetForm(formName, resetbnt) {
      if (resetbnt == "恢复") {
        location.reload();
      } else if (resetbnt == "重置") {
        console.log(formName);
        console.log(this.ruleForm);
        this.$refs[formName].resetFields();
        this.ruleForm.params = [];
        this.ruleForm.headers = [];
        this.ruleForm.urlencoded = [];
        this.ruleForm.formData = [];
        this.ruleForm.raw = "{}";
      }
    }
  },
  mounted() {
    this.selectHeaderKeys = this.loadHeadersKey();
    this.selectHeaderValues = this.loadHeadersValue();
  }
};
</script>
