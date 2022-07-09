<template>
  <div>
    <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top: 20px">
      <el-form-item prop="jobnumber" v-if="!isDialog">
        <el-input v-model="searchMap.jobnumber" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="教师姓名"></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select v-model="searchMap.role" placeholder="教师职务" v-if="!isDialog">
          <el-option v-for="option in roleOptions" :label="option.name" :key="option.type"
                     :value="option.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="entrydate">
        <el-date-picker v-model="searchMap.entrydate" type="date" placeholder="入职日期" v-if="!isDialog"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleAdd" style="padding:12px 12px" v-if="!isDialog">新增
        </el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="380" border style="width: 100%" :highlight-current-row="isDialog"
              @cell-click="clickCurrentChange">
      <!--cell-click点击选中当前行返回给函数-->
      <!--index索引，从1开始；label标题; prop 数据字段名-->
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="jobnumber" label="工号"></el-table-column>
      <el-table-column prop="name" label="教师姓名"></el-table-column>
      <el-table-column prop="role" label="教师职务" v-if="!isDialog">
        <template slot-scope="scope">
          {{ scope.row.role|roleFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="entrydate" label="入职时间" v-if="!isDialog"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column label="操作" width="150" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <!--scope.row为当前一条数据-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper': 'prev, pager, next'"
        :total="total">
    </el-pagination>
    <el-dialog title="教师编辑" :visible.sync="dialogFormVisible" width="500px" v-if="!isDialog">
      <el-form :model="teacherForm" ref="teacherForm" label-position="right" label-width="100px" :rules="rules"
               style="width: 400px">
        <el-form-item label="工号" prop="jobnumber">
          <el-input v-model="teacherForm.jobnumber"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="teacherForm.name"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="role">
          <el-select v-model="teacherForm.role" class="filter-item" placeholder="请点击选择">
            <el-option v-for="option in roleOptions" :key="option.type" :label="option.name"
                       :value="option.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="entrydate">
          <el-date-picker v-model="teacherForm.entrydate" type="date" placeholder="请点击选择" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="teacherForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="teacherForm._id === null?addData('teacherForm'):updataData('teacherForm')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import teacherApi from '@/api/teacher.js'
// import {add} from '@/api/teacher.js'

const roleOptions = [
  {type: "1", name: "教师"},
  {type: "2", name: "班主任"}
]
export default {
  name: "index",
  props: {
    // 接收父组件传递过来的数据,通过isDialog来判断是否为弹框
    // 如果为true, 则是弹框, false 就是列表
    isDialog: Boolean
  },
  data() {
    return {
      timeout: null,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        jobnumber: '',
        name: '',
        role: '',
        entrydate: ''
      }, // 条件查询绑定条件值
      roleOptions,
      dialogFormVisible: false,
      teacherForm: {
        _id: null,
        jobnumber: "",
        name: "",
        role: "",
        entrydate: "",
        phone: "",
      },
      rules: {
        jobnumber: [
          {required: true, message: "请输入工号", trigger: "blur"},
        ],
        name: [
          {required: true, message: "请输入姓名", trigger: "blur"}
        ],
        role: [
          {required: true, message: "请选择职务", trigger: "blur"}
        ],
      },
    }
  },
  filters: {
    roleFilter(type) {
      // type 为调用者的数据
      const obj = roleOptions.find(item => item.type === type)
      return obj ? obj.name : null
    }
  },
  components: {},
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // let resp = await teacherApi.getList()
      // resp = resp.data
      // console.log(resp)
      // if (resp.flag) {
      //   this.list = resp.data.rows
      // }
      let resp = await teacherApi.search(this.currentPage, this.pageSize, this.searchMap)
      // 传参顺序一定不能混，因为对应发送的请求，数据顺序乱的话对应不上
      resp = resp.data // resp是成功获取，resp.data是Object对象
      // console.log(resp)
      if (resp.flag) {
        this.total = resp.data.total
        this.list = resp.data.rows
      }
    },
    handleEdit(id) {
      this.handleAdd() // 打开编辑窗口，也就是新增窗口
      teacherApi.getById(id).then(response => {
        const resp = response.data
        // console.log(resp)
        if (resp.flag) {
          this.teacherForm = resp.data
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.deleteById(id).then(response => {
          const resp = response.data
          this.$message({
            type: resp.flag ? "success" : "error",
            message: resp.message
          });
          if (resp.flag) {
            this.fetchData()
          }
        })
      }).catch(() => {
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
      this.fetchData()
    },
    searchData() {
      //将页码设置回1，防止后台只查询到1条数据，但是却返回其他页码，从而数据返回空
      this.currentPage = 1;
      this.fetchData()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.fetchData()
    },
    // 打开新增窗口
    handleAdd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()异步事件，渲染结束之后 ，它的回调函数才会被执行.等弹窗加载完毕在清除数据
        this.$refs['teacherForm'].resetFields()
      })
    },
    // 提交新增数据
    addData(formName) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            // console.log(this.teacherForm) // 为teacherForm表中填入的数据
            let resp = await teacherApi.add(this.teacherForm)
            resp = resp.data
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.teacherForm = {
                // 添加数据之后设置数据为空，防止未刷新添加数据为编辑
                _id: null,
                jobnumber: "",
                name: "",
                role: "",
                entrydate: "",
                phone: "",
              }
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          } else {
            return false;
          }
        })
      }, 500)
    },
    // 编辑教师
    updataData(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // console.log(this.teacherForm) // 为teacherForm表中填入的数据
          let resp = await teacherApi.upData(this.teacherForm)
          resp = resp.data
          if (resp.flag) {
            this.fetchData();
            this.dialogFormVisible = false;
          } else {
            this.$message({
              message: resp.message,
              type: "warning",
            });
          }
        } else {
          return false;
        }
      })
    },
    clickCurrentChange(currentRow) {
      // console.log(currentRow) // currentRow为表中输入的数据
      // 因为cell-click的作用是点击选中当前行返回给函数
      // 将点击获取的数据传给组件students
      this.$emit('option-teacher', currentRow)
    }
  }
}
</script>

<style scoped>

</style>