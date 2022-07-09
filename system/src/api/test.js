// 发送根目录请求
import request from "@/utils/requset";
// const BASE_URL = 'http://localhost:8888'
export default {
    getTest() {
        // 测试1 调用get方式发送get请求
        // request.get(BASE_URL + "/db.json").then(response => {
        //     console.log("get1", response.data);
        // }).catch(error => {
        //     console.log(error);
        // });

        // 测试2, 使用对象形式传入请求配置，如 请求url, method，param
        // request({
        //     url: BASE_URL + "/db.json",
        //     method: "get"
        // }).then(response => {
        //     console.log("get2", response.data);
        // }).catch(error => {
        //     console.log(error);
        // });
        // // 导出默认对象
        // export default {
        //     getList() {
        //         const req = request({
        //             url: BASE_URL + "/db.json",
        //             method: "get"
        //         });
        //         // console.log(req) // Promise
        //         return req;
        //     }
        // }
        // 上述方式请求数据在默认导出，.vue在引入使用比较繁琐，使用直接返回请求数据的方式
        return request({
            url: "/",
            method: "get"
        })
    }
}