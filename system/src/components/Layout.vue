<template>
  <div>
    <!-- 头部区域 -->
    <app-header/>
    <!-- 左侧导航区域 -->
    <app-navbar/>
    <!-- 右侧主区域 -->
    <app-main/>
  </div>
</template>

<script type="text/ecmascript-6">
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'

export default {
  name: "Layout",
  data() {
    return {}
  },
  components: {
    AppHeader,
    AppNavbar,
    AppMain
  },
  methods: {}
}
</script>

<style scoped>
/* 头部区域 */
.header {
  position: absolute;
  line-height: 50px;
  padding: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}

/* 左侧导航栏 */
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #545c64;
}

/* 右侧主区域 */
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
  /*background-color: red;*/
}
</style>