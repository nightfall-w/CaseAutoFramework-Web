<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:57:56
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 14:21:39
 -->
<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="name" label="接口名称" width="200">
      </el-table-column>
      <el-table-column prop="desc" label="接口描述" width="500">
      </el-table-column>
      <el-table-column label="协议" width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ getProtocol(scope.row.addr) }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="success" size="medium">{{
              scope.row.request_mode
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="addr" label="地址" width="600"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.$index, scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="handleDelete(scope.$index, scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:30px" type="flex" justify="end">
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
import { listInterface, deleteInterface } from "network/interface";
export default {
  mounted() {
    let currentProjectID = sessionStorage.getItem("currentProjectID");
    if (currentProjectID) {
      this.currentProjectID = currentProjectID;
      listInterface(currentProjectID, 0, this.defaultPageSize).then(res => {
        this.totalItems = res.count;
        this.tableData = res.results;
      });
    }
  },
  computed: {
    getProtocol(addr) {
      return function(value) {
        if (value.indexOf("https://") == 0) {
          return "HTTPS";
        } else {
          return "HTTP";
        }
      };
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.defaultPageSize = val;
      listInterface(this.currentProjectID, 0, this.defaultPageSize).then(
        res => {
          this.tableData = res.results;
          this.totalItems = res.count;
        }
      );
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      listInterface(
        this.currentProjectID,
        (val - 1) * this.defaultPageSize,
        this.defaultPageSize
      ).then(res => {
        this.tableData = res.results;
        this.totalItems = res.count;
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "edit",
        query: {
          itemId: row.id
        }
      });
    },
    handleDelete(index, row) {
      console.log(row);
      this.$confirm("此操作将永久删除该接口, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row.id);
          deleteInterface(row.id)
            .then(res => {
              console.log(res);
              this.tableData.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  data() {
    return {
      defaultPageSize: 10,
      currentPage: 1,
      totalItems: 0,
      tableData: Array()
    };
  }
};
</script>
