<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 16:00:11
 * @LastEditors: 
 * @LastEditTime: 2020-01-10 09:49:30
 -->
<template>
  <div
    style="
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    "
  >
    <el-container>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>case信息</h3>
          <!-- <el-button style="float: right; padding: 3px 0" type="text"
            >操作按钮</el-button
          > -->
        </div>
        <div v-for="(value, key) in caseBaseInfo" :key="key" class="text item">
          <el-tag>{{ key }}:</el-tag>
          <el-tag style="margin-left: 2%" :type="'info'">{{ value }}</el-tag>
        </div>
      </el-card>
      <el-main>
        <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
          <el-form-item label="活动名称">
            <el-input v-model="sizeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="sizeForm.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                v-model="sizeForm.date2"
                style="width: 100%"
              ></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="sizeForm.type">
              <el-checkbox-button
                label="美食/餐厅线上活动"
                name="type"
              ></el-checkbox-button>
              <el-checkbox-button
                label="地推活动"
                name="type"
              ></el-checkbox-button>
              <el-checkbox-button
                label="线下主题活动"
                name="type"
              ></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="sizeForm.resource" size="medium">
              <el-radio border label="线上品牌商赞助"></el-radio>
              <el-radio border label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <el-divider
      ><i class="el-icon-star-on">选择case并添加到执行列表</i></el-divider
    >
    <el-container>
      <div class="block" style="margin-left: 5%; width: 40%; float: left">
        <h2>case目录</h2>
        <el-input
          style="width: 200px"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        >
        </el-input>
        <br />
        <el-tree
          class="filter-tree"
          :show-checkbox="true"
          :data="case_tree"
          :props="defaultProps"
          :default-expand-all="false"
          node-key="id"
          :filter-node-method="filterNode"
          ref="tree"
        >
        </el-tree>
        <br />
        <el-button @click="add_case2_list" type="primary"
          >添加选中到右侧case池</el-button
        >
        <el-button @click="cancel_checked_nodes" type="primary"
          >取消全部选中</el-button
        >
      </div>
      <div>
        <el-table :data="cases" border style="width: 100%" :rowKey="getrowKey">
          <el-table-column width="60px" label="序号" type="index">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in col"
            :key="`col_${index}`"
            :prop="dropCol[index].prop"
            :label="item.label"
            width="500px"
          >
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="70">
            <template slot-scope="scope">
              <el-button
                @click="delete_case_item(scope.$index)"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button></template
          ></el-table-column>
        </el-table>
      </div>
    </el-container>
  </div>
</template>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>

