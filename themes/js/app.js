/* 新的写法 */
var goWin = function (id, urls, title) {
    mui.openWindow({
        url: urls,
        id: id,
        styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
            bounce: 'vertical',
            titleNView: { // 窗口的标题栏控件
                homeButton: false, //可取值： "true" - 显示Home按钮； "false" - 不显示Home按钮。 默认值为"false"。 Home按钮的颜色为窗口标题文字颜色，按下时颜色自动调整透明度为0.3。 点击Home按钮的逻辑为关闭所有非首页窗口，显示首页窗口。
                autoBackButton: true,
                titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
                titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
                titleSize: "16px", // 字体大小,默认17px
                backgroundColor: "#FF6D6F", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
                /*progress: { // 标题栏控件的进度条样式
                	color: "#00FF00", // 进度条颜色,默认值为"#00FF00"  
                	height: "2px" // 进度条高度,默认值为"2px"         
                },*/
                splitLine: { // 标题栏控件的底部分割线，类似borderBottom
                    color: "#FF6D6F", // 分割线颜色,默认值为"#CCCCCC"  
                    height: "1px" // 分割线高度,默认值为"2px"
                },
                type: 'default'
            }
        },
        show: {
            event: "loaded",
            aniShow: 'pop-in',
        },
        waiting: {
            autoShow: false
        }
    }, {

    });
}
/*
 * 打开一个新窗口，右侧带图标的
 * id=窗口的ID
 * urls=路径
 * title=原生标题中间的字
 * callFun=右上角按钮点击回调方法
 * iconcode=右上角自定义按钮的unicode字符表示必须'\u'开头，如"\ue123"（注意不能写成"\e123"）。
 * */
var goWinRbtn = function (id, urls, title, callFun, iconcode) {
    mui.openWindow({
        url: urls,
        id: id,
        bottomBorderColor: "#cccccc", //底部边线颜色
        styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
            bounce: 'vertical',
            titleNView: { // 窗口的标题栏控件
                homeButton: false, //可取值： "true" - 显示Home按钮； "false" - 不显示Home按钮。 默认值为"false"。 Home按钮的颜色为窗口标题文字颜色，按下时颜色自动调整透明度为0.3。 点击Home按钮的逻辑为关闭所有非首页窗口，显示首页窗口。
                autoBackButton: true,
                titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
                titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
                titleSize: "16px", // 字体大小,默认17px
                backgroundColor: "#FF6D6F", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
                /*progress: { // 标题栏控件的进度条样式
                	color: "#00FF00", // 进度条颜色,默认值为"#00FF00"  
                	height: "2px" // 进度条高度,默认值为"2px"         
                },*/
                splitLine: { // 标题栏控件的底部分割线，类似borderBottom
                    color: "#FF6D6F", // 分割线颜色,默认值为"#CCCCCC"  
                    height: "1px" // 分割线高度,默认值为"2px"
                },
                type: 'default', //可取值： "default" - 默认样式，顶部停靠显示，挤压Webview页面内容显示区域； "transparent" - 透明样式，顶部沉浸式显示覆盖Webview页面内容，标题栏上内容（除按钮外）全部透明，当页面滚动时透明度逐渐变化，直到不透明显示。 默认值为"default"。
                buttons: [{
                    text: iconcode, //跳转过去一直显示X，显示不出图标
                    color: "#ffffff",
                    fontSize: '24px',
                    float: 'right',
                    fontSrc: "themes/fonts/mui.ttf",
                    onclick: function () {
                        callFun();
                    }
                }]
            }
        },
        show: {
            event: "loaded",
            aniShow: 'pop-in'
        },
        waiting: {
            autoShow: false
        }
    }, {

    });
}
/**
 * 获得存储在本地的json
 * @param {key} key : 键
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 * @param {JSON} ws : Webview窗口属性
 */
function GetSession(key) {
    var obj = localStorage.getItem(key);
    if (obj != null) {
        return JSON.parse(obj);
    }
    return null;
}
/**
 * 保存存储在本地的json
 * @param {key} key : 键
 * @param {options} json : 保存的参数
 */
