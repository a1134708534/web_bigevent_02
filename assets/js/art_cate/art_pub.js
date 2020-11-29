$(function () {
    var form = layui.form
    var layer = layui.layer
    // 定义文章加载方法
    initCate()
    // 封装函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 4 点击按钮 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFlie').click()
    })
    // 添加监听事件给 选择封面按钮
    $('#coverFlie').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file.length == 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 定义文章发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 位表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 封装，添加文章方法
                publishArticle(fd)

            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                   return  layer.msg(res.message)
                }
                layer.msg('恭喜添加成功')
                //跳转
                setTimeout(function(){
                    window.parent.document.getElementById('art_list').click()
                },1500)
            }
        })
    }

})