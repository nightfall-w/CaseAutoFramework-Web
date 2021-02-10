<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-01-23 16:14:54
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-10 15:40:58
-->
<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column width="300px" label="测试计划名称" prop="name">
      </el-table-column>
      <el-table-column label="测试计划描述" prop="description">
      </el-table-column>
      <el-table-column
        width="120px"
        label="运行中任务数"
        prop="running_task_number"
      >
      </el-table-column>
      <el-table-column
        width="200px"
        label="所属项目"
        prop="gitlab_project_name"
      >
      </el-table-column>
      <el-table-column width="200px" label="所属分支" prop="branch_name">
      </el-table-column>
      <el-table-column width="200px" label="创建人" prop="create_user">
      </el-table-column>
      <el-table-column width="200px" label="创建时间" prop="create_date_format">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          {{ (scope = "") }}
          <el-input v-model="search" size="mini" placeholder="输入计划名搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="success" @click="switchProject(scope.row)"
            >运行</el-button
          >
          <el-button
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 30px" type="flex" justify="end">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="defaultPageSize"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getCaseTestplans, deleteCaseTestplan } from "network/testplan";
export default {
  data() {
    return {
      tableData: Array(),
      search: "",
      defaultPageSize: 10,
      currentPage: 1,
      totalItems: 0,
    };
  },
  mounted() {
    getCaseTestplans(
      sessionStorage.getItem("currentProjectID"),
      this.search,
      this.defaultPageSize,
      0
    ).then((res) => {
      this.tableData = res.results;
      this.totalItems = res.count;
    });
  },
  watch: {
    search: {
      handler() {
        getCaseTestplans(
          sessionStorage.getItem("currentProjectID"),
          this.search,
          this.defaultPageSize,
          0
        ).then((res) => {
          this.tableData = res.results;
          this.totalItems = res.count;
        });
      },
    },
  },
  methods: {
    switchProject(row) {
      this.$store.commit("SWAICH_PROJECT", {
        id: row.id,
        name: row.name,
      });
      this.$message({
        type: "success",
        message: "切换项目成功",
      });
      clearTimeout(this.timer); //清除延迟执行
      this.timer = setTimeout(() => {
        //设置延迟执行
        this.$router.go(0);
      }, 1000);
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "edit",
        query: {
          itemId: row.id,
        },
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCaseTestplan(row.id).then(
            this.tableData.splice(index, 1),
            this.$message({
              type: "success",
              message: "删除成功!",
            })
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.defaultPageSize = val;
      getCaseTestplans(
        sessionStorage.getItem("currentProjectID"),
        this.search,
        this.defaultPageSize,
        0
      ).then((res) => {
        this.tableData = res.results;
        this.totalItems = res.count;
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      getCaseTestplans(
        sessionStorage.getItem("currentProjectID"),
        this.search,
        this.defaultPageSize,
        (val - 1) * this.defaultPageSize
      ).then((res) => {
        this.tableData = res.results;
        this.totalItems = res.count;
      });
    },
  },
};
</script>
