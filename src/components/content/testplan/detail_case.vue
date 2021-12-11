<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 16:00:11
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-03-20 23:17:18
 -->
<template>
  <div>
    <div>
      <el-descriptions
        class="margin-top"
        title="用例库信息"
        :column="3"
        size="small"
        :contentStyle="{ 'font-weight': 700 }"
        border
      >
        <template slot="extra">
          <el-button type="primary" @click="nextShowDrawer" size="small"
            >下一步</el-button
          >
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-home"></i>
            gitlab服务器
          </template>
          {{ caseBaseInfo.gitlab服务器 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-shop"></i>
            用例库名称
          </template>
          {{ caseBaseInfo.项目名 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-flag"></i>
            当前分支
          </template>
          <el-tag size="small">{{ caseBaseInfo.分支名 }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      <el-drawer
        title="case测试计划"
        :modal="true"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <el-container>
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
              <el-form-item label="开启定时器？">
                <el-radio-group v-model="timerEnable" size="medium">
                  <el-radio border :label="false">否</el-radio>
                  <el-radio border :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="定时规则" v-show="timerEnable">
                <div id="app">
                  <div class="box">
                    <el-input
                      v-model="input"
                      placeholder
                      class="inp"
                    ></el-input>
                    <el-button type="primary" @click="showDialog"
                      >生成 cron</el-button
                    >
                  </div>
                  <el-dialog
                    title="生成 cron"
                    :modal="false"
                    :append-to-body="false"
                    :visible.sync="showCron"
                  >
                    <vcrontab
                      @hide="showCron = false"
                      @fill="crontabFill"
                      :expression="expression"
                    ></vcrontab>
                  </el-dialog>
                </div>
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
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-drawer>
      <el-divider
        ><i class="el-icon-star-on">选择case并添加到执行列表</i></el-divider
      >
      <div class="content">
        <el-container>
          <div class="block" style="margin-left: 5%; width: 45%; float: left">
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
              @node-contextmenu="get_case_content"
              @node-click="appendCaselist"
              ref="tree"
            >
            </el-tree>
          </div>
          <div>
            <el-link v-show="this.env_file" type="info"
              >环境配置: {{ AP2RP(this.env_file) }}</el-link
            >
            <br />
            <br />
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
                  {{ AP2RP(cases[scope.$index]) }}
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
              :fontSize="12"
              lang="python"
              theme="xcode"
              @init="editorInit"
            >
              <div>{{ dialogDesc }}</div>
            </vue-ace-editor>
          </el-dialog>
        </el-container>
      </div>
    </div>
    <div class="footer">
      <el-button
        style="margin: 10px 0 0 30%"
        @click="set_evn_file"
        plain
        round
        type="primary"
        >设置为环境配置文件</el-button
      >
      <el-button @click="add_case2_list" plain round type="primary"
        >添加选中到右侧case池</el-button
      >
      <el-button @click="cancel_checked_nodes" plain round type="primary"
        >取消全部选中</el-button
      >
    </div>
  </div>
</template>

<style scoped>
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
.content {
  height: calc(100vh - 380px);
  overflow-y: auto;
  /* padding: 20px 0 0 20%; */
  box-shadow: 0px 0px 10px rgba(142, 146, 146, 0.322);
  border-radius: 15px;
  background-color: rgba(219, 233, 248, 0.178);
}
.footer {
  position: fixed;
  bottom: 0px;
  z-index: 999;
  width: 88%;
  height: 60px;
  box-shadow: 0px 0px 10px rgba(142, 146, 146, 0.322);
  border-radius: 15px;
  background-color: rgba(238, 241, 241, 0.322);
}
</style>

<script>
import Sortable from "sortablejs";
import { getCaseTree, getCaseContent, getScriptCases } from "network/case";
import { createCaseTestplan, updateCaseTestplan } from "network/testplan";
import { VueAceEditor } from "vue2x-ace-editor";
let id = 5000;
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
      // default: () => [],
    },
    fatherTimerEnable: {
      type: Boolean,
    },
    fatherCrontab: {
      type: String,
    },
    fatherEnvFile: {
      type: String,
    },
  },
  components: {
    VueAceEditor,
  },
  data() {
    return {
      drawer: false,
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
      env_file: this.fatherEnvFile,
      tree_loading: true,
      dialogVisible: false,
      dialogContent: "",
      dialogTitle: "",
      dialogDesc: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      subCases: [],
      timerEnable: this.fatherTimerEnable,
      input: this.fatherCrontab,
      expression: "",
      showCron: false,
    };
  },

  methods: {
    filterNode(value, data) {
      console.log(value);
      console.log(data);
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
      require("brace/theme/xcode");
    },
    dialogClose() {
      (this.dialogDesc = ""), (this.dialogTitle = "");
    },
    get_case_content(event, data, node, obj) {
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
    appendCaselist(data, node, obj) {
      console.log(node);
      console.log(data);
      console.log(obj);
      if (!data.filepath) {
        return false;
      }
      if (data.children) {
        return true;
      }
      this.$set(data, "children", []);
      getScriptCases(data.filepath)
        .then((res) => {
          this.subCases = res.subCaseList;
          console.log(res.subCaseList);
          for (let i = 0; i < this.subCases.length; i++) {
            data.children.push({
              id: id++,
              parent_id: data.id,
              label: this.subCases[i].label,
              filepath: this.subCases[i].filepath,
              children: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.subCases = [];
        });
    },
    delete_case_item(index) {
      console.log(index);
      this.cases.splice(index, 1);
    },
    cancel_checked_nodes() {
      this.$refs.tree.setCheckedNodes([]);
    },
    set_evn_file() {
      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      if (CheckedNodes.length !== 1) {
        console.log(CheckedNodes.length);
        this.$notify.error({
          title: "设置环境配置文件失败",
          message: "只能指定一个后缀为.env配置文件",
        });
        return false;
      }
      let file = CheckedNodes[0].filepath;
      let pos = "." + file.replace(/.+\./, "");
      if (pos != ".env") {
        this.$notify.error({
          title: "设置环境配置文件失败",
          message: "环境配置文件后缀必须为.env",
        });
      } else {
        this.env_file = CheckedNodes[0].filepath;
      }
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
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
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
              this.caseBaseInfo.分支名,
              this.timerEnable,
              this.input,
              this.env_file
            )
              .then((res) => {
                console.log(res);
                this.$message({
                  message: "创建成功",
                  type: "success",
                });
                this.drawer = false;
                this.$router.push({
                  path: "/toolsweb/casetestplan/list",
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
    nextShowDrawer() {
      this.drawer = true;
    },
    onUpdate(formName) {
      console.log(this.input);
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
              this.caseBaseInfo.分支名,
              this.timerEnable,
              this.input,
              this.env_file
            )
              .then((res) => {
                console.log(res);
                this.$message({
                  message: "更新成功",
                  type: "success",
                });
                this.drawer = false;
                this.$router.push({
                  path: "/toolsweb/casetestplan/list",
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
    crontabFill(value) {
      //确定后回传的值
      this.input = value;
    },
    showDialog() {
      this.expression = this.input; //传入的 cron 表达式，可以反解析到 UI 上
      this.showCron = true;
    },
  },
  mounted() {
    console.log(this.$route.path);
    if (this.$route.path == "/toolsweb/casetestplan/create") {
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
        this.$router.push({ path: "/toolsweb/case/create" });
        return false;
      }
    }
    this.rowDrop();
  },
  computed: {
    getPageUrlIsEdit() {
      return this.$route.path == "/toolsweb/casetestplan/edit";
    },
    AP2RP() {
      return function (AP) {
        if (AP) {
          var x = AP.indexOf("/");
          for (var i = 0; i < 1; i++) {
            x = AP.indexOf("/", x + 1);
          }
          return AP.slice(x + 1);
        } else {
          return "";
        }
      };
    },
  },
};
</script>
