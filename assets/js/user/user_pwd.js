$(function () {
    // 1 定义校验规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 2 新旧密码不重复
        samePWD: function (value) {
            //value 是新密码 旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return '原密码和新密码不能相同'
            }
        },
        // 3两次新密码要一只
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致'
            }
        }
    })
    // 5表单提交
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改成功')
                $('.layui-form')[0].reset()
            }
        })
    })
    
})