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
    <el-page-header
      style="line-height: 40px; color: silver"
      @back="goBack"
      content="接口测试任务"
    >
    </el-page-header>
    <br />
    <br />
    <el-table
      :data="tableData"
      :row-key="(record) => record.id"
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
              :title="item.api_info.addr"
              :name="i"
            >
              <template slot="title">
                <div
                  v-if="item.state == 'SUCCESS'"
                  style="color: rgb(103, 194, 58)"
                >
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.api_info.addr }}</strong></i
                  >
                  <span class="header-icon">
                    <i class="el-icon-success"></i>
                    <span>{{ item.state }}</span>
                  </span>
                </div>
                <div
                  v-if="item.state == 'WAITING'"
                  style="color: rgb(144, 147, 153)"
                >
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.api_info.addr }}</strong></i
                  >
                  <span class="header-icon">
                    <i class="el-icon-question"></i>
                    <span>{{ item.state }}</span>
                  </span>
                </div>
                <div
                  v-if="item.state == 'FAILED'"
                  style="color: rgb(245, 108, 108)"
                >
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.api_info.addr }}</strong></i
                  >
                  <span class="header-icon">
                    <i class="el-icon-error"></i>
                    <span>{{ item.state }}</span>
                  </span>
                </div>
                <div v-if="item.state == 'RUNNING'" style="color: #409eff">
                  <i
                    ><strong>{{ i + 1 }}. </strong></i
                  >
                  <i
                    ><strong>{{ item.api_info.addr }}</strong></i
                  >
                  <span class="header-icon">
                    <i class="el-icon-info"></i>
                    <span>{{ item.state }}</span>
                  </span>
                </div>
              </template>
              <el-descriptions title="请求" :column="2" border>
                <el-descriptions-item
                  label="接口名称"
                  label-class-name="my-label"
                  content-class-name="my-content"
                  >{{ item.api_info.name }}</el-descriptions-item
                >
                <el-descriptions-item label="请求方式">{{
                  item.api_info.request_mode
                }}</el-descriptions-item>
                <el-descriptions-item label="请求头">
                  <json-viewer
                    :value="item.api_info.headers"
                    copyable
                  ></json-viewer>
                </el-descriptions-item>
                <el-descriptions-item label="请求体">
                  <json-viewer
                    :value="getRequestBody(item.api_info)"
                    copyable
                  ></json-viewer>
                </el-descriptions-item>
              </el-descriptions>
              <br />
              <el-descriptions title="响应" :column="2" border>
                <el-descriptions-item
                  label="响应码"
                  label-class-name="my-label"
                  content-class-name="my-content"
                  >{{ item.status_code }}</el-descriptions-item
                >
                <el-descriptions-item label="用时">{{
                  formatApiTime(item.elapsed)
                }}</el-descriptions-item>
                <el-descriptions-item label="参数提取">
                  <json-viewer :value="item.extracts" copyable></json-viewer>
                </el-descriptions-item>
                <el-descriptions-item label="结果">
                  <json-viewer
                    :value="checkJson(item.result)"
                    copyable
                  ></json-viewer>
                </el-descriptions-item>
              </el-descriptions>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column label="任务 ID" prop="api_task_uid"> </el-table-column>
      <el-table-column label="任务总job数" prop="api_job_number">
        <template slot-scope="scope">
          <span
            ><b>{{ scope.row.api_job_number }}</b></span
          >
        </template>
      </el-table-column>
      <el-table-column label="成功job数" prop="success_num">
        <template slot-scope="scope">
          <span style="color: #67c23a"
            ><b>{{ scope.row.success_num }}</b></span
          >
        </template>
      </el-table-column>
      <el-table-column label="失败job数" prop="failed_num">
        <template slot-scope="scope">
          <span style="color: red"
            ><b>{{ scope.row.failed_num }}</b></span
          >
        </template>
      </el-table-column>
      <el-table-column label="进度" prop="percentage">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="
              percentage(
                scope.row.api_job_number,
                scope.row.success_num,
                scope.row.failed_num
              )
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
          <span style="margin-left: 10px">{{
            formatUsedTime(scope.row.used_time)
          }}</span>
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

<style scoped>
.header-icon {
  position: absolute;
  right: 10%;
}
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
import { getApiTasksInfo, getApiJobsInfo } from "network/testplan";
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
      ws_retry: 10,
    };
  },
  created() {
    this.initWebSocket();
    console.log(this.$route.query.case_testplan_uid);
    getApiTasksInfo(this.$route.query.api_testplan_uid, this.defaultPageSize, 0)
      .then((res) => {
        console.log(res);
        this.tableData = res.results;
        this.totalItems = res.count;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  computed: {
    percentage() {
      return function (api_job_number, success_num, failed_num) {
        return (((success_num + failed_num) / api_job_number) * 100).toFixed(2);
      };
    },
    formatUsedTime() {
      return function (source_time) {
        if (source_time) {
          return Math.ceil(source_time * 10) / 10;
        } else {
          return null;
        }
      };
    },
    formatApiTime() {
      return function (seconds_time) {
        if (seconds_time) {
          return Math.ceil(seconds_time * 1000 * 10) / 10 + "ms";
        } else {
          return null;
        }
      };
    },
  },
  methods: {
    goBack() {
      this.$router.push("/toolsweb/apitestplan/list");
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = process.env.VUE_APP_SERVER_WS + "/cap/ws/testplan/result/";
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
      if (this.$route.path === "/toolsweb/apitestplan/task") {
        this.ws_retry -= 1;
        console.log(this.ws_retry);
        if (this.ws_retry >= 0) {
          this.initWebSocket();
        }
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
              that.tableData[j].success_num = redata.data[i].success_num;
              that.tableData[j].failed_num = redata.data[i].failed_num;
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
      if (this.$route.path === "/toolsweb/apitestplan/task") {
        this.ws_retry -= 1;
        console.log(this.ws_retry);
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
      getApiTasksInfo(
        this.$route.query.case_testplan_uid,
        this.defaultPageSize,
        0
      ).then((res) => {
        this.tableData = res.results;
        this.totalItems = res.count;
        console.log(this.websock.readyState);
        this.websock.close();
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      getApiTasksInfo(
        this.$route.query.api_testplan_uid,
        this.defaultPageSize,
        (val - 1) * this.defaultPageSize
      ).then((res) => {
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
        getApiJobsInfo(row.id)
          .then((res) => {
            console.log(res);
            this.job_list = res.results;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // 说明收起了
        that.expands = [];
        this.activeNames = [];
        this.job_list = [];
      }
    },
    getRequestBody(api_info) {
      console.log(api_info);
      if (JSON.stringify(api_info.formData) != "{}") {
        return api_info.formData;
      } else if (JSON.stringify(api_info.urlencoded) != "{}") {
        return api.urlencoded;
      } else if (JSON.stringify(api_info.raw) != "{}") {
        return api_info.raw;
      } else {
        return {};
      }
    },
    checkJson(str) {
      if (typeof str == "string") {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == "object" && obj) {
            return obj;
          } else {
            return str;
          }
        } catch (e) {
          console.log("error：" + str + "!!!" + e);
          return str;
        }
      }
      console.log("It is not a string!");
    },
    handleChange(value) {
      // pass
      console.log(value);
    },
    package_ws_task_data() {
      return JSON.stringify({
        mode_type: "api",
        task_or_job: "task",
        value: {
          api_test_plan_uid: this.$route.query.api_testplan_uid,
          limit: this.currentPage * this.defaultPageSize,
          offset: (this.currentPage - 1) * this.defaultPageSize,
        },
      });
    },
  },
};
</script>
