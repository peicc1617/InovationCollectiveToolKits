var projectId = 0;

function saveProject() {
    if (projectId === 0||parseInt(identity)===0) {
        alert("无法保存数据，请重新按照规范操作");
    } else {
        $('#getXML').trigger("click");
        $.ajax({
            type: "post",
            url: "Service",
            async: false,
            data: {
                "chat": chat,
                "type": "addBomdataByChat",
                "databom":mxgraphData
            },
            success: function () {
                alert("数据保存成功");
            }
        });
    }
}