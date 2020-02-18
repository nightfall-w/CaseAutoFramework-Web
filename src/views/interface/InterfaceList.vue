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
      <el-table-column fixed prop="name" label="接口名称" width="150">
      </el-table-column>
      <el-table-column prop="desc" label="接口描述" width="210">
      </el-table-column>
      <el-table-column label="协议" width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.agree }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" width="100">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag type="success" size="medium">{{ scope.row.mode }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="addr" label="地址" width="370">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:30px" type="flex" justify="end">
      <el-pagination hide-on-single-page background layout="prev, pager, next" :total=100>
      </el-pagination>
    </el-row>
  </div>
</template>


<script>
  export default {
    methods: {
      handleEdit(index, row) {
        this.$router.push('edit')
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
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
    },

    data() {
      const item = {
        id: 0,
        name: '测试接口',
        desc: '暂无描述',
        agree: 'http',
        mode: 'GET',
        addr: '192.168.21.203',
      };
      return {
        tableData: Array(11).fill(item),
      }
    },
  }
</script>