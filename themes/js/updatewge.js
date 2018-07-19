var wgtVer=null;
function plusReady(){	
	// 获取本地应用资源版本号
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
		wgtVer=inf.version;
		var islogin = GetSession('$LoginUser');
		if(islogin != null) {
			//每次进入主页查看是否有最新的资源文件更新提醒
			checkUpdate();
		}	
		//console.log("当前应用版本："+wgtVer);
	});
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}
// 检测更新
var checkUrl=httpUrl+"app/api/user/version";
function checkUpdate(){
	plus.nativeUI.showWaiting("检测更新...");
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
			plus.nativeUI.closeWaiting();
			if(xhr.status==200){
				var res=xhr.responseText;
				var myjson=eval("(" + res + ")");
				//判断系统是ios还是安卓
				if(plus.os.name=="Android"){
					var newVer=myjson.data[0].androidVersion;
					console.log('aaaaaa'+wgtVer+'-----'+newVer);
					if(wgtVer&&newVer&&(wgtVer!=newVer)){
						if(!myjson.data[0].androidFile){
							mui.toast('更新文件为空！');
						}else{
							console.log('11111111111');
							wgtUrl=myjson.data[0].androidFile;
							downWgt();	// 下载升级包
						}						
					}else{
						//plus.nativeUI.alert("无新版本可更新！");
					}
				}else{
					//如果是ios 判断是否开启审核开关  0=不审核   1=审核  审核过程中，不检测更新
					if(myjson.data[0].iosAudit==0){
						//更新文件
						var newVer=myjson.data[0].iosVersion;
						if(wgtVer&&newVer&&(wgtVer!=newVer)){
							if(!myjson.data[0].iosFile){
								mui.toast('更新文件为空！');
							}else{
								wgtUrl=myjson.data[0].iosFile;
								downWgt();	// 下载升级包
							}
							
						}else{
							//plus.nativeUI.alert("无新版本可更新！");
						}
					}
				}		
				
			}else{
				//console.log("检测更新失败！");
				plus.nativeUI.alert("检测更新失败！");
			}
			break;
			default:
			break;
		}
	}
	xhr.open('POST',checkUrl);
	xhr.send();
};

// 下载wgt文件
var wgtUrl="";
function downWgt(){
	console.log(wgtUrl);
	plus.nativeUI.showWaiting("下载升级文件...");
	plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
		if ( status == 200 ) { 
			//console.log("下载wgt成功："+d.filename);
			installWgt(d.filename);	// 安装wgt包
		} else {
			//console.log("下载wgt失败！");
			plus.nativeUI.alert("下载升级失败！");
		}
		plus.nativeUI.closeWaiting();
	}).start();
};

// 更新应用资源
function installWgt(path){
	plus.nativeUI.showWaiting("安装升级文件...");
	plus.runtime.install(path,{},function(){
		plus.nativeUI.closeWaiting();
		//console.log("安装wgt文件成功！");
		plus.nativeUI.alert("应用资源更新完成！",function(){
			plus.runtime.restart();
		});
	},function(e){
		plus.nativeUI.closeWaiting();
		//console.log("安装wgt文件失败["+e.code+"]："+e.message);
		plus.nativeUI.alert("安装升级文件失败["+e.code+"]："+e.message);
	});
}