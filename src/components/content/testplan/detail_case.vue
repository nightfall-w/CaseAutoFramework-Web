<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 16:00:11
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-27 15:18:27
 -->
<template>
  <div
    style="
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    "
  >
    <el-container>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>case信息</h3>
          <!-- <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          > -->
        </div>
        <div v-for="(value, key) in caseBaseInfo" :key="key" class="text item">
          <el-tag>{{ key }}:</el-tag>
          <el-tag style="margin-left: 2%" :type="'info'">{{ value }}</el-tag>
        </div>
      </el-card>
      <el-main>
        <el-form
          ref="testplanInfo"
          :rules="rules"
          :model="testplanInfo"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="测试计划名称" prop="name">
            <el-input
              v-model="testplanInfo.name"
              placeholder="请输入测试计划名"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入测试计划描述"
              v-model="testplanInfo.description"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="case执行方式">
            <el-radio-group v-model="testplanInfo.parallel" size="medium">
              <el-radio border :label="false">串行</el-radio>
              <el-radio border :label="true">并行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="large">
            <el-button
              v-if="getPageUrlIsEdit != true"
              type="primary"
              @click="onSubmit('testplanInfo')"
              >立即创建</el-button
            >
            <el-button
              v-else-if="getPageUrlIsEdit == true"
              type="primary"
              @click="onUpdate('testplanInfo')"
              >更新提交</el-button
            >
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-divider
      ><i class="el-icon-star-on">选择case并添加到执行列表</i></el-divider
    >
    <el-container>
      <div class="block" style="margin-left: 5%; width: 40%; float: left">
        <h2>case目录</h2>
        <el-input
          style="width: 200px"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        >
        </el-input>
        <br />
        <el-tree
          v-loading="tree_loading"
          class="filter-tree"
          :show-checkbox="true"
          :data="case_tree"
          :props="defaultProps"
          :default-expand-all="false"
          node-key="id"
          :filter-node-method="filterNode"
          @node-click="get_case_content"
          ref="tree"
        >
        </el-tree>
        <br />
        <el-button @click="add_case2_list" type="primary"
          >添加选中到右侧case池</el-button
        >
        <el-button @click="cancel_checked_nodes" type="primary"
          >取消全部选中</el-button
        >
      </div>
      <div>
        <el-tag type="success"
          ><i class="el-icon-info"></i>
          支持对case条目进行拖拽排序,排序后的顺序为执行顺序(仅对串行执行时有效)</el-tag
        >
        <br />
        <br />
        <el-table
          :data="cases"
          v-loading="cases_loading"
          border
          style="width: 100%"
          :rowKey="getrowKey"
        >
          <el-table-column width="60px" label="序号" type="index">
          </el-table-column>
          <el-table-column label="case路径" width="500px">
            <template slot-scope="scope">
              {{ cases[scope.$index] }}
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="70">
            <template slot-scope="scope">
              <el-button
                @click="delete_case_item(scope.$index)"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button></template
          ></el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        @close="dialogClose"
      >
        <vue-ace-editor
          height="800px"
          ref="editor"
          :content="dialogContent"
          :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            tabSize: 4,
          }"
          :fontSize="14"
          :lang="'python'"
          :theme="'eclipse'"
          @init="editorInit"
        >
          <div>{{ dialogDesc }}</div>
        </vue-ace-editor>
      </el-dialog>
    </el-container>
  </div>
</template>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>

