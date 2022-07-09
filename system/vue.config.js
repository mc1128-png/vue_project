module.exports = {
    devServer: {
        port: 8888,
        host: "localhost",
        https: false,
        open: true,
        proxy: {
            // '/dev-api': {
            //     target: 'http://127.0.0.1:3000',
            //     // target: 'http://localhost:3000',
            //     changeOrigin: true, // 开启代理
            //     pathRewrite: {
            //         '^/dev-api': '' // 路径清空
            //     }
            // }
            [process.env.VUE_APP_BASE_API]: {
                target: process.env.VUE_APP_SERVICE_URL,
                // target: 'http://localhost:3000',
                changeOrigin: true, // 开启代理
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '' // 路径清空
                }
            }
        }
    },
    lintOnSave: false,
    productionSourceMap: false
}