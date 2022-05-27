const express = require('express')
const User = require('./curd.js')
var md5 = require('blueimp-md5');
const router = express.Router()
const Teacher = require('./teacher.js')
const Student = require('./student')
// 注册
router.post('/user/register', (req, res) => {
    let body = req.body
    User.find({
        $or: [
            {
                username: body.username
            },
            {
                nickname: body.nickname
            }
        ]
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (data.length !== 0) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '昵称或者用户已经存在'
            })
        }
        body.token = md5(md5(body.username) + 'b0352')
        new User(body).save(err => {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server err,存储失败'
                })
            }
            console.log('ok')
            return res.json({
                // 加引号返回的是json类型，不加则是返回对象类型
                "code": 2000,
                "flag": true,
                "message": "注册成功"
            })
        })
    })
})
// 登录
router.post('/user/login', (req, res) => {
    const body = req.body
    User.findOne({
        username: body.username,
        password: body.password
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "账号或密码不存在"
            })
        }
        // req.session.user = data;
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "验证成功",
            "data": {
                "token": data.token
            }
        })
    })
})
// 获取用户信息
router.get("/user/info", function (req, res) {
    // var body = req.query;
    User.findOne({
        token: req.query.token
    }, (err, data) => {
        console.log(data);
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "token不存在"
            })
        }
        // req.session.user = data;
        return res.json({
            "code": 2000,
            "flag": true,
            "message": "成功获取用户信息",
            "data": {
                "name": data.nickname,
                "id": data._id // 因为数据库里面存储的是_id
            }
        })
    })
});
//退出登录
router.post("/user/logout", function (req, res) {
    // var body = req.body;
    User.findOne({
        token: req.body.token
    }, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server error"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "token不存在"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "退出成功"
        })
    })
});
// 获取所有教师
router.get('/teacher/list', (req, res) => {
    Teacher.find({}, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                messaage: 'server error getTeacherList'
            })
        }
        let count = data.length
        return res.status(200).json({
            code: 2000,
            flag: true,
            meseage: '查询教师成功',
            data: {
                total: count,
                rows: data
            }
        })
    })
})
// 查询教师
router.post('/teacher/list', (req, res) => {
    let page = req.body.page || 1
    let size = req.body.size || 10
    let searchMap = req.body.searchMap || {}
    // 因为searchMap是双向绑定输入框中的值，当输入框为空时，就默认添加所有属性来查询数据，如果有哪个属性就用那个属性来查询数据，也就是searchData
    let obj = {}
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj
    searchMap.name ? obj["name"] = searchMap.name : obj
    searchMap.role ? obj["role"] = searchMap.role : obj
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj
    Teacher.find(obj, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                messaage: 'server error getTeacherList'
            })
        }
        let count = data.length
        Teacher.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, teachers) => {
            if (err) {
                return res.status(200).json({
                    code: 3000,
                    flag: false,
                    messaage: 'server error getTeacherListPage'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                meseage: '查询教师成功',
                data: {
                    total: count,
                    rows: teachers
                }
            })
        })
    })
})
// 新增教师
router.post('/teacher', (req, res) => {
    /*{
        teacherForm:{
            jobnumber:111
        }
    }*/
    // console.log(req.body)
    new Teacher(req.body).save(err => {
        // console.log(req.body)
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err addTeacher"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "新增成功"
        })
    })
})
//根据id查询要修改的教师
router.get('/teacher', (req, res) => {
    Teacher.findById(req.query.id, (err, data) => {
        // console.log(req.query.id) // id为前台页面的id，为发送请求接收的数据，teacher里面的接受类型
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err getErr"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "查询教师成功succeed",
            "data": data
        })
    })
})
//根据id修改的教师
router.put('/teacher', (req, res) => {
    var id = req.body._id; // _id为数据库中的id，提交到数据库中来修改数据库中的数据
    // console.log(id)
    Teacher.findByIdAndUpdate(id, req.body, function (err) {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "修改教师信息失败"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "修改教师信息成功"
        })
    })
});
//删除教师
router.delete('/teacher', (req, res) => {
    Teacher.findByIdAndRemove(req.body.id, (err) => {
        // id，因为接口请求发送的是id
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err delete"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "删除教师成功"
        })
    })
});
//获取学生列表
router.post("/students/list", (req, res) => {
    // console.log(req.body);
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let searchMap = req.body.searchMap || {};
    // 因为searchMap是双向绑定输入框中的值，当输入框为空时，就默认添加所有属性来查询数据，如果有哪个属性就用那个属性来查询数据，也就是searchData
    let obj = {};
    searchMap.stunum ? obj["stunum"] = searchMap.stunum : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.admissiondate ? obj["admissiondate"] = searchMap.admissiondate : obj;
    searchMap.teacher ? obj["teacher"] = searchMap.teacher : obj;
    searchMap.class ? obj["class"] = searchMap.class : obj;
    Student.find(obj, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "查询失败"
            });
        }
        let count = data.length;
        Student.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec((err, students) => {
            if (err) {
                return res.status(200).json({
                    code: 3000,
                    flag: false,
                    message: 'server err studentList'
                });
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: "查询学生成功",
                data: {
                    total: count,
                    rows: students
                }
            })
        })
    })
});
// 新增学生
router.post('/students', (req, res) => {
    new Student(req.body).save(err => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: 'false',
                message: 'server err add'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '新增学生成功'
        })
    })
})
//根据id查询要修改的学员
router.get("/students", (req, res) => {
    Student.findById(req.query.id, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err add"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "根据id查询学员成功",
            "data": data
        })
    });
});
//根据id修改的学员
router.put('/students', (req, res) => {
    var id = req.body._id;
    Student.findByIdAndUpdate(id, req.body, (err) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err addList"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "修改学员信息成功"
        })
    })
});
//删除学员
router.delete('/students', (req, res) => {
    Student.findByIdAndRemove(req.body.id, (err) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server err delete"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "删除学员成功"
        })
    })
});
// 密码校验
router.post('/user/pwd', (req, res) => {
    User.findOne({
        _id: req.body.userId,
        password: req.body.password
    }, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server error pwd"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "密码不正确"
            })
        }
        return res.status(200).json({
            "code": 2000,
            "flag": true,
            "message": "密码正确"
        })
    })
})
// 密码修改
router.put('/user/pwd', (req, res) => {
    let id = req.body.userId
    User.findOne({
        _id: id
    }, (err, data) => {
        if (err) {
            return res.status(200).json({
                code: 3000,
                flag: false,
                message: "server error updataPwd"
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: "密码不正确"
            })
        }
        data.password = req.body.password;
        User.findByIdAndUpdate(id, data, (err) => {
            if (err) {
                return res.status(200).json({
                    code: 3000,
                    flag: false,
                    message: "修改密码失败"
                })
            }
            return res.status(200).json({
                "code": 2000,
                "flag": true,
                "message": "修改密码成功"
            })
        })
    })
})
module.exports = router