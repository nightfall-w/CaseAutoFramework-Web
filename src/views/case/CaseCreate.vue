<!--
 * @Descripttion: 
 * @version: 
 * @Author: wangbaojun
 * @Date: 2020-01-02 15:57:26
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-09 16:54:05
 -->
<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-key"></i> 身份令牌认证</span>
        身份令牌认证
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-s-platform"></i> 选择归属项目</span
        >
        选择归属项目</el-tab-pane
      >
      <el-tab-pane>
        <span slot="label"><i class="el-icon-s-operation"></i> 选择分支</span>
        选择分支</el-tab-pane
      >
      <el-tab-pane label="拉取代码">
        <span slot="label"><i class="el-icon-download"></i> 拉取代码</span>
        拉取代码</el-tab-pane
      >
    </el-tabs>

    <el-steps
      :active="1"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="身份令牌认证"></el-step>
      <el-step title="选择归属项目"></el-step>
      <el-step title="选择分支"></el-step>
      <el-step title="拉取代码"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {};
</script>