<script>
import Sortable from "sortablejs";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  data() {
    return {
      col: [
        {
          label: "case路径",
          prop: "case_path",
        },
      ],
      dropCol: [
        {
          label: "case路径",
          prop: "case_path",
        },
      ],
      cases: [
        {
          case_path:
            "Aquamarine5555557777777777777777777777555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555",
        },
        {
          case_path: "Hotpink",
        },
        {
          case_path: "Gold",
        },
        {
          case_path: "Crimson",
        },
        {
          case_path: "Blueviolet",
        },
        {
          case_path: "Lightblue",
        },
        {
          case_path: "Cornflowerblue",
        },
        {
          case_path: "Skyblue",
        },
        {
          case_path: "Burlywood",
        },
      ],
      caseBaseInfo: {
        gitlab服务器: "",
        项目名: "",
        分支名: "",
      },
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      checked: [],
      filterText: "",
      case_tree: [
        {
          id: 1,
          label: "g2p-planer",
          children: [
            {
              id: 3,
              label: "cmdline_args.py",
              filepath:
                "http-git-flashhold-com-10080/master/g2p-planer/cmdline_args.py",
            },
            {
              id: 4,
              label: "layout",
              children: [
                {
                  id: 5,
                  label: "g2p_generate_map.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/g2p_generate_map.py",
                },
                {
                  id: 6,
                  label: "g2p_layout.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/g2p_layout.py",
                },
                {
                  id: 7,
                  label: "g2p_plot_layout.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/g2p_plot_layout.py",
                },
                {
                  id: 8,
                  label: "general_planer.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/general_planer.py",
                },
                {
                  id: 9,
                  label: "hds_soqn_model.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/hds_soqn_model.py",
                },
                {
                  id: 10,
                  label: "main.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/main.py",
                },
                {
                  id: 11,
                  label: "planer_base.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/planer_base.py",
                },
                {
                  id: 12,
                  label: "regular_planer.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/regular_planer.py",
                },
                {
                  id: 13,
                  label: "std_soqn_model.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/layout/std_soqn_model.py",
                },
              ],
            },
            {
              id: 14,
              label: "logutil.py",
              filepath:
                "http-git-flashhold-com-10080/master/g2p-planer/logutil.py",
            },
            {
              id: 15,
              label: "main.py",
              filepath:
                "http-git-flashhold-com-10080/master/g2p-planer/main.py",
            },
            {
              id: 18,
              label: "simulation",
              children: [
                {
                  id: 20,
                  label: "db_pool.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/db_pool.py",
                },
                {
                  id: 21,
                  label: "environ_version_config.json",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/environ_version_config.json",
                },
                {
                  id: 22,
                  label: "framework_report.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/framework_report.py",
                },
                {
                  id: 23,
                  label: "framework_warehouse.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/framework_warehouse.py",
                },
                {
                  id: 24,
                  label: "g2p_simulation.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/g2p_simulation.py",
                },
                {
                  id: 25,
                  label: "g2p_simulation_new.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/g2p_simulation_new.py",
                },
                {
                  id: 26,
                  label: "inventory_data.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/inventory_data.py",
                },
                {
                  id: 27,
                  label: "main.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/main.py",
                },
                {
                  id: 28,
                  label: "simu_environment.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/simu_environment.py",
                },
                {
                  id: 29,
                  label: "ssh_server.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/ssh_server.py",
                },
                {
                  id: 30,
                  label: "util.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/util.py",
                },
                {
                  id: 31,
                  label: "warehouse_config.json",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/warehouse_config.json",
                },
                {
                  id: 32,
                  label: "warehouse_data.py",
                  filepath:
                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/warehouse_data.py",
                },
                {
                  id: 33,
                  label: "wcs_autocase",
                  children: [
                    {
                      id: 35,
                      label: "interface_for_simulation",
                      children: [
                        {
                          id: 37,
                          label: "count_check.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/interface_for_simulation/count_check.py",
                        },
                        {
                          id: 38,
                          label: "direct_put_away.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/interface_for_simulation/direct_put_away.py",
                        },
                        {
                          id: 39,
                          label: "entrance.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/interface_for_simulation/entrance.py",
                        },
                        {
                          id: 40,
                          label: "guided_put_away.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/interface_for_simulation/guided_put_away.py",
                        },
                        {
                          id: 41,
                          label: "picking.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/interface_for_simulation/picking.py",
                        },
                      ],
                    },
                    {
                      id: 43,
                      label: "wcs_tool",
                      children: [
                        {
                          id: 44,
                          label: "automation",
                          children: [
                            {
                              id: 45,
                              label: "customizeDate.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/automation/customizeDate.py",
                            },
                            {
                              id: 46,
                              label: "Logging.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/automation/Logging.py",
                            },
                            {
                              id: 47,
                              label: "messge.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/automation/messge.py",
                            },
                            {
                              id: 48,
                              label: "randomlib.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/automation/randomlib.py",
                            },
                            {
                              id: 49,
                              label: "__init__.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/automation/__init__.py",
                            },
                          ],
                        },
                        {
                          id: 50,
                          label: "business_component",
                          children: [
                            {
                              id: 51,
                              label: "common",
                              children: [
                                {
                                  id: 52,
                                  label: "basic_data.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/common/basic_data.py",
                                },
                                {
                                  id: 53,
                                  label: "basic_station.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/common/basic_station.py",
                                },
                                {
                                  id: 54,
                                  label: "__init__.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/common/__init__.py",
                                },
                              ],
                            },
                            {
                              id: 55,
                              label: "document_type.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/document_type.py",
                            },
                            {
                              id: 56,
                              label: "order",
                              children: [
                                {
                                  id: 57,
                                  label: "delete_data.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/order/delete_data.py",
                                },
                                {
                                  id: 58,
                                  label: "order_creater.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/order/order_creater.py",
                                },
                                {
                                  id: 59,
                                  label: "strategy.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/order/strategy.py",
                                },
                                {
                                  id: 60,
                                  label: "template.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/order/template.py",
                                },
                                {
                                  id: 61,
                                  label: "__init__.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/order/__init__.py",
                                },
                              ],
                            },
                            {
                              id: 62,
                              label: "station_agant",
                              children: [
                                {
                                  id: 63,
                                  label: "api.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/api.py",
                                },
                                {
                                  id: 64,
                                  label: "direct_put_away.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/direct_put_away.py",
                                },
                                {
                                  id: 65,
                                  label: "guided_put_away.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/guided_put_away.py",
                                },
                                {
                                  id: 66,
                                  label: "inventory.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/inventory.py",
                                },
                                {
                                  id: 67,
                                  label: "picking.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/picking.py",
                                },
                                {
                                  id: 69,
                                  label: "station.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/station.py",
                                },
                                {
                                  id: 70,
                                  label: "__init__.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_agant/__init__.py",
                                },
                              ],
                            },
                            {
                              id: 71,
                              label: "station_service",
                              children: [
                                {
                                  id: 72,
                                  label: "db_data_select.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/db_data_select.py",
                                },
                                {
                                  id: 73,
                                  label: "db_pool.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/db_pool.py",
                                },
                                {
                                  id: 74,
                                  label: "flask_task.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/flask_task.py",
                                },
                                {
                                  id: 75,
                                  label: "Logging.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/Logging.py",
                                },
                                {
                                  id: 77,
                                  label: "station.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/station.py",
                                },
                                {
                                  id: 78,
                                  label: "stationService.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/stationService.py",
                                },
                                {
                                  id: 79,
                                  label: "station_celery.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/station_celery.py",
                                },
                                {
                                  id: 80,
                                  label: "web",
                                },
                                {
                                  id: 82,
                                  label: "__init__.py",
                                  filepath:
                                    "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/station_service/__init__.py",
                                },
                              ],
                            },
                            {
                              id: 83,
                              label: "__init__.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/business_component/__init__.py",
                            },
                          ],
                        },
                        {
                          id: 84,
                          label: "db_tool",
                          children: [
                            {
                              id: 85,
                              label: "class_data_backup.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/class_data_backup.py",
                            },
                            {
                              id: 86,
                              label: "db_data_select.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/db_data_select.py",
                            },
                            {
                              id: 87,
                              label: "db_data_update.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/db_data_update.py",
                            },
                            {
                              id: 88,
                              label: "db_pool.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/db_pool.py",
                            },
                            {
                              id: 89,
                              label: "demo.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/demo.py",
                            },
                            {
                              id: 90,
                              label: "generate_db_class.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/generate_db_class.py",
                            },
                            {
                              id: 91,
                              label: "mq_pool.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/mq_pool.py",
                            },
                            {
                              id: 92,
                              label: "mq_utils.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/mq_utils.py",
                            },
                            {
                              id: 93,
                              label: "rabbitMQ_demo.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/rabbitMQ_demo.py",
                            },
                            {
                              id: 94,
                              label: "__init__.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/db_tool/__init__.py",
                            },
                          ],
                        },
                        {
                          id: 95,
                          label: "init_service",
                          children: [
                            {
                              id: 96,
                              label: "class_init_service.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/init_service/class_init_service.py",
                            },
                            {
                              id: 97,
                              label: "data",
                              children: [
                                {
                                  id: 98,
                                  label: "auto_test",
                                },
                              ],
                            },
                            {
                              id: 101,
                              label: "run_init_service.py",
                              filepath:
                                "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/init_service/run_init_service.py",
                            },
                          ],
                        },
                        {
                          id: 104,
                          label: "__init__.py",
                          filepath:
                            "http-git-flashhold-com-10080/master/g2p-planer/simulation/wcs_autocase/wcs_tool/__init__.py",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getrowKey(row) {
      return row.case_path;
    },
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.cases.splice(oldIndex, 1)[0];
          console.log(_this.cases);
          console.log(currRow);
          _this.cases.splice(newIndex, 0, currRow);
          console.log(_this.cases);
          _this.$set(this, "cases", _this.cases);
          console.log(this.cases);
        },
      });
    },
    delete_case_item(index) {
      console.log(index);
      this.cases.splice(index, 1);
      console.log(this.cases);
    },
    cancel_checked_nodes() {
      this.$refs.tree.setCheckedNodes([]);
    },
    add_case2_list() {
      let CheckedNodes = this.$refs.tree.getCheckedNodes();
      for (let i in CheckedNodes) {
        if (!CheckedNodes[i].filepath) {
          continue;
        } else {
          for (let j = 0; j < this.cases.length; j++) {
            console.log(2);
            console.log(CheckedNodes[i].filepath != this.cases[j].case_path);
            console.log(j + 1 == this.cases.length);
            if (CheckedNodes[i].filepath == this.cases[j].case_path) {
              break;
            } else {
              if (j + 1 == this.cases.length) {
                console.log(CheckedNodes[i].filepath);
                this.cases.splice(this.cases.length, 0, {
                  case_path: CheckedNodes[i].filepath,
                });
              }
            }
          }
        }
      }
    },
    onSubmit() {
      console.log(1111);
    },
  },
  mounted() {
    const gitlab_url = this.$route.query.gitlab_url;
    const gitlab_project = this.$route.query.gitlab_project;
    const gitlab_branch = this.$route.query.gitlab_branch;
    if (gitlab_url && gitlab_project && gitlab_branch) {
      this.caseBaseInfo.gitlab服务器 = gitlab_url;
      this.caseBaseInfo.gitlab_project = gitlab_project;
      this.caseBaseInfo.gitlab_branch = gitlab_branch;
    } else {
      this.$message({
        message: "未提供case相关信息 请先同步case",
        type: "warning",
      });
      this.$router.push({ path: "/case/create" });
    }
    this.rowDrop();
  },
};
</script>

else{ if (j+1==this.cases.length){ console.log(CheckedNodes[i].filepath);
this.cases.splice(this.cases.length, 0, { case_path: CheckedNodes[i].filepath }
} }
