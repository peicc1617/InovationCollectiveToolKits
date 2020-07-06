$.ajax({
    type: "post",
    url: "Service",
    data: {
        'username': username,
        "type": "load"
    },
    success: function (result) {
        console.log(result);
        singleFriend = JSON.parse(result).singleFriend;
        groupFriend = JSON.parse(result).groupFriend;
        for (var i = 0; i < singleFriend.length; i++) {
            // $('#singleFriend').append(
            //      "<li class=\"\">\n" +
            //      "<a href=\"#\" groupId='" + singleFriend[i].id + "' identity='0' class=\"dropdown-toggle\" onclick=\"chatUser(this)\">\n" +
            //      "<i class=\"menu-icon fa fa-caret-right\"></i>\n" +
            //      "" + singleFriend[i].name + "</a></li>"
            // );
            $('#singleFriend').append(
                 "  <li class=\"\"><a href='#' groupId='" + singleFriend[i].id + "' identity='0' class=\"dropdown-toggle\" onclick=\"chatUser(this)\"><div>\n" +
                 "<div class=\"sideProjectLi\" onmouseover=\"this.title = this.innerHTML;\" title=\"'" + singleFriend[i].name + "'\">\n" +
                 "" + singleFriend[i].name + "\n</div>\n" +
                 "<div style=\"position:absolute;bottom:6px;right:5px;\">\n" +
                 "<i class=\"ace-icon fa fa-trash-o bigger-120 red\" onclick=\"removeProject(" + singleFriend[i].id + ")\"></i>\n" +
                 "</div></div></a></li>"
            );
        }
        for (var i = 0; i < groupFriend.length; i++) {
            // var firstLi = "<li class=\"\">\n" +
            //      "<a href=\"#\" class=\"dropdown-toggle\" memberId ='" + groupFriend[i].id + "' onclick=\"chatUser(this)\" groupId='" + groupFriend[i].id + "' identity='1'>\n" +
            //      "<i class=\"menu-icon fa fa-caret-right\"></i>\n" +
            //      "" + groupFriend[i].name + "</a><ul class=\"submenu\">";
            var firstLi = "  <li class=\"\"><a href='#' memberId ='" + groupFriend[i].id + "' groupId='" + groupFriend[i].id + "' identity='1' class=\"dropdown-toggle\" onclick=\"chatUser(this)\"><div>\n" +
                 "<div class=\"sideProjectLi\" onmouseover=\"this.title = this.innerHTML;\" title=\"'" + groupFriend[i].name + "'\">\n" +
                 "" + groupFriend[i].name + "\n</div>\n" +
                 "<div style=\"position:absolute;bottom:6px;right:5px;\">\n" +
                 "<i class=\"ace-icon fa fa-trash-o bigger-120 red\" onclick=\"removeProject(" + groupFriend[i].id + ")\"></i>\n" +
                 "</div></div></a><ul class=\"submenu\">";

            var secondLi = "";
            for (var j = 0; j < groupFriend[i].subGroup.length; j++) {
                secondLi +=
                     // "<li class=\"\">\n" +
                     // "<a href=\"#\" identity='1' memberId='" + groupFriend[i].subGroup[j].id + "' onclick=\"chatUser(this)\" groupId='" + groupFriend[i].subGroup[j].id + "'>\n" +
                     // "<i class=\"menu-icon fa fa-caret-right\"></i>\n" +
                     // "" + groupFriend[i].subGroup[j].name + "</a></li>";
                     "  <li class=\"\"><a href='#' memberId ='" + groupFriend[i].subGroup[j].id + "' groupId='" + groupFriend[i].subGroup[j].id + "' identity='1' class=\"dropdown-toggle\" onclick=\"chatUser(this)\"><div>\n" +
                     "<div class=\"sideProjectLi\" onmouseover=\"this.title = this.innerHTML;\" title=\"'" + groupFriend[i].subGroup[j].name + "'\">\n" +
                     "" + groupFriend[i].subGroup[j].name + "\n</div>\n" +
                     "<div style=\"position:absolute;bottom:6px;right:5px;\">\n" +
                     "<i class=\"ace-icon fa fa-trash-o bigger-120 red\" onclick=\"removeProject(" + groupFriend[i].subGroup[j].id + ")\"></i>\n" +
                     "</div></div></a><li>";
            }
            var thirdLi = "</ul></li>";
            $('#groupFriend').append(firstLi + secondLi + thirdLi);
        }
    }
});

function chatUser(node) {
    identity = $(node).attr('identity');
    projectId = 1;
    if ($(node).attr("memberId") === undefined) {//查看单个好友
        chat = $(node).attr("groupId");
        $('#chatId').text(node.innerText);
        groupName = node.innerText.replace(/[\r\n]/g, "").replace(/\ +/g, "");
        $.ajax({
            type: "post",
            url: "Service",
            async: false,
            data: {
                "chat": chat,
                "type": "getGroupMember"
            },
            success: function (result) {
                target = JSON.parse(result).join("-");
            }
        });
        // 删除高亮属性
        for (var i = 0; i < $('#singleFriend').find('li').length; i++) {
            $($('#singleFriend').find('li')).removeAttr('class');
        }
        // 高亮项目
        $(node).parent().attr("class", "active highlight");
    } else {//查看群聊天
        chat = $(node).attr("memberId");
        parent = chat;
        identity = $(node).attr("identity");
        groupName = node.innerText.replace(/[\r\n]/g, "").replace(/\ +/g, "");
        $.ajax({
            type: "post",
            url: "Service",
            async: false,
            data: {
                "chat": chat,
                "type": "getGroupMember"
            },
            success: function (result) {
                target = JSON.parse(result).join("-");
            }
        });
        for (var i = 0; i < $('#groupFriend').find('li').length; i++) {
            $($('#groupFriend').find('li')).removeAttr('class');
        }
        // 高亮项目
        $(node).parent().attr("class", "active highlight");
        $('#chatId').text(node.innerText);
        // 显示画图
        $.ajax({
            type: "post",
            url: "Service",
            data: {
                "chat": chat,
                "type": "getBOMDataByChat",
            },
            success: function (result) {
                modifyMxGraph(result);
            }
        });


    }
    loadHistory(chat);
}

function modifyMxGraph(result) {
    var layout = new mxFastOrganicLayout(graph, 2);
    graph.getModel().beginUpdate(2);
    try {
        var doc = mxUtils.parseXml(result, 2);
        var dec = new mxCodec(doc, 2);
        dec.decode(doc.documentElement, graph.getModel(), 2);

        var parent = graph.getDefaultParent(2);

        layout.execute(parent, 2);
    } finally {
        graph.getModel().endUpdate(2);
    }
}

