import requset from "@/utils/requset"; // 对应search
import request from "@/utils/requset"; // 对应addData

export default {
    getList() {
        return requset({
            url: '/teacher/list',
            method: 'get'
        })
    },
    search(page, size, searchMap) {
        // console.log("search", request)
        return requset({
            url: '/teacher/list',
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    // 新增教师
    add(teacherForm) {
        // console.log("add", request)
        return request({
            url: '/teacher',
            method: 'post',
            data: teacherForm
        })
    },
    // 根据id获取教师
    getById(id) {
        return request({
            url: `/teacher?id=${id}`,
            method: 'get'
        })
    },
    upData(teacherForm) {
        return request({
            url: '/teacher',
            method: 'put',
            data: teacherForm
        })
    },
    deleteById(id) {
        return request({
            url: '/teacher',
            method: 'delete',
            data: {
                id // req.body.id所以是对象形式
            }
        })
    }
}

// // 新增教师
// export function add(teacherForm) {
//     return request({
//         url: '/teacher',
//         method: 'post',
//         data: teacherForm
//     })
// }