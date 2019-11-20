<%@page contentType="text/html;charset=UTF-8" %>
<html>
<script>
    var username = "liaoxiaoqiang";
</script>
<script src="../webresources/ace-master/assets/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="WebSocket.js"></script>
<body>
<h2>Hello World!</h2>
<button onclick="checkUser('A')">A用户</button>
<button onclick="checkUser('B')">B用户</button>
<br/>
<input type="text" id="index"/>
<button onclick="test()">发送</button>
<br/>
接受到的消息：<textarea  id="demo">demo</textarea>
</body>

</html>