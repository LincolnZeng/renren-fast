$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/test/list',
        datatype: "json",
        colModel: [
            { label: '测试ID', name: 'testId', index: "test_id", width: 45, key: true },
            { label: '测试名称', name: 'testName', index: "test_name", width: 75 },
            { label: '备注', name: 'remark', width: 100 }
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList : [10,30,50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page",
            rows:"limit",
            order: "order"
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            roleName: null
        },
        showList: true,
        title:null,
        test:{}
    },
    methods: {
        query: function () {
            vm.reload();
        },
       add: function(){
            vm.showList = false;
            vm.title = "测试新增";
            vm.test = {};
            vm.getMenuTree(null);
        },
         update: function () {
            var roleId = getSelectedRow();
            if(roleId == null){
                return ;
            }

            vm.showList = false;
            vm.title = "修改";
            vm.getMenuTree(roleId);
        },
        del: function () {
            var roleIds = getSelectedRows();
            if(roleIds == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/role/delete",
                    contentType: "application/json",
                    data: JSON.stringify(roleIds),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getRole: function(roleId){
            $.get(baseURL + "sys/role/info/"+roleId, function(r){
                vm.role = r.role;

                //勾选角色所拥有的菜单
                var menuIds = vm.role.menuIdList;
                for(var i=0; i<menuIds.length; i++) {
                    var node = ztree.getNodeByParam("menuId", menuIds[i]);
                    ztree.checkNode(node, true, false);
                }
            });
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }

            //获取选择的菜单
            var nodes = ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                menuIdList.push(nodes[i].menuId);
            }
            vm.test.menuIdList = menuIdList;

            var url = vm.test.testId == null ? "sys/test/save" : "sys/test/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.role),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getMenuTree: function(roleId) {
            //加载菜单树
            $.get(baseURL + "sys/menu/list", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r);
                //展开所有节点
                ztree.expandAll(true);

                if(roleId != null){
                    vm.getRole(roleId);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            /*获取一个参数的方法*/
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'testName': vm.q.testName},
                page:page
            }).trigger("reloadGrid");
        }
        /*validator: function () {
            if(isBlank(vm.role.roleName)){
                alert("角色名不能为空");
                return true;
            }
        }*/
    }
});