<script>
import Sortable from "sortablejs";
import { getCaseTree, getCaseContent } from "network/case";
import { createCaseTestplan, updateCaseTestplan } from "network/testplan";
import { VueAceEditor } from "vue2x-ace-editor";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    caseBaseInfo: {
      handler() {
        // 监听获取ajax数据
        if (this.caseBaseInfo.分支名) {
          this.get_case_tree();
        }
      },
      // 监听到数据变化时立即调用
      immediate: true,
      deep: true,
    },
    cases: {
      handler() {
        console.log(this.cases);
      },
      immediate: true,
      deep: true,
    },
  },
  name: "caseTestplanDetail",
  props: {
    fatherCaseBaseInfo: {
      type: Object,
    },
    fatherTestplanInfo: {
      type: Object,
    },
    fatherCases: {
      type: Array,
    },
  },
  components: {
    VueAceEditor,
  },
  data() {
    return {
      col: [
        {
          label: "case路径",
          prop: "case_path",
        },
      ],
      dropCol: [
        {
          label: "case路径",
          prop: "case_path",
        },
      ],
      cases: this.fatherCases,
      cases_loading: false,
      caseBaseInfo: this.fatherCaseBaseInfo,
      rules: {
        name: [
          { required: true, message: "请输入测试计划名", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: false, message: "请输入测试计划描述", trigger: "blur" },
        ],
      },
      testplanInfo: this.fatherTestplanInfo,
      checked: [],
      filterText: "",
      case_tree: [],
      tree_loading: true,
      dialogVisible: false,
      dialogContent: "",
      dialogTitle: "",
      dialogDesc: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getrowKey(row) {
      return row;
    },
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.cases.splice(oldIndex, 1)[0];
          _this.cases.splice(newIndex, 0, currRow);
          // _this.$set(this, "cases", _this.cases);
          // console.log(this.cases);
        },
      });
    },
    get_case_tree() {
      // 根据case信息获取对应目录树数据
      console.log(this.caseBaseInfo.分支名);
      getCaseTree(
        this.caseBaseInfo.gitlab服务器,
        this.caseBaseInfo.项目名,
        this.caseBaseInfo.分支名
      )
        .then((res) => {
          console.log(res);
          this.case_tree = res.case_tree;
          this.tree_loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            showClose: true,
            message: "获取case目录树出错！",
            type: "error",
          });
        });
    },
    editorInit() {
      require("brace/ext/language_tools");
      require("brace/mode/python");
      require("brace/snippets/python");
      require("brace/theme/eclipse");
    },
    dialogClose() {
      (this.dialogDesc = ""), (this.dialogTitle = "");
    },
    get_case_content(data, node, obj) {
      console.log(node);
      console.log(data);
      console.log(obj);
      if (data.filepath) {
        getCaseContent(
          this.caseBaseInfo.gitlab服务器,
          this.caseBaseInfo.项目名,
          this.caseBaseInfo.分支名,
          data.filepath
        )
          .then((res) => {
            console.log(res);
            this.dialogContent = res;
            this.dialogTitle = data.label;
            this.dialogDesc = data.filepath;
            this.dialogVisible = true;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return false;
      }
    },
    delete_case_item(index) {
      console.log(index);
      this.cases.splice(index, 1);
    },
    cancel_checked_nodes() {
      this.$refs.tree.setCheckedNodes([]);
    },
    add_case2_list() {
      console.log(this.cases);
      this.cases_loading = true;
      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      for (let i in CheckedNodes) {
        if (!CheckedNodes[i].filepath) {
          continue;
        } else {
          this.cases.splice(this.cases.length, 0, CheckedNodes[i].filepath);
        }
      }
      this.cases = [...new Set(this.cases)];
      this.cases_loading = false;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.cases.length == 0) {
            this.$message.error("必须添加case到计划列表");
            return false;
          } else {
            createCaseTestplan(
              this.testplanInfo.name,
              this.testplanInfo.description,
              this.testplanInfo.parallel,
              this.cases,
              sessionStorage.getItem("currentProjectID"),
              this.caseBaseInfo.gitlab服务器,
              this.caseBaseInfo.项目名,
              this.caseBaseInfo.分支名
            )
              .then((res) => {
                console.log(res);
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                this.$message.error("创建失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onUpdate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.cases.length == 0) {
            this.$message.error("必须添加case到计划列表");
            return false;
          } else {
            updateCaseTestplan(
              this.$route.query.itemId,
              this.testplanInfo.name,
              this.testplanInfo.description,
              this.testplanInfo.parallel,
              this.cases,
              sessionStorage.getItem("currentProjectID"),
              this.caseBaseInfo.gitlab服务器,
              this.caseBaseInfo.项目名,
              this.caseBaseInfo.分支名
            )
              .then((res) => {
                console.log(res);
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                this.$message.error("更新失败");
              });
          }
        } else {
          console.log("error update!!");
          return false;
        }
      });
    },
  },
  mounted() {
    console.log(this.$route.path);
    if (this.$route.path == "/casetestplan/create") {
      const gitlab_url = this.$route.query.gitlab_url;
      const gitlab_project = this.$route.query.gitlab_project;
      const gitlab_branch = this.$route.query.gitlab_branch;
      if (gitlab_url && gitlab_project && gitlab_branch) {
        this.caseBaseInfo.gitlab服务器 = gitlab_url;
        this.caseBaseInfo.项目名 = gitlab_project;
        this.caseBaseInfo.分支名 = gitlab_branch;
        this.get_case_tree();
      } else {
        this.$message({
          message: "未提供case相关信息 请先同步case",
          type: "warning",
        });
        this.$router.push({ path: "/case/create" });
        return false;
      }
    }
    this.rowDrop();
  },
  computed: {
    getPageUrlIsEdit() {
      return this.$route.path == "/casetestplan/edit";
    },
  },
};
</script>
