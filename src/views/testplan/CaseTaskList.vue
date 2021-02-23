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
        <template slot-scope="props">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item
              v-for="(item, i) in job_list"
              :key="i"
              title="一致性 Consistency"
              name="1"
            >
              <div>
                与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
              </div>
              <div>
                在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
              </div>
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
</style>

<script>
import { getCaseTasksInfo } from "network/testplan";
export default {
  data() {
    return {
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
        if (row) {
          that.expands.push(row.id); // 只展开当前行id
          console.log(this.package_ws_job_data());
          this.websocketsend(this.package_ws_job_data());
        }
        //  this.tablaData(row.eqId)  这里可以调用接口数据渲染
      } else {
        // 说明收起了
        that.expands = [];
      }
    },
    handleChange(value) {
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
    },
    package_ws_job_data() {
      return JSON.stringify({
        mode_type: "case",
        task_or_job: "job",
        value: {
          case_task_id: this.expands[0]
        }
      });
    }
  }
};
</script>
