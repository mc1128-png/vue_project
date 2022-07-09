<template>
  <div class="header">
    <!-- 头部左侧Logo和标题 -->
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px"/>
      <span class="company">学员管理系统</span>
    </a>
    <!-- 头部右侧下拉菜单 -->
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">{{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" style="width: 400px;" :rules="rules">
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import passwordApi from '@/api/password.js'
import store from '@/store'

export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data
        // console.log(value) //为密码输入框中的值
        // console.log(user) // { "name": "a", "id": "61f20860bc931a0da5b01ba4" }
        // user: JSON.parse(localStorage.getItem("mc-sms-user")),
        if (resp.flag) {
          callback()
        } else {
          callback(new Error(resp.message));
        }
      })
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // user: JSON.parse(localStorage.getItem("mc-sms-user")),
      user: store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          {required: true, message: '原密码不能为空', trigger: 'blur'},
          {validator: validateOldPass, trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '新密码不能为空', trigger: 'blur'},
        ],
        checkPass: [
          {required: true, message: '确认密码不能为空', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'a': {
          // 修改密码
          this.handlePwd()
          // console.log(this.user)
          // console.log(this.user.id)
          break
        }
        case 'b': {
          // 退出登录
          this.handleLogout()
          break
        }
        default:
          break;
      }
    },
    handlePwd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    handleLogout() {
      this.$store.dispatch('Logout').then(response=>{
        if(response.flag){
          this.$router.push('/login')
        }
      })
      // logout(localStorage.getItem("mc-sms-token")).then((response) => {
      //   const resp = response.data
      //   if (resp.flag) {
      //     localStorage.removeItem("mc-sms-user")
      //     localStorage.removeItem("mc-sms-token")
      //     this.$router.push('/login')
      //   }
      // })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi.updataPwd(this.user.id, this.ruleForm.pass).then(response => {
            const resp = response.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'warning'
            })
            if (resp.flag) {
              this.handleLogout()
              this.dialogFormVisible = false
            }
          })
        } else {
          return false;
        }
      })
    }
  }
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}

.company {
  position: absolute;
  color: white;
}

/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>