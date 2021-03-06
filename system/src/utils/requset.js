import axios from 'axios'
import {Loading, Message} from 'element-ui'
// 加载数据时打开和关闭动效对象
const loading = {
    loadingInstance: null, // Loading实例
    open() { // 打开加载
        console.log('加载中', this.loadingInstance)
        if (this.loadingInstance === null) { // 创建单例, 防止切换路由重复加载
            console.log('创建加载实例..')
            this.loadingInstance = Loading.service({
                text: '拼命加载中',
                target: '.main', // 效果显示区域
                background: 'rgba(0, 0, 0, 0.5)' // 加载效果
            })
        }
    },
    close() { // 关闭加载
        if (this.loadingInstance !== null) {
            this.loadingInstance.close()
            console.log('结束加载')
        }
        this.loadingInstance = null // 关闭后实例重新赋值null, 下次让它重新创建
    }
}
// 手动创建一个 axios 对象
let request = axios.create({
    // 请求配置
    // 根据不同环境设置 baseURL, 最终发送请求时的URL为: baseURL + 发送请求时写URL ,
    // baseURL: '/dev-api',
    // 比如 get('/test'), 最终发送请求是: /dev-api/test

    // baseURL: '/dev-api',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 // 请求超时
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 请求拦截
    return config
    loading.open() // 打开加载效果
}, error => {
    // 出现异常,抛出错误对象
    loading.close() // 关闭加载效果
    return Promise.reject(error);
})
// 响应拦截器
request.interceptors.response.use(response => {
    // response.data
    loading.close() // 关闭加载效果
    const resp = response.data
    // 如果后台响应状态码不是 2000 , 说明后台服务有异常,统一可在此处处理
    if (resp.code !== 2000) {
        Message({
            message: resp.message || '系统异常',
            type: 'warning',
            duration: 5 * 1000 // 停留时长
        })
    }
    return response
}, error => {
    loading.close() // 关闭加载效果
    // 当请求接口出错时, 进行弹出错误提示, 如 404, 500, 请求超时
    console.log('response error', error.response.status)
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
})

export default request // 导出 axios 对象