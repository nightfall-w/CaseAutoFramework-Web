<template>
  <div>
    <el-row style="margin-top: 30px" type="flex" justify="center"> </el-row>
    <detail :fatherTestplanInfo="testplanInfo" :fatherValue="value"></detail>
  </div>
</template>

<script>
import Detail from "content/testplan/detail_interface";
export default {
  data() {
    return {
      testplanInfo: {
        name: "",
        description: ""
      },
      value: []
    };
  },
  components: {
    Detail
  }
};
</script>
