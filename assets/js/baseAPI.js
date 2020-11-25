// 1开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
//拦截所有的ajax请求
// 处理参数
$.ajaxPrefilter(function(params){
    params.url = baseURL + params.url
})