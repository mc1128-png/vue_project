<template>
  <div class="navbar">
    <el-menu
        default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        class="el-menu-vertical-demo">
      <!--:router="true"开启路由-->
      <!--default-active默认选中-->
      <!--二级菜单-->
      <!--@open="handleOpen"-->
      <!--@close="handleClose"-->
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/teacher">
        <i class="el-icon-s-custom"></i>
        <span slot="title">教师管理</span>
      </el-menu-item>
      <el-menu-item index="/students">
        <i class="el-icon-user-solid"></i>
        <span slot="title">学生管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "index",
  data() {
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style scoped>
.el-menu-item {
  border-right: none;
}
</style>