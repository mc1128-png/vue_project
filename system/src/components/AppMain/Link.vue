<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="line">{{ $route.meta.title }}</el-breadcrumb-item>
      <!--<el-breadcrumb-item :to="{path: $route.path}" class="line">{{ $route.meta.title }}</el-breadcrumb-item>-->
    </el-breadcrumb>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Link",
  data() {
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style scoped>
.el-breadcrumb {
  height: 10px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.line {
  border-left: 3px solid #31c17b;
  padding-left: 10px;
}
</style>