import request from "@/utils/requset";
// import requset from "@/utils/requset";

export default {
    // 查询
    search(page, size, searchMap) {
        return request({
            url: '/students/list',
            // students前边最好加上/，不加根目录本身就有一个/
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    // 新增
    add(studentForm) {
        return request({
            url: '/students',
            method: 'post',
            data: studentForm
        })
    },
    // 根据id查询学员
    getById(id) {
        return request({
            url: `/students?id=${id}`,
            method: 'get'
        })
    },
    // 修改学员信息
    update(studentForm) {
        return request({
            url: '/students',
            method: 'put',
            data: studentForm
        })
    },
    // 删除学员
    deleteById(id) {
        return request({
            url: '/students',
            method: 'delete',
            data: {
                id
            }
        })
    }
}