function SetSession(key, options) {
    localStorage.setItem(key, JSON.stringify(options));
}

/**
 * 删除键值对json
 * @param {key} key : 键
 */
function SessionRemove(key) {
    localStorage.removeItem(key);
}

function log(data) {
    console.log(JSON.stringify(data));
}

var httpUrl = "http://api.zihenggj.com/",
    natiopen = null,
    nodata = '没有数据了',
    timeouts = 20000; //超时请求时间为10秒
(function (w) {
    //公共ajax方法
    w.baseAjax = function (url, options, callFun) {
        //var data = getdata(options, 'com.feiyit.yl.gcomment');
        mui.ajax(httpUrl + url, {
            data: options,
            async: true,
            crossDomain: true,
            dataType: 'json', //服务器返回json格式数据
            type: 'post', //HTTP请求类型
            timeout: timeouts, //超时时间设置为10秒；
            success: function (data) {
                callFun(data);
            },
            error: function (xhr, type, errorThrown) {
                if (type == 'timeout') {
                    mui.toast('连接超时，请稍后重试！');
                } else if (type == 'error') {
                    mui.toast('连接异常，请稍后重试！');
                }
                app.loadClose();
            }
        });
    }
})(window);

var app = {
    loading: function (msg) {
        $("body").append(
            '<div class="loading-cover"></div><div class="load-container load"><div class="loader">Loading...</div></div>'
        );
        $('body').bind('touchmove', function (event) {
            if (event.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!event.defaultPrevented) {
                    event.preventDefault();
                }
            }
        })
    },
    loadClose: function () {
        $(".loading-cover,.load-container").remove();
        $('body').unbind('touchmove');
    }
}

var rightClose = function (parview) {
    //获得父窗口ID
    var pws = plus.webview.getWebviewById(parview);
    //获取当前窗口
    var ws = plus.webview.currentWebview();
    //监听当前侧滑窗口的右滑
    ws.drag({
        direction: 'right',
        moveMode: 'followFinger'
    }, {
        view: pws.id,
        moveMode: 'silent'
    }, function (e) {
        //滑动到end执行mui.back()事件
        if (e.type == 'end' && e.result) {
            mui.back();
        }
    });
}


function getDateDiff(dateStr) {
    var timestamp = Date.parse(dateStr);
    var publishTime = timestamp / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,

        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
        return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
        if (d_seconds <= 0) {
            return '刚刚';
        } else {
            return d_seconds + '秒前';
        }
    } else if (d_days >= 3 && d_days < 30) {
        return M + '-' + D + ' ' + H + ':' + m;
    } else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
    }
}

function getScrollTop() {　　
    var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;　　
    if (document.body) {　　　　
        bodyScrollTop = document.body.scrollTop;　　
    }　　
    if (document.documentElement) {　　　　
        documentScrollTop = document.documentElement.scrollTop;　　
    }　　
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;　　
    return scrollTop;
}

function getScrollHeight() {　　
    var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;　　
    if (document.body) {　　　　
        bodyScrollHeight = document.body.scrollHeight;　　
    }　　
    if (document.documentElement) {　　　　
        documentScrollHeight = document.documentElement.scrollHeight;　　
    }　　
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;　　
    return scrollHeight;
}

function getWindowHeight() {　　
    var windowHeight = 0;　　
    if (document.compatMode == "CSS1Compat") {　　　　
        windowHeight = document.documentElement.clientHeight;　　
    } else {　　　　
        windowHeight = document.body.clientHeight;　　
    }　　
    return windowHeight;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}

//网络内容
function isNetWork() {
    var NetStateStr = '未知';
    var types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
    types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
    types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
    types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
    types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
    NetStateStr = types[plus.networkinfo.getCurrentType()];
    return (NetStateStr === "未知") || (NetStateStr === "未连接网络") ? false : true;
}
mui.plusReady(function () {
		if(!isNetWork()){
			mui.toast('没有网络~');
		}
});
