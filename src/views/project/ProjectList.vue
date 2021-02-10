<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-11-16 23:20:06
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-10 15:39:00
 -->
<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column width="60px" label="ID" prop="id"> </el-table-column>
      <el-table-column label="项目名称" prop="name"> </el-table-column>
      <el-table-column width="500px" label="项目描述" prop="desc">
      </el-table-column>
      <el-table-column label="创建人" prop="create_by"> </el-table-column>
      <el-table-column label="创建时间" prop="create_date"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          {{ (scope = "") }}
          <el-input v-model="search" size="mini" placeholder="输入项目名搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="success" @click="switchProject(scope.row)"
            >使用</el-button
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
import { getProject, deleteProject } from "network/project";
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
    console.log(this.$store.state)
    getProject(this.defaultPageSize, 0).then((res) => {
      this.tableData = res.results;
      this.totalItems = res.count;
    });
  },
  watch: {
    search: {
      handler() {
        getProject(this.defaultPageSize, 0, this.search).then((res) => {
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
          deleteProject(row.id).then(
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
      getProject(this.defaultPageSize, 0).then((res) => {
        this.tableData = res.results;
        this.totalItems = res.count;
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      getProject(this.defaultPageSize, (val - 1) * this.defaultPageSize).then(
        (res) => {
          this.tableData = res.results;
          this.totalItems = res.count;
        }
      );
    },
  },
};
</script>
