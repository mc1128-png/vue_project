<template>
  <div class="main">
    <!--一级路由会渲染到一级路由接口，二级路由会寻找下一级的路由接口-->
    <app-link v-show="$route.path!=='/home'"></app-link>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import AppLink from './Link'
export default {
  name: "index",
  data() {
    return {}
  },
  components: {
    AppLink
  },
  methods: {}
}
</script>

<style scoped>

</style>