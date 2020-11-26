$(function () {
    // 自定义用户名验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在1 ~ 6 位之间'
            }
        }
    })
    // 2用户渲染
    initUserInfo()
    var layer = layui.layer
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 3 重置功能
    $('#btnReset').on('click',function(e){
        // 阻止默认事件
        e.preventDefault()
        // 重新渲染
        initUserInfo()
    })
    // 4 修改用户信息
    $('.layui-form').on('submit',function(e){
        // 阻止默认行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您修改成功')
                // 调用父页面中的封装函数
                window.parent.getUserInof()
            }

        })
    })
})