var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/VueSystem');
const Schema = mongoose.Schema // 引入骨架
const userSchema = new Schema({
    // 创建骨架
    jobnumber: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    },
    entrydate: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
})
module.exports = mongoose.model('Teacher', userSchema) // 创建模型
// 使用模型