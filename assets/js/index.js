// 获取用户基本信息 验证用户名密码 正确才能登录
$(function () {
    getUserInof()
})
// 1获取登录信息 因为要多次调用 需要写下全局变量
function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        /* headers: {
            // 重新登录 因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功
            return renderAvatar(res.data)
        }
    })
    // 2 退出登录
    var layer = layui.layer
    $('#btnLogout').on('click', function (e) {
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //1清空本地token
            localStorage.removeItem('token')
            // 2页面跳转
            location.href = '/login.html'
            // 3关闭询问框
            layer.close(index);
        });
    })
}
// 渲染头像函数
function renderAvatar(user) {
    // 1用户名 (昵称优先)
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2 用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        // 没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)
    }
}