<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="login-form">
      <h2>登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/register">注册</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {login, getUserInfo} from '@/api/user.js'

export default {
  name: "index",
  data() {
    return {
      form: {
        usernane: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      }
    }
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('Login', this.form).then(response => {
            if (response.flag) {
              this.$router.push('/')
            }
          })
        }
        // if (valid) {
        //   let resp = await login(this.form.username, this.form.password)
        //   resp = resp.data;
        //   console.log('data', resp);
        //   if (resp.flag) {
        //     getUserInfo(resp.data.token).then((response) => {
        //       const respUser = response.data; // 获取成功
        //       console.log(respUser.data) // 其中的数据
        //       if (respUser.flag) {
        //         localStorage.setItem("mc-sms-user", JSON.stringify(respUser.data))
        //         localStorage.setItem("mc-sms-token", resp.data.token);
        //         console.log('token', resp.data.token)
        //         // token就是一个标识令牌
        //         this.$router.push("/");
        //       } else {
        //         this.$message({
        //           message: respUser.message,
        //           type: "warning",
        //         });
        //       }
        //     });
        //   } else {
        //     this.$message({
        //       message: resp.message,
        //       type: "warning",
        //     });
        //   }
        // } else {
        //   console.log("error Submit!");
        //   return false;
        // }
      });
    },
  },
}
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}

.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/bg.jpg");
  overflow: hidden;
}

/* 标题 */
h2 {
  text-align: center;
  color: #303133;
}
</style>