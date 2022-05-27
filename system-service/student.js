var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/VueSystem');
const Schema = mongoose.Schema // 引入骨架
const userSchema = new Schema({
    //学号
    stunum: {
        type: String,
        required: true
    },

    // 姓名
    name: {
        type: String,
        required: true
    },

    //入学时间
    admissiondate: {
        type: String,
        required: true
    },
    //手机号码
    phone: {
        type: String,
        required: true
    },
    //授课教师
    teacher: {
        type: String,
        required: true
    },
    // 班级
    class: {
        type: String,
        required: true
    },
    //单位
    job: {
        type: String,
        // required: true
    },
    //薪资
    money: {
        type: String,
        // required: true
    }
});
module.exports = mongoose.model('Student', userSchema);