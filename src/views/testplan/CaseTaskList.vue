<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <!-- <el-form label-position="left" inline class="table-expand">
          <el-form-item label="商品名称">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="所属店铺">
            <span>{{ props.row.shop }}</span>
          </el-form-item>
          <el-form-item label="商品 ID">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="店铺 ID">
            <span>{{ props.row.shopId }}</span>
          </el-form-item>
          <el-form-item label="商品分类">
            <span>{{ props.row.category }}</span>
          </el-form-item>
          <el-form-item label="店铺地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="商品描述">
            <span>{{ props.row.desc }}</span>
          </el-form-item>
        </el-form> -->
      </template>
    </el-table-column>
    <el-table-column label="任务 ID" prop="id"> </el-table-column>
    <el-table-column label="状态" prop="state"> </el-table-column>
    <el-table-column label="任务总job数" prop="case_job_number">
    </el-table-column>
    <el-table-column label="完成job数" prop="finish_num"> </el-table-column>
    <el-table-column label="创建时间" prop="create_date"> </el-table-column>
    <el-table-column label="总计用时" prop="used_time"> </el-table-column>
  </el-table>
</template>

<style>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import { getCaseTasksInfo } from "network/testplan";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    console.log(this.$route.query.case_testplan_uid);
    getCaseTasksInfo(this.$route.query.case_testplan_uid, 10, 0)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
