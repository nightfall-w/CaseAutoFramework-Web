<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2019-11-16 23:20:06
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-10 10:29:04
 -->
<template>
  <div>
    <el-table :data="tableData.filter(data => !search || data.projectName.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
      <el-table-column width="60px" label="ID" prop="projectId">
      </el-table-column>
      <el-table-column label="项目名称" prop="projectName">
      </el-table-column>
      <el-table-column label="项目描述" prop="projectDesc">
      </el-table-column>
      <el-table-column label="创建人" prop="createUser">
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          {{scope=""}}
          <el-input v-model="search" size="mini" placeholder="输入项目名搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:30px" type="flex" justify="end">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total="totalData">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      const item = {
        projectId: 1,
        projectName: '波司登料箱',
        projectDesc: '暂无描述',
        createUser: '王保军',
        createTime: '2020-01-10'
      };
      return {
        tableData: Array(34).fill(item),
        search: ''
      }
    },
    computed: {
      totalData() {
        return this.tableData.length
      }
    },
    methods: {
      handleEdit(index, row) {
        this.$router.push('edit')
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>