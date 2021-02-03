<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 16:00:11
 * @LastEditors: 
 * @LastEditTime: 2020-01-10 09:49:30
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
          ref="form"
          :model="testplanInfo"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="测试计划名称">
            <el-input
              v-model="testplanInfo.name"
              placeholder="请输入测试计划名"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
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
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
          class="filter-tree"
          :show-checkbox="true"
          :data="case_tree"
          :props="defaultProps"
          :default-expand-all="false"
          node-key="id"
          :filter-node-method="filterNode"
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
        <el-table :data="cases" border style="width: 100%" :rowKey="getrowKey">
          <el-table-column width="60px" label="序号" type="index">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in col"
            :key="`col_${index}`"
            :prop="dropCol[index].prop"
            :label="item.label"
            width="500px"
          >
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
import { getCaseTree } from "network/case";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  data() {
    return {
      col: [
        {
          label: "case路径",
          prop: "case_path"
        }
      ],
      dropCol: [
        {
          label: "case路径",
          prop: "case_path"
        }
      ],
      cases: [
        {
          case_path:
            "Aquamarine5555557777777777777777777777555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555"
        },
        {
          case_path: "Hotpink"
        },
        {
          case_path: "Gold"
        },
        {
          case_path: "Crimson"
        },
        {
          case_path: "Blueviolet"
        },
        {
          case_path: "Lightblue"
        },
        {
          case_path: "Cornflowerblue"
        },
        {
          case_path: "Skyblue"
        },
        {
          case_path: "Burlywood"
        }
      ],
      caseBaseInfo: {
        gitlab服务器: "",
        项目名: "",
        分支名: ""
      },
      testplanInfo: {
        name: "",
        description: "",
        parallel: false
      },
      checked: [],
      filterText: "",
      case_tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getrowKey(row) {
      return row.case_path;
    },
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.cases.splice(oldIndex, 1)[0];
          console.log(_this.cases);
          console.log(currRow);
          _this.cases.splice(newIndex, 0, currRow);
          console.log(_this.cases);
          _this.$set(this, "cases", _this.cases);
          console.log(this.cases);
        }
      });
    },
    delete_case_item(index) {
      console.log(index);
      this.cases.splice(index, 1);
      console.log(this.cases);
    },
    cancel_checked_nodes() {
      this.$refs.tree.setCheckedNodes([]);
    },
    add_case2_list() {
      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      for (let i in CheckedNodes) {
        if (!CheckedNodes[i].filepath) {
          continue;
        } else {
          for (let j = 0; j < this.cases.length; j++) {
            console.log(2);
            console.log(CheckedNodes[i].filepath != this.cases[j].case_path);
            console.log(j + 1 == this.cases.length);
            if (CheckedNodes[i].filepath == this.cases[j].case_path) {
              break;
            } else {
              if (j + 1 == this.cases.length) {
                console.log(CheckedNodes[i].filepath);
                this.cases.splice(this.cases.length, 0, {
                  case_path: CheckedNodes[i].filepath
                });
              }
            }
          }
        }
      }
    },
    onSubmit() {
      console.log(1111);
    }
  },
  mounted() {
    const gitlab_url = this.$route.query.gitlab_url;
    const gitlab_project = this.$route.query.gitlab_project;
    const gitlab_branch = this.$route.query.gitlab_branch;
    if (gitlab_url && gitlab_project && gitlab_branch) {
      this.caseBaseInfo.gitlab服务器 = gitlab_url;
      this.caseBaseInfo.项目名 = gitlab_project;
      this.caseBaseInfo.分支名 = gitlab_branch;

      // 根据case信息获取对应目录树数据
      getCaseTree(gitlab_url, gitlab_project, gitlab_branch)
        .then(res => {
          console.log(res);
          this.case_tree = res.case_tree;
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.$message({
        message: "未提供case相关信息 请先同步case",
        type: "warning"
      });
      this.$router.push({ path: "/case/create" });
    }
    this.rowDrop();
  }
};
</script>
