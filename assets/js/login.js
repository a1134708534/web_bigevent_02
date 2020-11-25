$(function(){
    // 1点击去注册账号，影藏登录区域，显示注册区域
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 1点击去登录，影藏注册区域，显示登录区域
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 2.自定义校验规则
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
          ],
        //注册密码校验
        repwd:function(value){
            var pwd =$('.reg-box [name=password]').val()
            if (pwd !== value) {
                alert('两次输入的值不一样')
            }
        }
    })

    // 4注册账号
    var layer = layui.layer;
    $('#form_reg').on('submit',function(e){
        // 阻止表单默认提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:{
                username:$('.reg-box [name=username]' ).val(),
                password:$('.reg-box [name=password]').val(),
            },
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 提交成功后输出
                layer.msg('恭喜注册成功')
                // 手动切换到登录页面
                $('#link_login').click(),
                // 清空注册页面内容 重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })
    
    // 5登录表单
    $('#login_box').on('submit',function(e){
        e.preventDefault(),//阻止默认提交
        //发起登录请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),//快速获取form表单值
            success:function(res){
                if(res.status !== 0){
                    //检验返回状态
                    return layer.msg(res.message)
                }
                // 提示信息 登录成功 保存信息到token，跳转页面
                layer.msg('登录成功')
                // 保存token
                localStorage.setItem('token',res.token)
                // 要跳转页面
                location.href = '/index.html'
            }
        })
    })
})