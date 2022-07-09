<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="search" style="margin-top: 20px">
      <!--:inline="true为横着的-->
      <el-form-item prop="stunum">
        <el-input v-model="search.stunum" placeholder="学号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="search.name" placeholder="学生姓名" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="teacher">
        <el-input v-model="search.teacher" placeholder="授课教师" style="width: 200px" readonly
                  @click.native="dialogTeacherVisible=true"></el-input>
      </el-form-item>
      <el-form-item prop="class">
        <el-input v-model="search.class" placeholder="所在班级" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
        <!--<el-button @click="$refs['searchForm'].resetFields()&&this.fetchData()">重置</el-button>-->
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="stunum" label="学号" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="admissiondate" label="入学时间"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="teacher" label="授课教师"></el-table-column>
      <el-table-column prop="class" label="所在班级"></el-table-column>
      <el-table-column prop="job" label="工作单位"></el-table-column>
      <el-table-column prop="money" label="薪资待遇"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog title="选择教师" :visible.sync="dialogTeacherVisible" width="550px">
      <!--使用子组件，大写变小写-->
      <teacher :isDialog="true" @option-teacher="optionTeacher"></teacher>
      <!--不能直接操作原生组件，需要加上native-->
    </el-dialog>

    <el-dialog title="学生编辑" :visible.sync="dialogFormVisible" width="500px" top="40px" left="300px">
      <el-form :model="studentForm" ref="studentForm" label-position="right" label-width="100px" :rules="rules"
               style="width: 400px">
        <el-form-item label="学号" prop="stunum">
          <el-input v-model="studentForm.stunum"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="studentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="入学时间" prop="admissiondate">
          <el-date-picker v-model="studentForm.admissiondate" type="date" placeholder="请点击选择" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="studentForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input readonly @click.native="editOptionTeacher" v-model="studentForm.teacher" placeholder="选择授课教师"
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="所在班级" prop="class">
          <el-input v-model="studentForm.class"/>
        </el-form-item>
        <el-form-item label="工作单位" prop="job">
          <el-input v-model="studentForm.job"/>
        </el-form-item>
        <el-form-item label="薪资待遇" prop="money">
          <el-input v-model="studentForm.money"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="studentForm._id === null?addData('studentForm'):updataData('studentForm')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import studentApi from "@/api/student.js";
import Teacher from "@/views/teacher";

export default {
  name: "index",
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      timeout: null,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      dialogTeacherVisible: false,
      dialogFormVisible: false,
      search: {
        stunum: "",
        name: "",
        teacher: "",
        class: "",
      },
      studentForm: {
        _id: null,
        stunum: "",
        name: "",
        admissiondate: "",
        phone: "",
        teacher: "",
        teacherId: "",
        class: "",
        job: "",
        money: "",
      },
      rules: {
        stunum: [
          {required: true, message: "学号不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "姓名不能为空", trigger: "blur"},
        ],
        phone: [
          {required: true, message: "电话不能为空", trigger: "blur"},
        ],
      },
      isEdit: false,
    }
  },
  components: {
    Teacher
  },
  methods: {
    fetchData() {
      studentApi.search(this.currentPage, this.pageSize, this.search).then((response) => {
        // 传参顺序一定不能混，因为对应发送的请求，数据顺序乱的话对应不上
        const resp = response.data // resp是成功获取，resp.data是Object对象
        console.log(resp)
        this.total = resp.data.total;
        this.list = resp.data.rows;
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleEdit(id) {
      this.handleAdd(); // 打开编辑页面并清空数据
      studentApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.studentForm = resp.data; // 根据id找到数据并数据回显
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        studentApi.deleteById(id).then((response) => {
          const resp = response.data;
          this.$message({
            type: resp.flag ? "success" : "error",
            message: resp.message,
          });
          if (resp.flag) {
            this.fetchData();
          }
        });
      }).catch(() => {
      });
    },
    // 查询
    searchData() {
      this.currentPage = 1;
      this.fetchData()
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchData()
    },
    // 新增
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()异步事件，渲染结束之后 ，它的回调函数才会被执行.等弹窗加载完毕在清除数据
        this.$refs['studentForm'].resetFields()
      })
    },
    editOptionTeacher() {
      // 点击前需要打开新增对话框handleAdd，也就是dialogFormVisible为true，再调用父组件dialogTeacherVisible = true
      this.isEdit = true;
      this.dialogTeacherVisible = true;
      // 点击选择教师调用editOptionTeacher就会打开teacher组件，点击teacher组件就会调用optionTeacher
    },
    optionTeacher(currentRow) {
      // 复用父组件
      // 从teacher组件传过来的数据
      // this.search.teacher = currentRow.name;
      // this.dialogTeacherVisible = false;
      if (this.isEdit) {
        this.studentForm.teacher = currentRow.name;
        // 查询教师获取到的教师数据直接显示在对话框中
      } else {
        // console.log(currentRow) // currentRow为表中输入的数据
        this.search.teacher = currentRow.name;
        // 查询教师获取到的教师数据直接显示在搜索框中
      }
      this.isEdit = false;
      this.dialogTeacherVisible = false; //关闭窗口
    },
    // 提交新增数据
    // addData(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       studentApi.add(this.studentForm).then((response) => {
    //         const resp = response.data;
    //         if (resp.flag) {
    //           this.fetchData();
    //           this.dialogFormVisible = false;
    //         } else {
    //           this.$message({
    //             message: resp.message,
    //             type: "warning",
    //           });
    //         }
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 提交新增数据
    addData(formName) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            studentApi.add(this.studentForm).then((response) => {
              const resp = response.data;
              if (resp.flag) {
                this.fetchData();
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  message: resp.message,
                  type: "warning",
                });
              }
            });
          } else {
            return false;
          }
        });
      }, 500);
    },
    updataData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          studentApi.update(this.studentForm).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.studentForm = {
                // 添加数据之后设置数据为空，防止未刷新添加数据为编辑
                _id: null,
                stunum: "",
                name: "",
                admissiondate: "",
                phone: "",
                teacher: "",
                teacherId: "",
                class: "",
                job: "",
                money: "",
              },
                  this.$message({
                    message: resp.message,
                    type: "success",
                  });
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>