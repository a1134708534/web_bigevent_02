$(function () {
    // 时间过滤器
    template.defaults.imports.dateFormat = function (deStr) {
        var dt = new Date(deStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' +
            ss
    }
    // 补0
    function padZero(n){
        return n > 9 ? n : '0' + n
    }
    // 1.定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态
    };
    //  2. 初始化文章列表
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res)
                $('tbody').html(str)
                // 分页
                renderPage(res.total)
            }
        })
    }
    // 3初始化分类
    var form = layui.form
    initCate()
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //  4筛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        q.state = state
        q.cate_id = cate_id
        initTable()
    })
    // 5 分页
    var laypage = layui.laypage
    function renderPage(total) {
        laypage.render({
            elem:'pageBox',
            count:total,//数据总数
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                q.pagenum =obj.curr
                q.pagesize=obj.limit
                //首次不执行
                if(!first){
                  //do something
                  initTable()
                }
              }
          });          
    }
    // 删除事件绑定代理
    $('tbody').on('click','.btn-delete',function(){
        // 获取到文章ID
        var Id = $(this).attr('data-id')
        // 获取页面删除按钮个数
        var len = $('.btn-delete').length
        // 显示对话框
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + Id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    // 当数据删除完成后需要判断这一页是否有数据，如果没有数据页码就减一再渲染
                    if (len === 1){
                        q.pagenum = q.pagenum === 1  ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})