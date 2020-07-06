var websocket = null;
var host = document.location.host;
var target;
var chat;
var identity = "0";
var groupName = "";
var parent=0;
//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    $.ajax({
        url: '/webresources/user/login',
        mehtod: 'get',
        async: false,
        success: function (data) {
            // username = JSON.parse(data.content).nickName;
            username =data.content.nickName
        }
    });
    websocket = new WebSocket('ws://' + host + '/InnovationCollectiveToolKits/Controller/webSocket/' + username);
}
//连接发生错误的回调方法
websocket.onerror = function () {
    alert("WebSocket连接发生错误");
};


//连接成功建立的回调方法
websocket.onopen = function () {
    console.log(username + "页面连接成功");
};

//接收到消息的回调方法
websocket.onmessage = function (event) {
    console.log(username + "接受到数据为：" + event.data);
    var temp = JSON.parse(event.data);
    loadHistory(temp.chat);
    target = temp.members.join('-');
    chat = temp.chat + "";
    identity = temp.identity + "";

    if (temp.members.length === 2) {//加载聊天名称
        console.log(12456)
        $('#chatId').text(temp.user);
    } else {//加载群聊名称
        groupName = temp.groupName;
        $('#chatId').text(temp.groupName);
    }
    $(".scroll-content").scrollTop($(".scroll-content")[0].scrollHeight);
};

//连接关闭的回调方法
websocket.onclose = function () {
    console.log("WebSocket连接关闭");
};

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    closeWebSocket();
};

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}