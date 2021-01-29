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
    style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
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
          <el-tag style="margin-left:2%" :type="'info'">{{ value }}</el-tag>
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
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker
                placeholder="选择时间"
                v-model="sizeForm.date2"
                style="width: 100%;"
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
      <div class="block" style="margin-left:5%; width:40%; float:left;">
        <h2>case目录</h2>
        <el-input
          style="width:200px"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        >
        </el-input>
        <br />
        <el-tree
          class="filter-tree"
          :show-checkbox="true"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree"
        >
        </el-tree>
        <br />
        <el-button type="primary">添加选中到右侧case池</el-button>
        <el-button type="primary">取消全部选中</el-button>
      </div>
      <div>
        <h2>case池</h2>
        <ul class="case-list">
          <li
            class="case-item"
            v-for="case_item in cases"
            v-dragging="{ item: case_item, list: cases, group: 'case' }"
            :key="case_item.text"
          >
            <div style="float:left">{{ case_item.text }}</div>
            <div style="float:right">
              <i @click="delete_case_item" class="el-icon-delete"></i>
            </div>
          </li>
        </ul>
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

.case-list {
  margin-top: 20%;
  border-style: solid;
  border-top-style: none;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  border-color: dimgray;
  border-width: 5px;
  padding: 20px;
  width: 100%;
  word-break: break-all;
  word-wrap: break-word;
}

.case-item {
  list-style-type: decimal;
  background-color: rgba(86, 171, 197, 0.952);
  margin-top: 10px;
  padding: 10px;
  border-radius: 30px;
}
</style>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },

  data() {
    return {
      cases: [
        {
          text: "Aquamarine5555557777777777777777777777555555"
        },
        {
          text: "Hotpink"
        },
        {
          text: "Gold"
        },
        {
          text: "Crimson"
        },
        {
          text: "Blueviolet"
        },
        {
          text: "Lightblue"
        },
        {
          text: "Cornflowerblue"
        },
        {
          text: "Skyblue"
        },
        {
          text: "Burlywood"
        }
      ],
      caseBaseInfo: {
        gitlab服务器: "2016-05-02",
        项目名: "王小虎",
        分支名: "上海市普陀区金沙江路 1518 弄"
      },
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      checked: [],
      filterText: "",
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    delete_case_item() {
      console.log(43434);
    }
  }
};
</script>
