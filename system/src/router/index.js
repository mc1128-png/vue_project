import Vue from "vue";
import VueRouter from "vue-router";
import Register from "../views/register/index.vue"
import Login from "../views/login/index"
// 等同于 import Regeister from "../views/register"
import Layout from "@/components/Layout";
import Home from "@/views/home"
import Teacher from "@/views/teacher"
import Students from "@/views/students"

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    undefined
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'layout',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {title: '首页'},
                component: Home
            },
            {
                path: '/teacher',
                name: 'teacher',
                meta: {title: '教师管理'},
                component: Teacher
            },
            {
                path: '/students',
                name: 'students',
                meta: {title: '学生管理'},
                component: Students
            },
        ]
    },
    // 或者采用下面这种方式布局路由
    // // 基础布局
    // {
    //     path: "/",
    //     name: "layout",
    //     component: Layout,
    //     redirect: '/home',
    //     children: [
    //         {
    //             path: '/home',
    //             component: Home,
    //             meta: {title: '首页'}
    //         }
    //     ]
    // },
    // // 教师管理
    // {
    //     path: '/teacher',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/',
    //             component: Teacher,
    //             meta: {title: '教师管理'}
    //         }
    //     ]
    // },
    // // 学员管理
    // {
    //     path: '/student',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/',
    //             component: Student,
    //             meta: {title: '学员管理'}
    //         }
    //     ]
    // },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
