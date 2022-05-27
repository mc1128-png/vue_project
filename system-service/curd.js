var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/VueSystem');
const Schema = mongoose.Schema // 引入骨架
const userSchema = new Schema({
    // 创建骨架
    username: {
        type: String,
        require: true
    },
    nickname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        // token就是一个标识令牌
        type: String,
        require: true
    },
})
module.exports = mongoose.model('User', userSchema) // 创建模型
// 使用模型