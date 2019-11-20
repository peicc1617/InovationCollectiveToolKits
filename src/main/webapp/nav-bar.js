function initNavbarView() {
    USERINFO = JSON.parse(getCookie('CAI_USER_INFO'));
    let userDom;
    if(USERINFO==null||USERINFO==undefined){
        USERINFO = {};
        isLogin = false;
        USERINFO['nickName']="游客";
        userDom = [{
            tag: 'li',
            children: [{
                tag: 'a',
                attr: {href: '/webresources/userLogin.jsp'},
                children: [{tag: 'i', attr: {class: 'ace-icon fa fa-key'}}],
                innerText: '登录'
            }]
        },{
            tag: 'li',
            children: [{
                tag: 'a',
                attr: {href: '/webresources/userRegister.jsp'},
                children: [{tag: 'i', attr: {class: 'ace-icon fa fa-laptop'}}],
                innerText: '注册'
            }]
        }];
    }else {
        isLogin = true;
        userDom =  [{
            tag: 'li',
            children: [{
                tag: 'a',
                attr: {href: '/user/'+USERINFO.username,id:'user-index-link'},
                children: [{tag: 'i', attr: {class: 'ace-icon fa fa-user'}}],
                innerText: '个人首页'
            }]
        },{
            tag: 'li',
            children: [{
                tag: 'a',
                attr: {onclick:'javascript:userLogout()'},
                children: [{tag: 'i', attr: {class: 'ace-icon fa fa-power-off'}}],
                innerText: '退出'
            }]
        }];
    }
    const dataJson = {
        tag: 'div',
        attr: {
            class: 'navbar-container ace-save-state',
            id: 'navbar-container',
        },
        children: [{
            tag: 'button',
            attr: {
                type: 'button',
                class: 'navbar-toggle menu-toggler pull-left',
                id: 'menu-toggler',
                'data-target': '#sidebar',
            },
            children: [{tag: 'span', attr: {class: 'sr-only', innerText: 'Toggle sidebar'}},
                {tag: 'span', attr: {class: 'icon-bar'}},
                {tag: 'span', attr: {class: 'icon-bar'}},
                {tag: 'span', attr: {class: 'icon-bar'}}],
        }, {
            tag: 'div',
            attr: {
                class: 'navbar-header pull-left'
            },
            children: [{
                tag: 'a',
                attr: {href: '#', class: 'navbar-brand'},
                children: [{
                    tag: 'small',
                    children: [{
                        tag: 'i',
                        attr: {class: 'fa fa-leaf'},
                        innerText: '小微企业多创新方法融合与集成应用平台'
                    }]
                }]
            }, {
                tag: 'a',
                attr: {href: '#', class: 'navbar-brand'},
                children: [{
                    tag: 'small',
                    children: [{
                        tag: 'i',
                        children: [{tag: 'small', innerText: document.title}]
                    }]
                }]
            }]
        }, {
            tag: 'div',
            attr: {
                class: 'navbar-buttons navbar-header pull-right',
                role: 'navigation'
            },
            children: [
                {
                tag: 'ul',
                attr: {
                    class: 'nav ace-nav',
                },
                children: [
                //     {
                //     tag: 'li',
                //     attr: {class: 'grey dropdown-modal'},
                //     children: [{
                //         tag: 'a',
                //         attr: {
                //             class: 'dropdown-toggle',
                //             'data-toggle': 'dropdown',
                //             href: '#',
                //             'aria-expanded': 'true'
                //         },
                //         children: [{
                //             tag: 'i',
                //             attr: {class: 'ace-icon fa fa-tasks'}
                //         }, {
                //             tag: 'span',
                //             innerText: '导航'
                //         }]
                //     }, {
                //         tag: 'ul',
                //         attr: {class: 'dropdown-menu-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close'},
                //         children: [{
                //             tag: 'li',
                //             attr: {class: 'dropdown-header'},
                //             children: [{
                //                 tag: 'i',
                //                 attr: {class: 'ace-icon fa fa-check'},
                //                 innerText: '平台功能导航'
                //             }]
                //         }, {
                //             tag: 'li',
                //             attr: {class: 'dropdown-content ace-scroll', style: 'position: relative;'},
                //             children: [{
                //                 tag: 'ul',
                //                 attr: {class: 'dropdown-menu dropdown-navbar'},
                //                 children: [{
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: '首页'}]
                //                         }]
                //                     }]
                //                 }, {
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: 'LCUE'}]
                //                         }]
                //                     }]
                //                 }, {
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: '柔性模板'}]
                //                         }]
                //                     }]
                //                 }, {
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: '应用商店'}]
                //                         }]
                //                     }]
                //                 }, {
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: '知识服务'}]
                //                         }]
                //                     }]
                //                 }, {
                //                     tag: 'li',
                //                     children: [{
                //                         tag: 'a',
                //                         attr: {href: '#'},
                //                         children: [{
                //                             tag: 'div',
                //                             attr: {class: 'clearfix'},
                //                             children: [{tag: 'span', attr: {class: 'pull-left'}, innerText: '培训'}]
                //                         }]
                //                     }]
                //                 }]
                //             }]
                //         }]
                //     }]
                // },
                {
                    tag:'li',
                    attr:{
                        class:'blue'
                    },
                    children:[{
                        tag: 'a',
                        attr:{
                            href:'#',
                        },
                        innerText:'LCUE'
                    }]
                },{
                    tag:'li',
                    attr:{
                        class:'blue'
                    },
                    children:[{
                        tag: 'a',
                        attr:{
                            href:'#',
                        },
                        innerText:'模板'
                    }]
                },{
                    tag:'li',
                    attr:{
                        class:'blue'
                    },
                    children:[{
                        tag: 'a',
                        attr:{
                            href:'#',
                        },
                        innerText:'应用商店'
                    }]
                },{
                    tag:'li',
                    attr:{
                        class:'blue'
                    },
                    children:[{
                        tag: 'a',
                        attr:{
                            href:'#',
                        },
                        innerText:'培训'
                    }]
                },{
                    tag:'li',
                    attr:{
                        class:'blue'
                    },
                    children:[{
                        tag: 'a',
                        attr:{
                            href:'#',
                        },
                        innerText:'知识服务'
                    }]
                }, {
                    tag: 'li',
                    attr: {class: 'light-blue dropdown-modal'},
                    children: [{
                        tag: 'a',
                        attr: {
                            'data-toggle': 'dropdown',
                            'href': '#',
                            'class': 'dropdown-toggle'
                        },
                        children: [{
                            tag: 'img',
                            attr: {
                                class: 'nav-user-photo',
                                src: '/webresources/ace-master/assets/images/avatars/user.jpg',
                                alt: 'Jason\'s Photo'
                            },
                        }, {
                            tag: 'span',
                            attr: {class: 'user-info'},
                            children: [{tag: 'small', innerText: '欢迎光临'}],
                            innerText:USERINFO['nickName']
                        }, {
                            tag: 'i',
                            attr: {class: 'ace-icon fa fa-caret-down'}
                        }]
                    }, {
                        tag: 'ul',
                        attr: {class: 'user-menu dropdown-menu-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close"'},
                        children:userDom
                    }]
                },]
            }]
        }]

    }
    let body = document.getElementsByTagName('body')[0];
    
    let navbar = document.createElement("div");
    navbar.setAttribute("id","navbar");
    navbar.setAttribute("class","navbar navbar-default ace-save-state navbar-fixed-top");
    navbar.appendChild(createEl(dataJson));
    //获取用户名
    body.appendChild(navbar);
}

function createEl(dataObj) {
    let e = document.createElement(dataObj.tag);
    if (dataObj.attr) {
        for (let x in dataObj.attr) {
            e.setAttribute(x, dataObj.attr[x]);
        }
    }
    if (dataObj.children && dataObj.children.length > 0) {
        dataObj.children.forEach(child => e.appendChild(createEl(child)));
    }
    if (dataObj.innerText) {
        e.appendChild(document.createTextNode(dataObj.innerText))
    }
    return e;

}
/**
 * 用户退出
 */
function userLogout(){
    fetch('/webresources/user/logout')
    .then(data =>  location.reload(true))
    .catch(error => console.log('error is', error));
}

function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return decodeURIComponent(arr[2]);
    }else{
        return null;
    }
}
initNavbarView();

