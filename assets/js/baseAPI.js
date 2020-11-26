// 1开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//拦截所有的ajax请求
// 处理参数
$.ajaxPrefilter(function(params){
    params.url = baseURL + params.url

    // 对需要权限的接口配置信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers={
            // 重新登录 因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 拦截所有响应，判断身份验证
    params.complete = function(res){
        console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！'){
             // 1清空本地token
             localStorage.removeItem('token')
             // 2强制跳转页面
             location.href = '/login.html'
        }  
    }
})