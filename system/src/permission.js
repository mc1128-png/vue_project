import router from './router/index.js'
import store from './store'

router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem("mc-sms-token")
    const token = store.state.user.token
    if (!token) {
        if (to.path === '/login') {
            next()
        } else if (to.path === '/register') {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        // 请求路由非登录页面，先在本地查看是否有用户信息，
        // const userInfo = localStorage.getItem("mc-sms-user")
        const userInfo = store.state.user.user
        // console.log('userInfo', userInfo)
        if (userInfo) {
            next()
        } else {
            // 如果本地没有用户信息， 就通过token去获取用户信息，
            store.dispatch('GetUserInfo').then(response => {
                if (response.flag) {
                    next()
                } else {
                    next({path: '/login'})
                }
            })
        }
        // // token存在
        // // 获取用户信息
        // const userInfo = localStorage.getItem("mc-sms-user")
        // if (userInfo) {
        //     next()
        // } else {
        //     getUserInfo(token).then(response => {
        //         const resp = response.data
        //         if (resp.flag) {
        //             localStorage.setItem("mc-sms-user", JSON.stringify(resp.data))
        //             next()
        //         } else {
        //             next({
        //                 path: '/login'
        //             })
        //         }
        //     })
        // }
    }
})