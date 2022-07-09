import request from "@/utils/requset";

export default {
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },
    updataPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    },
}