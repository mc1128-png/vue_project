import request from "@/utils/requset";
// 登录注册都在这里发请求

// 发送注册请求
export function register(username, nickname, password) {
    return request({
        url: '/user/register',
        method: 'post',
        data: {
            username, nickname, password
        }
    })
}

// 发送登录请求
export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username, password
        }
    })
}

//获取用户信息
export function getUserInfo(token) {
    return request({
        url: `/user/info?token=${token}`,
        method: 'get'
    })
}

// 退出登录
export function logout(token) {
    return request({
        url: '/user/logout',
        method: 'post',
        data: {
            token
        }
    })
}