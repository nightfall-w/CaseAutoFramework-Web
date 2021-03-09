<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2021-02-19 22:43:32
 * @LastEditors: wangbaojun
 * @LastEditTime: 2021-02-21 18:02:40
-->
<template>
  <div>
    <el-table
      :data="tableData"
      :row-key="record => record.id"
      :expand-row-keys="expands"
      @expand-change="expand_change"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item
              v-for="(item, i) in job_list"
              :key="i"
              :title="item.case_path"
              :name="i"
            >
              <template slot="title">
                <div v-if="item.state == 'WAITING'" style="color: #909399">
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.case_path }}</strong></i
                  >
                  <i class="header-icon el-icon-info"></i>
                </div>
                <div v-if="item.state == 'RUNNING'" style="color: #409eff">
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.case_path }}</strong></i
                  >
                  <i class="header-icon el-icon-info"></i>
                </div>
                <div v-if="item.state == 'FINISH'" style="color: #67c23a">
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.case_path }}</strong></i
                  >
                  <i class="header-icon el-icon-info"></i>
                </div>
                <div v-if="item.state == 'FAILED'" style="color: #f56c6c">
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.case_path }}</strong></i
                  >
                  <i class="header-icon el-icon-info"></i>
                </div>
              </template>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="执行状态">
                  <span>{{ item.state }}</span>
                </el-form-item>
                <el-form-item label="执行结果">
                  <span>{{ item.result }}</span>
                </el-form-item>
                <el-form-item v-if="item.report_path" label="报告地址">
                  <a
                    :href="VUE_APP_SERVER_URL + item.report_path"
                    target="_blank"
                    >查看详细报告</a
                  >
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column label="任务 ID" prop="id"> </el-table-column>
      <el-table-column label="任务总job数" prop="case_job_number">
      </el-table-column>
      <el-table-column label="完成job数" prop="finish_num"> </el-table-column>
      <el-table-column label="进度" prop="percentage">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="
              percentage(scope.row.finish_num, scope.row.case_job_number)
            "
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag :type="tag_style(scope.row.state)" disable-transitions>{{
            scope.row.state
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_date"> </el-table-column>
      <el-table-column label="总计用时/s" prop="used_time">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.used_time }}</span>
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
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="defaultPageSize"
      >
      </el-pagination>
    </el-row>
  </div>
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import { getCaseTasksInfo, getCaseJobsInfo } from "network/testplan";
export default {
  data() {
    return {
      VUE_APP_SERVER_URL: process.env.VUE_APP_SERVER_URL,
      tableData: [],
      defaultPageSize: 10,
      currentPage: 1,
      totalItems: 0,
      expands: [],
      job_list: [],
      activeNames: [],
      ws_retry: 10
    };
  },
  created() {
    this.initWebSocket();
    console.log(this.$route.query.case_testplan_uid);
    getCaseTasksInfo(
      this.$route.query.case_testplan_uid,
      this.defaultPageSize,
      0
    )
      .then(res => {
        console.log(res);
        this.tableData = res.results;
        this.totalItems = res.count;
      })
      .catch(err => {
        console.log(err);
      });
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  computed: {
    percentage() {
      return function(finish_num, case_job_number) {
        return (finish_num / case_job_number) * 100;
      };
    }
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_SERVER_WS + "/ws/testplan/result/";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("websocket连接已经建立");
      this.websocketsend(this.package_ws_task_data());
    },
    websocketonerror() {
      this.ws_retry -= 1;
      //连接建立失败重连
      if (this.ws_retry >= 0) {
        this.initWebSocket();
      }
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata);
      if (redata.success && redata.mode === "task") {
        var that = this;
        for (var i = 0; i < redata.data.length; i++) {
          for (var j = 0; j < that.tableData.length; j++) {
            if (redata.data[i].id == that.tableData[j].id) {
              that.tableData[j].state = redata.data[i].state;
              that.tableData[j].finish_num = redata.data[i].finish_num;
              that.tableData[j].used_time = redata.data[i].used_time;
            }
          }
        }
      } else if (redata.success && redata.mode === "job") {
        console.log(redata);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      if (this.$route.path === "/casetestplan/task") {
        this.ws_retry -= 1;
        if (this.ws_retry >= 0) {
          this.initWebSocket();
        }
      }
    },
    tag_style(state) {
      if (state === "FINISH") {
        return "success";
      } else if (state === "WAITING") {
        return "info";
      } else if (state === "RUNNING") {
        return "primary";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.defaultPageSize = val;
      getCaseTasksInfo(
        this.$route.query.case_testplan_uid,
        this.defaultPageSize,
        0
      ).then(res => {
        this.tableData = res.results;
        this.totalItems = res.count;
        console.log(this.websock.readyState);
        this.websock.close();
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      getCaseTasksInfo(
        this.$route.query.case_testplan_uid,
        this.defaultPageSize,
        (val - 1) * this.defaultPageSize
      ).then(res => {
        this.tableData = res.results;
        this.totalItems = res.count;
        this.websock.close();
      });
    },
    expand_change(row, expandedRows) {
      var that = this;
      if (expandedRows.length) {
        // 只展开一行//说明展开了
        that.expands = [];
        this.activeNames = [];
        this.job_list = [];
        if (row) {
          that.expands.push(row.id); // 只展开当前行id
        }
        // 调用case job接口数据渲染
        getCaseJobsInfo(row.id)
          .then(res => {
            console.log(res);
            this.job_list = res.results;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 说明收起了
        that.expands = [];
        this.activeNames = [];
        this.job_list = [];
      }
    },
    handleChange(value) {
      // pass
      console.log(value);
    },
    package_ws_task_data() {
      return JSON.stringify({
        mode_type: "case",
        task_or_job: "task",
        value: {
          case_test_plan_uid: this.$route.query.case_testplan_uid,
          limit: this.currentPage * this.defaultPageSize,
          offset: (this.currentPage - 1) * this.defaultPageSize
        }
      });
    }
  }
};
</script>
