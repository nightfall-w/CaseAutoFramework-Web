<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-01-23 16:14:54
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-16 21:11:52
-->
<template>
  <div>
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="接口测试计划"
    >
    </el-page-header>
    <br />
    <br />
    <el-table :data="tableData" @row-click="handleSelect" style="width: 100%">
      <el-table-column width="300px" label="测试计划名称" prop="name">
      </el-table-column>
      <el-table-column label="测试计划描述" prop="description">
      </el-table-column>
      <el-table-column
        width="220px"
        label="运行中任务数"
        prop="running_task_number"
      >
      </el-table-column>
      <el-table-column width="250px" label="创建人" prop="user_info.first_name">
      </el-table-column>
      <el-table-column width="250px" label="创建时间" prop="create_date_format">
      </el-table-column>
      <el-table-column align="right" width="400px">
        <template slot="header" slot-scope="scope">
          {{ (scope = "") }}
          <el-input v-model="search" size="mini" placeholder="输入计划名搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="success" @click="runTestplan(scope.row)"
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
import {
  getApiTestplans,
  deleteApiTestplan,
  runApiTestplan,
} from "network/testplan";
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
    getApiTestplans(
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
        getApiTestplans(
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
    goBack() {
      this.$router.push("/toolsweb/apitestplan/list");
    },
    runTestplan(row) {
      console.log(row.plan_id);
      runApiTestplan(row.project_id, row.plan_id)
        .then((res) => {
          console.log(res);
          this.$message({
            type: "success",
            message: "已经触发运行!",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSelect(row, column) {
      console.log(column.label);
      if (column.label != undefined) {
        this.$router.push({
          path: "/toolsweb/apitestplan/task",
          query: {
            api_testplan_uid: row.plan_id,
          },
        });
      }
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
      this.$confirm("此操作将永久删除该测试计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteApiTestplan(row.id).then(
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
      getApiTestplans(
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
      getApiTestplans(
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
