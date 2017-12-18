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

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            testName: null
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
            var testId = getSelectedRow();
            if(testId == null){
                return ;
            }

            vm.showList = false;
            vm.title = "测试修改";
            vm.getMenuTree(testId);
        },
        del: function () {
            var testIds = getSelectedRows();
            if(testIds == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/test/delete",
                    contentType: "application/json",
                    data: JSON.stringify(testIds),
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
        getTest: function(testId){
            $.get(baseURL + "sys/test/info/"+testId, function(r){
                vm.test = r.test;

                //勾选角色所拥有的菜单
                var menuIds = vm.test.menuIdList;
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
                data: JSON.stringify(vm.test),
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
        getMenuTree: function(testId) {
            //加载菜单树
            $.get(baseURL + "sys/menu/list", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r);
                //展开所有节点
                ztree.expandAll(true);

                if(testId != null){
                    vm.getTest(testId);
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
        },
        validator: function () {
            if(isBlank(vm.test.testName)){
                alert("测试名不能为空");
                return true;
            }
        }
    }
});