// 发送消息
function sendMessage() {
    if ($('#editor2').text().trim().length < 1) {
        alert("发送信息不能为空，请继续编辑");
    } else {
        var message = {
            To: target,
            message: $('#editor2').text(),
            chat: chat,
            groupName: groupName,
            identity: identity
        };
        websocket.send(JSON.stringify(message));
        $('#editor2').text("");
    }
}
//根据项目（群聊）id 查询群成员
function getUsersByProjectId(num) {
    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: {'chat': num + "", "type": "getUsersByProjectId"},
        success: function (result) {
            console.log("群聊成员："+result);
            if (result!=null){
                $("#groupMembers").empty();//清空成员列表
                var members=result.split(" ");
                for (var i = 0; i <members.length ; i++) {
                    var li="<li>"+members[i]+"</li>";
                    $("#groupMembers").append(li);
                }
            }

        }
    })
}
function loadHistory(num) {
    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: {'chat': num + "", "type": "SolveMessage"},
        success: function (result) {
            var data = JSON.parse(result);
            $('.scroll-content').html("");
            for (var i = 0; i < data.length; i++) {
                var colorAttr = "";
                if (data[i].user === username)
                    colorAttr = "color:#DC143C";
                $('.scroll-content').append(
                     "<div class=\"itemdiv dialogdiv\">\n" +
                     "  <div class=\"user\">\n" +
                     "\t\t<img alt=\"John's Avatar\" src=\"../webresources/person/" + data[i].user + ".jpg\" />\n</div>\n" +
                     "  <div class=\"body\">\n" +
                     "<div class=\"time\">\n" +
                     "<i class=\"ace-icon fa fa-clock-o\"></i>\n" +
                     "</div>" +
                     "\t\t<div class=\"name\">\n" +
                     "\t\t\t  <a href=\"#\">" + data[i].user + "</a>\n" +
                     "\t\t</div>\n" +
                     "\t\t<div class=\"text\" style=" + colorAttr + ">" + data[i].message + "</div>\n" +
                     "\t\t<div class=\"tools\">\n" +
                     "\t\t\t  <a href=\"#\" class=\"btn btn-minier btn-info\">\n" +
                     "\t\t\t\t\t<i class=\"icon-only ace-icon fa fa-share\"></i>\n" +
                     "\t\t\t  </a>\n" +
                     "\t\t</div>\n" +
                     "  </div>\n" +
                     "</div>"
                );
            }
            $(".scroll-content").scrollTop($(".scroll-content")[0].scrollHeight);
        }
    });
    getUsersByProjectId(num);
}

function showAllUser() {
    $('#adddatainfo').modal('show');

    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: {"type": "getAllUser"},
        success: function (result) {
            var temp = JSON.parse(result);
            $('#form-field-select-1').html("");
            for (var i = 0; i < temp.length; i++) {
                var aa = 0;
                for (var item in singleFriend) {
                    if (singleFriend[item] == temp[i]) {
                        aa++;
                    }
                }
                if (aa == 0) {
                    if (temp[i] !== username)
                        $('#form-field-select-1').append(
                             "<option value=\"" + temp[i] + "\">" + temp[i] + "</option>"
                        )
                }
                aa == 0;
            }

        }
    });
}

function addFriend() {
    var data = {
        "type": "addFriend",
        user1: username,
        user2: $('#form-field-select-1').val().replace(/[\r\n]/g, "").replace(/\ +/g, "")
    };
    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: data,
        success: function (result) {
            $('#adddatainfo').modal('hide');
            alert("添加成功");
        }
    });
}

function showGroup() {
    $('#addGroup').modal("show");
    $('#groupFriendaa').html("");
    for (var i = 0; i < singleFriend.length; i++) {
        $('#groupFriendaa').append(
             "<p><input type=\"checkbox\" name=\"item\" value='" + singleFriend[i].name + "'><label>" + singleFriend[i].name + "</label></p>"
        );
    }
}

function addFriendGroup() {
    var name = $('#projectNameModal').val();
    if (name.length < 1 || name === "") return;
    var userGroup = [username];
    var inputGroup = $('input[name="item"]');
    for (var i = 0; i < inputGroup.length; i++) {
        if (inputGroup[i].checked) {
            userGroup.push($(inputGroup[i]).val())
        }
    }
    var data = {
        type: "addGroup",
        name: name,
        user: userGroup.join('-'),
        parent: parent
    };
    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: data,
        success: function (result) {
            $('#addFriendGroup').modal('hide');
            alert("添加成功");
        }
    });
}

function addSubGroupList() {
    $('#addSubGroup').modal('show');
    $('#currentGroupName').val(groupName);
    $('#friendList').html("");
    for (var i = 0; i < singleFriend.length; i++) {
        $('#friendList').append(
             "<p><input type=\"checkbox\" name=\"singleFriend\" value='" + singleFriend[i].name + "'><label>" + singleFriend[i].name + "</label></p>"
        );
    }
}

function addSubGroup() {
    var name = $('#subGroup').val();
    if (name.length < 1 || name === "") return;
    var userGroup = [username];
    var inputGroup = $('input[name="singleFriend"]');
    for (var i = 0; i < inputGroup.length; i++) {
        if (inputGroup[i].checked) {
            userGroup.push($(inputGroup[i]).val())
        }
    }
    var data = {
        "type": "addGroup",
        name: name,
        user: userGroup.join('-'),
        parent: parent
    };
    $.ajax({
        type: "post",
        url: "Service",
        async: false,
        data: data,
        success: function (result) {
            $('#addFriendGroup').modal('hide');
            alert("添加成功");
        }
    });
}

function removeProject(id) {
    if (confirm("项目删除后将无法恢复，确认要删除吗？")) {
        $.ajax({
            url: "Service",
            data: {
                "chat": id,
                "type": "deleteRelation"
            },
            success: function (result) {
                console.log("删除成功");
                location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//输出错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
                alert('项目删除失败，请稍后重试');
            }
        });
    }
}

