function gotoLogin() {
    this.location = "http://" + location.host + "/webresources/userLogin.jsp";
}

function logout() {
    $.ajax({
        url: '/webresources/user/logout',
        type: 'get',
        success: function (data) {
            location.reload(true);
        }
    })
}

//获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/webresources/user/login',
        mehtod: 'get',
        async: false,
        success: function (data) {
            if (data.state === false) {//匿名用户
                $("#userName").html("游客");
                $("#userDropDown").html('<li><a href="#" onclick="gotoLogin()"><i class="icon-key"></i>登录</a></li><li><a href="#" onclick="gotoRegister()"><i class="icon-plus"></i>注册</a></li>');
            } else if (data.state === true) {//登录用户
                username=data.content;
                $("#userName").html(data.content);
                $("#userDropDown").html(' <li><a href="#" onclick="gotoUserInfo()"><i class="icon-user"></i> 个人资料</a></li><li class="divider"></li><li><a href="#" onclick="logout()" style="cursor:pointer;"><i class="icon-off"></i> 退出</a></li>');
            }
        }
    })
}