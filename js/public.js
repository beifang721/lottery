	//获取url参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}	
	var userid = '';//用户id
	var pwdcode = '';//用户pwdcode
	userid = GetQueryString("userid");
	if (GetQueryString("pwdcode")) {
		pwdcode = GetQueryString("pwdcode");
	} 
	//ajax封装
	var ajxs = function (url,data,async,successfn,loadfnn){
		$.ajax({
			type:"post",
			url:url,
			cache:false,
			data:data,
			async: async, 
			contentType:"Application/Json",
			dataType: 'json',
			success:function(d) {
				successfn(d)
			},
			beforeSend:function(){
				loadfnn;
			},
			error:function (xhr){
				//alert("服务器请求超时")
			}
		});
	}
	
	var test_or_formal = false;//true==正式服务  false==测试服务
	var token = '';//定义token
	var url_api = '';//定义接口变量
	var location_href = '';//定义跳转链接
	var prizeid_imgArr = [];//奖品id对应的图片
	function tokenfn(){ 
		if (test_or_formal) {//正式
		} else{//测试
			token ="jhfkkhfkjJKLHLKKJHdbahhdJHGKJHGJHlljlkk57867";
			url_api ="http://test.api.huanbay.com/";
			location_href = "http://test.html.huanbay.com/lottery"
			location_href = "http://192.168.0.102:8020/项目/testBak/lottery";
		}
	}
	tokenfn();
	ajxs(//初始化加载奖品id和img  存储在对象中  与中奖奖品id对应得到相应图片路径
		"" + url_api + "gameinfo.asmx/LoadPrizeInfo",
		"{token:'" + token + "'}",
		false,
		function(data) {
			var str = data.d;
			var obj = JSON.parse(str);
			var load_prize = obj.data;
			$.each(load_prize, function(key, value) {
				var obj = {};
				obj.prizeId = value.ID;
				obj.ico = value.ICO;
				obj.prizeName = value.PrizeName;
				prizeid_imgArr.push(obj);	
			})
		});
	