function showInnovationtemplate() {
    $('#addInnovationtemplate').modal('show');
    $.ajax({
        url: "../InnovationAPPManageKits/AppManager",
        success: function (result) {
            $('#myBootstrapTtable1').bootstrapTable('removeAll');
            var json = JSON.parse(result);
            for (var i = 0; i < json.length; i++) {
                var datanum = $('#myBootstrapTtable1').bootstrapTable('getData').length;
                var rowdata = {
                    procedureIdForDelete: datanum + 1,
                    appPath: json[i].appPath,
                    innovationName: json[i].displayName,
                    toolHot: json[i].visitNum,
                    innovationCategory: json[i].webAppCategory,
                    Description: json[i].webAppDescription
                };
                $('#myBootstrapTtable1').bootstrapTable('append', rowdata);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//输出错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    });
    // $('#myBootstrapTtable1').bootstrapTable('removeAll');
    // var json = bb;
    // for (var i = 0; i < json.length; i++) {
    //     var datanum = $('#myBootstrapTtable1').bootstrapTable('getData').length;
    //     var rowdata = {
    //         procedureIdForDelete: datanum + 1,
    //         appPath: json[i].appPath,
    //         innovationName: json[i].displayName,
    //         toolHot: json[i].visitNum,
    //         innovationCategory: json[i].webAppCategory,
    //         Description: json[i].webAppDescription
    //     };
    //     $('#myBootstrapTtable1').bootstrapTable('append', rowdata);
    // }
}

function showInnovationTool() {
    $('#addInnovationTool').modal('show');
    $.ajax({
        url: "../templates/api/refer?order=asc",
        success: function (result) {
            $('#myBootstrapTtable').bootstrapTable('removeAll');
            var json = result.data;
            for (var i = 0; i < json.length; i++) {
                var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
                var rowdata = {
                    procedureIdForDelete: datanum + 1,
                    referID: json[i].referID,
                    processName: json[i].description,
                    workTime: json[i].referName,
                    tags: json[i].tags
                };
                $('#myBootstrapTtable').bootstrapTable('append', rowdata);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//输出错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    });
}

function finishProject() {
    if ($('#myBootstrapTtable').find('tr.selected').length > 2) {
        alert("只能选择一个模板项目");
    } else {
        if (chat == undefined) {
            alert("请选择要解决的项目");
            return;
        }
        var templateId = $($('#myBootstrapTtable').find('tr.selected').find('td')[1]).text();
        window.open("http://innovation.xjtu.edu.cn/templates/project/new.html?referID=" + templateId + "&problemID=" + chat + "");
    }

}

function finishProject1() {
    if ($('#myBootstrapTtable1').find('tr.selected').length > 2) {
        alert("只能选择一个模板项目");
    } else {
        if (chat == undefined) {
            alert("请选择要解决的项目");
            return;
        }
        var templateId = parseInt($($('#myBootstrapTtable1').find('tr.selected').find('td')[1]).text());
        var path = $('#myBootstrapTtable1').bootstrapTable('getData')[templateId-1].appPath;
        window.open("http://innovation.xjtu.edu.cn/"+path+"");
    }

}

var bb = [{
    "appPath": "/7W4H",
    "displayName": "7W4H",
    "running": true,
    "usingNumber": 0,
    "visitNum": 9919,
    "webAppAttributeLabel": "思维发散",
    "webAppCategory": "创新思维",
    "webAppDescription": "7W4H是一种通过设问，经过不断分析、改进于优化，最后找到问题解决方案的一种创新方法",
    "webAppIcon": "/webresources/APPicons/7W4H.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/BMCanvas",
    "displayName": "画布模型",
    "running": true,
    "usingNumber": 0,
    "visitNum": 9417,
    "webAppAttributeLabel": "绘制商业画布模型；分析产品",
    "webAppCategory": "企业管理",
    "webAppDescription": "一种能够帮助创业者催生创意、降低猜测、确保他们找对了目标用户、合理解决问题的工具。",
    "webAppIcon": "/webresources/APPicons/BMCanvas.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/Business_canvas",
    "displayName": "画布模型3.0",
    "running": true,
    "usingNumber": 0,
    "visitNum": 376,
    "webAppAttributeLabel": "绘制商业画布模型；分析产品",
    "webAppCategory": "企业管理",
    "webAppDescription": "一种能够帮助创业者催生创意、降低猜测、确保他们找对了目标用户、合理解决问题的工具。",
    "webAppIcon": "/webresources/APPicons/Business_canvas.png",
    "webAppVersion": "v3.0"
}, {
    "appPath": "/DAPP",
    "displayName": "创新方法管理平台",
    "running": true,
    "usingNumber": 0,
    "visitNum": 644,
    "webAppAttributeLabel": "管理平台；后台App",
    "webAppCategory": "知识工程",
    "webAppDescription": "这是基础创新方法管理平台，主要进行webApp管理",
    "webAppIcon": "/webresources/APPicons/DAPP.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/DrawVSM",
    "displayName": "mxgraph_com",
    "running": true,
    "usingNumber": 0,
    "visitNum": 9446,
    "webAppIcon": "/webresources/APPicons/DrawVSM.png"
}, {
    "appPath": "/FEMA",
    "displayName": "创新方法管理平台",
    "running": true,
    "usingNumber": 0,
    "visitNum": 1357,
    "webAppAttributeLabel": "FEMA",
    "webAppCategory": "知识工程",
    "webAppDescription": "FEMA计算",
    "webAppIcon": "/webresources/APPicons/FEMA.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/Frame",
    "displayName": "框架推理",
    "running": true,
    "usingNumber": 0,
    "visitNum": 9825,
    "webAppAttributeLabel": "管理平台；后台App",
    "webAppCategory": "知识工程",
    "webAppDescription": "这是基础创新方法管理平台，主要进行webApp管理",
    "webAppIcon": "/webresources/APPicons/Frame.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/FunctionalAnalysis_VE",
    "displayName": "功能分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 4248,
    "webAppAttributeLabel": "功能分析、功能成本匹配",
    "webAppCategory": "TRIZ",
    "webAppDescription": "通过功能与成本是否匹配判断功能是否合理",
    "webAppIcon": "/webresources/APPicons/FunctionalAnalysis_VE.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/HOQ",
    "displayName": "质量屋",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7144,
    "webAppAttributeLabel": "矩阵、数据分析",
    "webAppCategory": "产品设计",
    "webAppDescription": "质量屋是质量功能配置（QFD）的核心 质量屋是一种确定顾客需求和相应产品或服务性能之间联系的图示方法",
    "webAppIcon": "/webresources/APPicons/HOQ.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/IndustryChainDescription",
    "displayName": "Archetype Created Web Application",
    "running": true,
    "usingNumber": 1,
    "visitNum": 878,
    "webAppIcon": "/webresources/APPicons/IndustryChainDescription.png"
}, {
    "appPath": "/InnovationCollectiveToolKits",
    "displayName": "Archetype Created Web Application",
    "running": true,
    "usingNumber": 1,
    "visitNum": 2226,
    "webAppIcon": "/webresources/APPicons/InnovationCollectiveToolKits.png"
}, {
    "appPath": "/InnovationCollectiveToolKits_v1",
    "displayName": "Archetype Created Web Application",
    "running": true,
    "usingNumber": 0,
    "visitNum": 56,
    "webAppIcon": "/webresources/APPicons/InnovationCollectiveToolKits_v1.png"
}, {
    "appPath": "/InnovationCollectiveToolKits_v2",
    "displayName": "Archetype Created Web Application",
    "running": true,
    "usingNumber": 0,
    "visitNum": 267,
    "webAppIcon": "/webresources/APPicons/InnovationCollectiveToolKits_v2.png"
}, {
    "appPath": "/LCUEmanage",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7954,
    "webAppIcon": "/webresources/APPicons/LCUEmanage.png"
}, {
    "appPath": "/MEIMS",
    "running": true,
    "usingNumber": 0,
    "visitNum": 483,
    "webAppIcon": "/webresources/APPicons/MEIMS.png"
}, {
    "appPath": "/MainPage",
    "running": true,
    "usingNumber": 0,
    "visitNum": 5,
    "webAppIcon": "/webresources/APPicons/MainPage.png"
}, {
    "appPath": "/NetworkCreation",
    "displayName": "快速换产",
    "running": true,
    "usingNumber": 0,
    "visitNum": 561,
    "webAppAttributeLabel": "快速换产；优化换模时间",
    "webAppCategory": "质量分析",
    "webAppDescription": "将模具的产品换模时间、生产启动时间或调整时间等尽可能减少的一种过程改进方法。可显著地缩短机器安装、设定换模所需的时间。",
    "webAppIcon": "/webresources/APPicons/NetworkCreation.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/OEEMeasureSystem3back",
    "displayName": "OEE测量分析系统",
    "running": true,
    "usingNumber": 0,
    "visitNum": 10882,
    "webAppIcon": "/webresources/APPicons/OEEMeasureSystem3back.png"
}, {
    "appPath": "/PQanalysis",
    "displayName": "PQ分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 9456,
    "webAppAttributeLabel": "PQ分析；车间布局优化",
    "webAppCategory": "质量分析",
    "webAppDescription": "用来对生产的产品按照数量进行分类，然后根据分类结果对生产车间进行布局优化。",
    "webAppIcon": "/webresources/APPicons/PQanalysis.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/Pareto",
    "displayName": "帕累托图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7451,
    "webAppAttributeLabel": "绘图工具；帕累托图",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是一种绘图工具，用于分析问题对结果影响的大小。",
    "webAppIcon": "/webresources/APPicons/Pareto.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/PatternMatching",
    "running": true,
    "usingNumber": 0,
    "visitNum": 447,
    "webAppIcon": "/webresources/APPicons/PatternMatching.png"
}, {
    "appPath": "/SIPOC",
    "displayName": "SIPOC图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 11463,
    "webAppAttributeLabel": "管理平台；工具App",
    "webAppCategory": "创新思维",
    "webAppDescription": "这是一款在线绘图工具，用于绘制SIPOC图",
    "webAppIcon": "/webresources/APPicons/SIPOC.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/SMED",
    "displayName": "快速换产",
    "running": true,
    "usingNumber": 0,
    "visitNum": 4125,
    "webAppAttributeLabel": "快速换产；优化换模时间",
    "webAppCategory": "质量分析",
    "webAppDescription": "将模具的产品换模时间、生产启动时间或调整时间等尽可能减少的一种过程改进方法。可显著地缩短机器安装、设定换模所需的时间。",
    "webAppIcon": "/webresources/APPicons/SMED.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/SPC_P",
    "displayName": "P控制图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 20046,
    "webAppIcon": "/webresources/APPicons/SPC_P.png"
}, {
    "appPath": "/SPlan",
    "displayName": "精益计划",
    "running": true,
    "usingNumber": 0,
    "visitNum": 6076,
    "webAppAttributeLabel": "精益计划；精益生产",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是基础创新方法管理平台，主要进行webApp管理",
    "webAppIcon": "/webresources/APPicons/SPlan.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/TaskDecomposition",
    "running": true,
    "usingNumber": 0,
    "visitNum": 768,
    "webAppIcon": "/webresources/APPicons/TaskDecomposition.png"
}, {
    "appPath": "/Xbar-R",
    "displayName": "Xbar-R图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 1593,
    "webAppAttributeLabel": "绘图；工具",
    "webAppCategory": "知识工程",
    "webAppDescription": "用于观察正态分布的变化，R控制图用于观察正态分布分散或变异情况的变化，Xbar主要用于观察正态分布的均值的变化",
    "webAppIcon": "/webresources/APPicons/Xbar-R.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/bpNetwork",
    "displayName": "神经网络",
    "running": true,
    "usingNumber": 0,
    "visitNum": 10371,
    "webAppAttributeLabel": "神经网络预测",
    "webAppCategory": "企业管理",
    "webAppDescription": "这是神经网络App，主要基于BP算法进行预测",
    "webAppIcon": "/webresources/APPicons/bpNetwork.png",
    "webAppVersion": "v5.0"
}, {
    "appPath": "/conflictMatrix1",
    "displayName": "矛盾矩阵",
    "running": true,
    "usingNumber": 0,
    "visitNum": 286,
    "webAppAttributeLabel": "技术矛盾、40个发明原理",
    "webAppCategory": "TRIZ",
    "webAppDescription": "通过改善的参数和恶化的参数从矛盾矩阵中寻找可用的发明原理",
    "webAppIcon": "/webresources/APPicons/conflictMatrix1.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/correlationAnalysis",
    "displayName": "相关回归分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 10148,
    "webAppAttributeLabel": "相关回归分析",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是相关回归分析App，主要用于相关回归分析",
    "webAppIcon": "/webresources/APPicons/correlationAnalysis.png",
    "webAppVersion": "v5.0"
}, {
    "appPath": "/dataForVSM",
    "displayName": "数据统计",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7042,
    "webAppAttributeLabel": "数据统计；价值流分析",
    "webAppCategory": "质量分析",
    "webAppDescription": "用适当的统计分析方法对收集来的大量数据进行分析，提取有用信息和形成结论而对数据加以详细研究和概括总结的过程。",
    "webAppIcon": "/webresources/APPicons/dataForVSM.png",
    "webAppVersion": "v3.0"
}, {
    "appPath": "/define",
    "displayName": "问题定义",
    "running": true,
    "usingNumber": 0,
    "visitNum": 8513,
    "webAppAttributeLabel": "DMAIC；问题定义阶段",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是问题定义阶段，主要用于DMAIC项目问题定义",
    "webAppIcon": "/webresources/APPicons/define.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/defineP",
    "displayName": "问题定义",
    "running": true,
    "usingNumber": 0,
    "visitNum": 342,
    "webAppAttributeLabel": "DMAIC；问题定义阶段",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是问题定义阶段，主要用于DMAIC项目问题定义",
    "webAppIcon": "/webresources/APPicons/defineP.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/demo-guo_war",
    "running": true,
    "usingNumber": 0,
    "visitNum": 545,
    "webAppIcon": "/webresources/APPicons/demo-guo_war.png"
}, {
    "appPath": "/efs",
    "displayName": "灵敏度分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 3661,
    "webAppAttributeLabel": "管理平台；工具App",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是基础创新方法管理平台，主要进行webApp管理",
    "webAppIcon": "/webresources/APPicons/efs.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/evaluation",
    "running": true,
    "usingNumber": 0,
    "visitNum": 66,
    "webAppIcon": "/webresources/APPicons/evaluation.png"
}, {
    "appPath": "/fishbone",
    "displayName": "鱼骨图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 25316,
    "webAppAttributeLabel": "绘图，主要因素",
    "webAppCategory": "产品设计",
    "webAppDescription": "这是鱼骨图App，主要绘制鱼骨图，功能是分析问题的主要因素",
    "webAppIcon": "/webresources/APPicons/fishbone.png",
    "webAppVersion": "v5.0"
}, {
    "appPath": "/histogram",
    "displayName": "直方图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7443,
    "webAppAttributeLabel": "管理平台；工具",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是一款在线绘图工具",
    "webAppIcon": "/webresources/APPicons/histogram.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/kano",
    "displayName": "kano分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 6238,
    "webAppAttributeLabel": "需求分析，产品设计",
    "webAppCategory": "产品设计",
    "webAppDescription": "以分析用户需求对用户满意的影响为基础，体现了产品性能和用户满意之间的非线性关系",
    "webAppIcon": "/webresources/APPicons/kano.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/lineBalance_V3",
    "displayName": "生产线平衡",
    "running": true,
    "usingNumber": 0,
    "visitNum": 6774,
    "webAppAttributeLabel": "进行生产线平衡",
    "webAppCategory": "企业管理",
    "webAppDescription": "这是生产线平衡App，主要基于遗传算法进行生产线平衡分析",
    "webAppIcon": "/webresources/APPicons/lineBalance_V3.png",
    "webAppVersion": "v5.0"
}, {
    "appPath": "/mepn",
    "displayName": "工艺性能分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 6304,
    "webAppAttributeLabel": "管理平台；工具App",
    "webAppCategory": "质量分析",
    "webAppDescription": "用于分析工艺性能，寻找工艺网络中的关键节点",
    "webAppIcon": "/webresources/APPicons/mepn.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/monitor",
    "running": true,
    "usingNumber": 0,
    "visitNum": 153,
    "webAppIcon": "/webresources/APPicons/monitor.png"
}, {
    "appPath": "/msa",
    "displayName": "测量系统分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 5261,
    "webAppAttributeLabel": "管理平台；工具App",
    "webAppCategory": "质量分析",
    "webAppDescription": "用于分析测量系统的可靠性与稳定性",
    "webAppIcon": "/webresources/APPicons/msa.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/multiSeriesHistogram",
    "displayName": "条形图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 4516,
    "webAppIcon": "/webresources/APPicons/multiSeriesHistogram.png"
}, {
    "appPath": "/partialCorrelationAnalysis",
    "displayName": "偏相关分析",
    "running": true,
    "usingNumber": 0,
    "visitNum": 10336,
    "webAppAttributeLabel": "偏相关分析",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是偏相关分析App，主要用于偏相关分析",
    "webAppIcon": "/webresources/APPicons/partialCorrelationAnalysis.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/predict",
    "displayName": "质量预测",
    "running": true,
    "usingNumber": 0,
    "visitNum": 7445,
    "webAppAttributeLabel": "管理平台；工具App",
    "webAppCategory": "质量分析",
    "webAppDescription": "这是质量预测app，你需要做的只是收集数据、输入、点击计算，你就可以轻松预测得到预测质量",
    "webAppIcon": "/webresources/APPicons/predict.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/pss",
    "running": true,
    "usingNumber": 0,
    "visitNum": 121,
    "webAppIcon": "/webresources/APPicons/pss.png"
}, {
    "appPath": "/radar",
    "displayName": "雷达图",
    "running": true,
    "usingNumber": 0,
    "visitNum": 10109,
    "webAppAttributeLabel": "雷达图；指标对比",
    "webAppCategory": "质量分析",
    "webAppDescription": "将一个公司的各项财务分析所得的数字或比率，就其比较重要的项目集中划在一个圆形的图表上",
    "webAppIcon": "/webresources/APPicons/radar.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/relaxOfMatrix_war",
    "displayName": "关系矩阵",
    "running": true,
    "usingNumber": 0,
    "visitNum": 549,
    "webAppAttributeLabel": "层次聚类",
    "webAppCategory": "其他",
    "webAppDescription": "关系矩阵通过基于改进模块度的Louvain算法实现层次聚类并通过矩阵进行可视化",
    "webAppIcon": "/webresources/APPicons/relaxOfMatrix_war.png",
    "webAppVersion": "v2.0"
}, {
    "appPath": "/rfid_monitor",
    "running": true,
    "usingNumber": 0,
    "visitNum": 880,
    "webAppIcon": "/webresources/APPicons/rfid_monitor.png"
}, {
    "appPath": "/sop",
    "displayName": "标准操作程序",
    "running": true,
    "usingNumber": 0,
    "visitNum": 12668,
    "webAppAttributeLabel": "制表；工具",
    "webAppCategory": "知识工程",
    "webAppDescription": "将经过不断实践总结出来的，在当前条件下可以实现的最优化的操作程序设计文档化",
    "webAppIcon": "/webresources/APPicons/sop.png",
    "webAppVersion": "v2.0"
}];
var aa = {
    "code": 1, "msg": "成功", "data": [{
        "referID": 1,
        "referName": "DMAIC",
        "nodes": "        [\r\n      {\r\n        \"nodeIndex\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeName\":\"定义\",\r\n        \"nodeDesc\":\"主要方法有：胜任力模型、行为事件访谈（BEIs）、专家小组法、问卷调查法、全方位评价法、专家系统数据库和观察法等。\",\r\n        \"goal\":\"确定员工的知识、技能和素质等方面的关键需求，并识别需求改进的培训项目或培训管理流程，并将改进的内容界定在合理的范围内。\",\r\n        \"stepIndex\": \"ef4d2b1f-9477-4514-b9b5-06ce15b37723\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeName\":\"测量\",\r\n        \"nodeDesc\":\"主要方法有：AFP法、模糊综合评判法、直方图、矩阵数据分析图等。\",\r\n        \"goal\":\"通过对现有培训流程的测量，辨别核心流程和辅助流程；识别影响培训流程输出的输入要素，并对测量系统的有效性作出评价。\",\r\n        \"stepIndex\": \"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeName\":\"分析\",\r\n        \"nodeDesc\":\"主要方法有：鱼骨图、柏拉图、回归分析、因子分析等。\",\r\n        \"goal\":\"通过数据分析，确定影响培训流程输出的关键因素，即确定培训过程的关键影响因素。\",\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeName\":\"改进\",\r\n        \"nodeDesc\":\"主要方法有：流程再造等。\",\r\n        \"goal\":\"寻找优化培训流程并消除或减少关键输入因素影响的方案，使流程的缺陷或变异降低到最小程度。\",\r\n        \"stepIndex\": \"7f445b2e-33bd-4f2c-a802-c29961730b5c\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\",\r\n        \"nodeName\":\"控制\",\r\n        \"nodeDesc\":\"主要方法有：标准化、程序化、制度化等。\",\r\n        \"goal\":\"使改进后的流程程序化，并通过有效的监测手段，确保流程改进的成果。\",\r\n        \"stepIndex\": \"ffd7b67c-9687-4e64-a209-9c38238b39f3\"\r\n      }\r\n    ]",
        "edges": "[\r\n      {\r\n        \"nodeI\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeJ\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\"\r\n      },{\r\n        \"nodeI\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeJ\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\"\r\n      },{\r\n        \"nodeI\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeJ\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\"\r\n      },{\r\n        \"nodeI\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeJ\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\"\r\n      }\r\n    ]",
        "tags": "质量控制;制造业企业;精益生产模式;六西格玛管理;六西格玛",
        "description": "DMAIC是六西格玛管理中流程改善的重要工具。六西格玛管理不仅是理念，同时也是一套业绩突破的方法。它将理念变为行动，将目标变为现实。DMAIC是指定义Define、测量Measure、分析Analyze、改进Improve、控制Control五个阶段构成的过程改进方法，一般用于对现有流程的改进，包括制造过程、服务过程以及工作过程等等。DFSS是Design for Six Sigma的缩写，是指对新流程、新产品的设计方法。\r\n",
        "steps": "[\r\n      {\r\n        \"stepIndex\":\"ef4d2b1f-9477-4514-b9b5-06ce15b37723\",\r\n        \"stepName\": \"定义\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":0\r\n      }, {\r\n        \"stepIndex\":\"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\",\r\n        \"stepName\": \"测量\",\r\n        \"description\": \"描述\",\r\n        \"pos\":1\r\n      }, {\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\",\r\n        \"stepName\": \"分析\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":2\r\n\r\n      }, {\r\n        \"stepIndex\":\"7f445b2e-33bd-4f2c-a802-c29961730b5c\",\r\n        \"stepName\": \"改进\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":3\r\n\r\n      }, {\r\n        \"stepIndex\":\"ffd7b67c-9687-4e64-a209-9c38238b39f3\",\r\n        \"stepName\": \"控制\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":4\r\n\r\n      }\r\n    ]"
    }, {
        "referID": 2,
        "referName": "5S",
        "nodes": "        [\r\n      {\r\n        \"nodeIndex\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeName\":\"整理\",\r\n        \"nodeDesc\":\"区分要与不要的东西，职场除了要用的东西以外，一切都不放置。一个概略的判定原则，是将未来3 0天内，用不着的任何东西都可移出现场。该阶段关键道具红单运动\",\r\n        \"goal\":\"将'空间'腾出来活用\",\r\n        \"stepIndex\": \"ef4d2b1f-9477-4514-b9b5-06ce15b37723\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeName\":\"整顿\",\r\n        \"nodeDesc\":\"要的东西依规定定位、定方法摆放整齐，明确数量，明确标示，既实现“三定”：定名、定量、定位\",\r\n        \"goal\":\"不浪费“时间”找东西\",\r\n        \"stepIndex\": \"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeName\":\"清扫\",\r\n        \"nodeDesc\":\"主要方法有：鱼骨图、柏拉图、回归分析、因子分析等。\",\r\n        \"goal\":\"清除职场内的脏污，并防止污染的发生\",\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeName\":\"清洁\",\r\n        \"nodeDesc\":\"将上面3S实施的做法制度化，规范化，维持其成果\",\r\n        \"goal\":\"通过制度化来维持成果\",\r\n        \"stepIndex\": \"7f445b2e-33bd-4f2c-a802-c29961730b5c\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\",\r\n        \"nodeName\":\"素养\",\r\n        \"nodeDesc\":\"培养文明礼貌习惯，按规定行事，养成良好的工作习惯\",\r\n        \"goal\":\"提升\\\"人的品质\\\"，成为对任何工作都讲究认真的人\",\r\n        \"stepIndex\": \"ffd7b67c-9687-4e64-a209-9c38238b39f3\"\r\n      }\r\n    ]",
        "edges": "[\r\n      {\r\n        \"nodeI\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeJ\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\"\r\n      },{\r\n        \"nodeI\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeJ\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\"\r\n      },{\r\n        \"nodeI\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeJ\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\"\r\n      },{\r\n        \"nodeI\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeJ\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\"\r\n      }\r\n    ]",
        "tags": "现场精益化;管理;经营环境;生产线布局;目视管理;工业工程",
        "description": "“5S”是整理(Seiri)、整顿(Seiton)、清扫(Seiso)、清洁(Seiketsu)和素养(Shitsuke)这5个词的缩写5S起源于日本，是指在生产现场对人员、机器、材料、方法等生产要素进行有效管理，这是日本企业独特的一种管理办法。",
        "steps": "[\r\n      {\r\n        \"stepIndex\":\"ef4d2b1f-9477-4514-b9b5-06ce15b37723\",\r\n        \"stepName\": \"整理\",\r\n        \"stepDesc\": \"区分要与不要的东西，职场除了要用的东西以外，一切都不放置。一个概略的判定原则，是将未来3 0天内，用不着的任何东西都可移出现场。该阶段关键道具红单运动\",\r\n        \"pos\":0\r\n      }, {\r\n        \"stepIndex\":\"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\",\r\n        \"stepName\": \"整顿\",\r\n        \"description\": \"要的东西依规定定位、定方法摆放整齐，明确数量，明确标示，既实现“三定”：定名、定量、定位\",\r\n        \"pos\":1\r\n      }, {\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-5s05da68189a2\",\r\n        \"stepName\": \"清扫\",\r\n        \"stepDesc\": \"清除职场内的脏污，并防止污染的发生\",\r\n        \"pos\":2\r\n\r\n      }, {\r\n        \"stepIndex\":\"7f445b2e-33bd-4f2c-a802-c29961730b5c\",\r\n        \"stepName\": \"清洁\",\r\n        \"stepDesc\": \"将上面3S实施的做法制度化，规范化，维持其成果\",\r\n        \"pos\":3\r\n\r\n      }, {\r\n        \"stepIndex\":\"ffd7b67c-9687-4e64-a209-9c38238b39f3\",\r\n        \"stepName\": \"素养\",\r\n        \"stepDesc\": \"培养文明礼貌习惯，按规定行事，养成良好的工作习惯\",\r\n        \"pos\":4\r\n\r\n      }\r\n    ]\r\n"
    }, {
        "referID": 3,
        "referName": "VSM",
        "nodes": "        [\r\n      {\r\n        \"nodeIndex\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeName\":\"价值流选择\",\r\n        \"nodeDesc\":\"主要方法有：P-Q分析、P-R分析等。\",\r\n        \"goal\":\"主要是选择价值流分析的对象。若产量需求较高，则可利用产品-产量分析（P-Q分析）从众多产品中选择产量较高的分析对象来进行价值流映射。\",\r\n        \"stepIndex\": \"ef4d2b1f-9477-4514-b9b5-06ce15b37723\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeName\":\"现状评定\",\r\n        \"nodeDesc\":\"主要方法有：数据统计、价值流图、价值流成熟度评定等。\",\r\n        \"goal\":\"收集所选价值流的相关数据并绘制当前价值流图，综合评定当前价值流所处的成熟度等级，作为精益改进的出发点。\",\r\n        \"stepIndex\": \"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeName\":\"设计规划\",\r\n        \"nodeDesc\":\"主要方法有：雷达图、价值流图、精益改进计划等。\",\r\n        \"goal\":\"以更高等级的成熟度为导向进行未来价值流规划。利用雷达图将成熟度各维度的距离可视化，通过改进空间的识别可发现当前价值流中存在的系列难题。\",\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeName\":\"实施改进\",\r\n        \"nodeDesc\":\"主要方法有：生产线平衡、SMED、5S、SOP等。\",\r\n        \"goal\":\"按照精益改进计划有序进行改善。\",\r\n        \"stepIndex\": \"7f445b2e-33bd-4f2c-a802-c29961730b5c\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\",\r\n        \"nodeName\":\"调整确认\",\r\n        \"nodeDesc\":\"主要方法有：数据统计、成熟度评估等。\",\r\n        \"goal\":\"调整确认环节重新对价值流成熟度进行评定，确认是否满足预定成熟度目标。如果未达到目标则进入价值改善小循环即重新识别瓶颈维度进行持续改善；否则寻找新的价值流分析对象进行改进。\",\r\n        \"stepIndex\": \"ffd7b67c-9687-4e64-a209-9c38238b39f3\"\r\n      }\r\n    ]",
        "edges": "[\r\n      {\r\n        \"nodeI\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeJ\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\"\r\n      },{\r\n        \"nodeI\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeJ\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\"\r\n      },{\r\n        \"nodeI\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeJ\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\"\r\n      },{\r\n        \"nodeI\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeJ\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\"\r\n      }\r\n    ]",
        "tags": "精益生产技术;信息流;成本控制;工作流程;生产管理;价值流图",
        "description": "价值流分析（VSM）是精益改善的重要工具之一。其本质是确定当前与未来两种状态，在评定当前状态的基础上确定改进空间，经过实施精益策略以期达到未来状态的一种生产改善方法。按照价值流选择（Select, S）、现状评定（Investigate, I）、设计规划（Design, D）、实施改进（Execute, E）、调整确认（Adjust, A）的改善流程，以价值流成熟度为驱动，实现当前价值流到未来价值流的状态演变。",
        "steps": "[\r\n      {\r\n        \"stepIndex\":\"ef4d2b1f-9477-4514-b9b5-06ce15b37723\",\r\n        \"stepName\": \"价值流选择\",\r\n        \"stepDesc\": \"主要方法有：P-Q分析、P-R分析等。\",\r\n        \"pos\":0\r\n      }, {\r\n        \"stepIndex\":\"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\",\r\n        \"stepName\": \"现状评定\",\r\n        \"description\": \"主要方法有：数据统计、价值流图、价值流成熟度评定等。\",\r\n        \"pos\":1\r\n      }, {\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\",\r\n        \"stepName\": \"设计规划\",\r\n        \"stepDesc\": \"主要方法有：雷达图、价值流图、精益改进计划等。\",\r\n        \"pos\":2\r\n\r\n      }, {\r\n        \"stepIndex\":\"7f445b2e-33bd-4f2c-a802-c29961730b5c\",\r\n        \"stepName\": \"实施改进\",\r\n        \"stepDesc\": \"主要方法有：生产线平衡、SMED、5S、SOP等。\",\r\n        \"pos\":3\r\n\r\n      }, {\r\n        \"stepIndex\":\"ffd7b67c-9687-4e64-a209-9c38238b39f3\",\r\n        \"stepName\": \"调整确认\",\r\n        \"stepDesc\": \"主要方法有：数据统计、成熟度评估等。\",\r\n        \"pos\":4\r\n\r\n      }\r\n    ]"
    }, {
        "referID": 4,
        "referName": "价值工程流模型PAID",
        "nodes": "        [\r\n      {\r\n        \"nodeIndex\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeName\":\"准备（P）\",\r\n        \"nodeDesc\":\"主要方法有：关键质量特性CTQ、SIPOC图、顾客之声VOC、Kano分析、Pareto图、甘特图、SWOT分析、需求分析等。\",\r\n        \"goal\":\"根据客观需要，选择VE法对象并明确目标、限制条件和分析范围；主要步骤有：问题描述（1.什么问题？2.哪里有问题？3.有多严重）、目标表达（1.有何要求？2.达到什么功能？3.降低多少成本？）、组织准备（1.组建团队 2.制定行动计划）、明确范围（1.哪些能改？2.哪些不能改）、制定计划（1.执行人？2.执行日期？3.工作目标）。\",\r\n        \"stepIndex\": \"ef4d2b1f-9477-4514-b9b5-06ce15b37723\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeName\":\"分析（A）\",\r\n        \"nodeDesc\":\"主要方法有：功能分析、ABC方法、强制决定法、抽样调查、系统图、Pareto图、最合适区域法、成本过程等。\",\r\n        \"goal\":\"通过整理分析信息资料，确定改进的方向，即确定高成本的零件和高成本的功能；步骤如下：1.计算最低成本（团队收集与对象有关的一切信息资料、量化确定成本）、2.系统功能划分（用动词和名称组合表达功能、绘制功能系统图）、3.功能成本分析（量化成本、计算各对象成本、根据计算确定改进方向）。\",\r\n        \"stepIndex\": \"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeName\":\"创新（I）\",\r\n        \"nodeDesc\":\"主要方法有：正交试验、TRIZ、矛盾矩阵、替代分析、RACI改进、DMADV、鲁棒性设计、优先级矩阵等。\",\r\n        \"goal\":\"通过创造性的思维和活动，针对A阶段分析出的零件和功能，借助创新方法与工具，提出各种不同的实现创新的改进方案；主要有TRIZ、六西格玛、系统工程、工业工程、设计方法学、服务工程、知识工程、商务模式分析、统计分析等。\",\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\"\r\n      },\r\n      {\r\n        \"nodeIndex\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeName\":\"实施（D）\",\r\n        \"nodeDesc\":\"主要方法有：执行。\",\r\n        \"goal\":\"1.审批（程序性、合规性、减少错误）、2.实施及检查（是否有效执行、及时发现问题）、3.成果鉴定及推广（方案效果、可推广性评价）。\",\r\n          ]",
        "edges": "[\r\n      {\r\n        \"nodeI\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeJ\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\"\r\n      },{\r\n        \"nodeI\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeJ\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\"\r\n      },{\r\n        \"nodeI\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeJ\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\"\r\n      },{\r\n        \"nodeI\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n        \"nodeJ\":\"c317edc5-ccd4-4ca8-a669-ff0b5d38b861\"\r\n      }\r\n    ]",
        "tags": "产品开发;创新设计;DMADV;六西格玛;TRIZ；价值工程",
        "description": "价值工程最早来源于美国通用工程师麦尔斯为应对市场变化通过“替代法”将一种防火纸替代原石棉板原料，使其成本降为原来的四分之一。麦尔斯将这种“替代法”归纳为“功能本质原理”，即顾客需要的是产品的功能而非产品本身，相应的推出“功能载体的替代性法则”，即同一种功能可以由不同的载体来实现，因此具有同样功能的载体就可以相互替代。\r\n",
        "steps": "[\r\n      {\r\n        \"stepIndex\":\"ef4d2b1f-9477-4514-b9b5-06ce15b37723\",\r\n        \"stepName\": \"定义\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":0\r\n      }, {\r\n        \"stepIndex\":\"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\",\r\n        \"stepName\": \"测量\",\r\n        \"description\": \"描述\",\r\n        \"pos\":1\r\n      }, {\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\",\r\n        \"stepName\": \"分析\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":2\r\n\r\n      }, {\r\n        \"stepIndex\":\"7f445b2e-33bd-4f2c-a802-c29961730b5c\",\r\n        \"stepName\": \"改进\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":3\r\n\r\n      }, {\r\n        \"stepIndex\":\"ffd7b67c-9687-4e64-a209-9c38238b39f3\",\r\n        \"stepName\": \"控制\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":4\r\n\r\n      }\r\n    ]"
    }, {
        "referID": 5,
        "referName": "DAOV",
        "nodes": "[\r\n    {\r\n      \"nodeIndex\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n      \"nodeName\":\"定义阶段\",\r\n      \"nodeDesc\":\"主要方法有：关键质量特性CTQ、SIPOC图、顾客之声VOC、Kano分析、Pareto图、甘特图、SWOT分析、需求分析等。\",\r\n      \"goal\":\"确定改进目标；明确改进流程\",\r\n      \"stepIndex\": \"ef4d2b1f-9477-4514-b9b5-06ce15b37723\"\r\n    },\r\n    {\r\n      \"nodeIndex\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n      \"nodeName\":\"分析阶段\",\r\n      \"nodeDesc\":\"从成本功能和知识方面进行分析\",\r\n      \"stepIndex\": \"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\"\r\n    },\r\n    {\r\n      \"nodeIndex\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n      \"nodeName\":\"优化阶段\",\r\n      \"nodeDesc\":\"主要方法有：正交试验、TRIZ、矛盾矩阵、替代分析、RACI改进、DMADV、鲁棒性设计、优先级矩阵等。\",\r\n      \"goal\":\"确定概念和选择方案\",\r\n      \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\"\r\n    },\r\n    {\r\n      \"nodeIndex\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\",\r\n      \"nodeName\":\"验证阶段\",\r\n      \"nodeDesc\":\"实验验证和结果评估\",\r\n      \"goal\":\"1.审批（程序性、合规性、减少错误）、2.实施及检查（是否有效执行、及时发现问题）、3.成果鉴定及推广（方案效果、可推广性评价）。\",\r\n        \r\n    }]\r\n",
        "edges": "\r\n    [\r\n      {\r\n        \"nodeI\":\"6cb5449a-fb8f-40f2-944a-5015e5b00ac2\",\r\n        \"nodeJ\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\"\r\n      },{\r\n        \"nodeI\":\"558d235a-09d2-4446-986b-bc0dbe8fd9b3\",\r\n        \"nodeJ\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\"\r\n      },{\r\n        \"nodeI\":\"279ca654-b4de-48c0-9a12-e97dfcadbaa1\",\r\n        \"nodeJ\":\"196079c5-d1e0-4ae6-aa24-4c9e8aa1201c\"\r\n      }\r\n    ]",
        "tags": "产品开发;创新设计;DMADV;六西格玛;TRIZ；价值工程",
        "description": "价值工程最早来源于美国通用工程师麦尔斯为应对市场变化通过“替代法”将一种防火纸替代原石棉板原料，使其成本降为原来的四分之一。麦尔斯将这种“替代法”归纳为“功能本质原理”，即顾客需要的是产品的功能而非产品本身，相应的推出“功能载体的替代性法则”，即同一种功能可以由不同的载体来实现，因此具有同样功能的载体就可以相互替代。\r\n",
        "steps": "        [\r\n      {\r\n        \"stepIndex\":\"ef4d2b1f-9477-4514-b9b5-06ce15b37723\",\r\n        \"stepName\": \"定义阶段\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":0\r\n      }, {\r\n        \"stepIndex\":\"f7bc0dfa-05dc-4fd6-b2e1-68bd4f4fcd45\",\r\n        \"stepName\": \"分析阶段\",\r\n        \"description\": \"描述\",\r\n        \"pos\":1\r\n      }, {\r\n        \"stepIndex\":\"592921b1-97fb-4c94-bc39-505da68189a2\",\r\n        \"stepName\": \"优化阶段\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":2\r\n\r\n      }, {\r\n        \"stepIndex\":\"7f445b2e-33bd-4f2c-a802-c29961730b5c\",\r\n        \"stepName\": \"验证阶段\",\r\n        \"stepDesc\": \"描述\",\r\n        \"pos\":3\r\n      }\r\n    ]\r\n"
    }]
};