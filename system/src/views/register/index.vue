<template>
  <div class="register-container">
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="register-form">
      <h2>注册</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="/login">已有账号，点击登录</a>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {register} from '@/api/user.js'
// 按需引入，因为导出的并不是default

export default {
  name: "index",
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: '',
        nickname: '',
        password: '',
        checkPass: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'change'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'change'}
        ],
        password: [
          {validator: validatePass1, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      },
    };
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          register(this.form.username, this.form.nickname, this.form.password).then((response) => {
            const resp = response.data
            if (resp.flag) {
              this.$router.push('/login')
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.register-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../../assets/bg.jpg");
  background-size: cover
}

.register-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}

h2 {
  text-align: center;
  color: #303133;
}
</style>