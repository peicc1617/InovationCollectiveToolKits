<%@page contentType="text/html;charset=UTF-8" %>
<html>
<script>
    var username = "B";
</script>
<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="WebSocket.js"></script>
<body>
<h2>Hello World!</h2>
<button onclick="checkUser('A')">A用户</button>
<button onclick="checkUser('liaoxiaoqiang')">liaoxiaoqiang</button>
<br/>
<input type="text" id="index"/>
<button onclick="test()">发送</button>
<br/>
接受到的消息：<textarea  id="demo">demo</textarea>
</body>

</html>