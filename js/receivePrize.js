$(function() {
	tokenfn();//token值掉用
	function textfn(va,txt) {
		var t = $(''+va+''); //获取到文本域对象  
	    t.css("color","#A9A9A9"); //设置文本域的样式  
	    t.val(""+txt+""); //设置默认显示文字  
	    var default_value = t.val(); //把默认显示的文字赋给一个变量  
	      
	    t.focus(function() {  //当鼠标点击文本域时修改文本域的样式，判断文本域内的文字是否等于默认值，如果等于就把文本域内设空  
	        t.css("color","black");  
	        if (t.val() == default_value) {  
	            t.val('');  
	           }  
	        });  
	  
	    t.blur(function() { //当文本域失去鼠标焦点时判断文本域中的值是否为空，如果为空就把文本域的值设置为默认显示的文字并修改样式  
	        t.css("color","black");  
	        if (t.val() == '') {  
	            t.val(default_value);  
	            t.css("color","#A9A9A9");  
	        }  
	    });   
	} 
	textfn("#name_input","请输入真实姓名");
	textfn("#iphone_input","11位手机号");
	textfn("#myinput","详细地址");
//	$(".pub_input").focus(function() {
//		$(".confirm_btn").removeClass('absout');
//	})
//	$(".pub_input").blur(function() {
//		$(".confirm_btn").addClass('absout');
//	})
//	$(window).resize(function () {
//		
//	})
	var prize_url='',winid='';
	winid = GetQueryString("winid");
	prize_url = GetQueryString("name");
	for (var i=0; i<prizeid_imgArr.length;i++) {//根据奖品id与加载的id对比 拿到图片
		if (prizeid_imgArr[i].prizeId == prize_url) {
			$(".prize_img").attr('src', ""+prizeid_imgArr[i].ico.replace("myprize","receive")+"");
			$(".prize_name").html(""+prizeid_imgArr[i].prizeName+"");
		}
	}
	function addressfn() {//奖品是否领取加载
		ajxs(
			""+url_api+"gameinfo.asmx/LoadUserWinningRecordByID",
			'{winid:"'+winid+'",userid:'+userid+',token:"'+token+'",pwdcode:"'+pwdcode+'"}',
			true,
			function (data) {
				var str = data.d;
				var obj = JSON.parse(str);
				alert(obj.data[0].IsUse);
				if (obj.data[0].IsUse == 3 ||obj.data[0].IsUse==1) { //判断
					$(".list-a,.list-b,.iphone,#myinput").css('display','none');
					$(".confirm_btn").html("奖品已领取,返回!");
					$(".confirm_btn").click(function () {
						$(".mask_2,.confirm").hide();
						history.go(-1);
					})
				}else {
				}
			}
		)
	}
	addressfn();//用户是否填写地址
	function defaul() {
		ajxs(
			""+url_api+"UserAddress.asmx/GetDefAddress",
			"{userid:'"+userid+"',token:'"+token+"',pwdcode:'"+pwdcode+"'}",
			true,
			function (data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var defaul_Data = obj.data[0];
				if (obj.data.length > 0) {//如果有默认地址
					$("#name_input").attr("value",defaul_Data.Name);
					$("#iphone_input").attr("value",defaul_Data.Tel);
					$("dd").html(defaul_Data.ProvinceName+">"+defaul_Data.CityName+">"+defaul_Data.CountyName);
					$("#myinput").attr({'value':defaul_Data.Address,});
					
				}else{ //无默认地址调用用户列表第一个
					oneadress();
				}
			}
		)
	}
	defaul();//默认地址
	function oneadress() {
		ajxs(
			""+url_api+"UserAddress.asmx/GetAddress",
			"{userid:'"+userid+"',token:'"+token+"',pwdcode:'"+pwdcode+"'}",
			true,
			function (data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var defaul_Data = obj.data[0];
				if (obj.data.length > 0) {
				$("#name_input").attr("value",defaul_Data.Name);
				$("#iphone_input").attr("value",defaul_Data.Tel);
				$("dd").html(defaul_Data.ProvinceName+">"+defaul_Data.CityName+">"+defaul_Data.CountyName);
				$("#myinput").attr({'value':defaul_Data.Address,});
				}
			}
		)
	}
	function checkMobile(){
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
	    var sMobile = $("#iphone_input").attr('value'); 
	    if(!reg.test(sMobile)){ 
	        popup("请输入输正确的手机号");
	        return false; 
	    } 
	} 
	$("#iphone_input").blur(function() {
		checkMobile();
	})
//	popup("请输入输正确的手机号");
	//全局提示弹框
	function popup(str){
	 	var info = $("<div class='Box'>"+str+"</div>");
	 	info.prependTo($("body"));
    	info.animate({"opacity":0},3000,function(){
			info.remove();
	    });	
	}
	
	$(".confirm_btn").click(function() {
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
	    var sMobile = $("#iphone_input").attr('value'); //获取填写手机号
	    var userName = $("#name_input").attr('value'); //获取填写用户姓名
	    var province_City = $("dd").html();//获取省份城市地区
	    var xinagxi = $("#myinput").attr('value');//获取详细地址
	    var address = $("dd").html() +'-'+xinagxi;
	    var addresssplit = address.split("&gt;");
	    var confirm_p = '';
	    console.log(addresssplit.length);
	    if (addresssplit.length<=2) {
	    	confirm_p = addresssplit[0]+' '+addresssplit[1];
	    } else{
		    confirm_p = addresssplit[0]+' '+addresssplit[1]+' '+addresssplit[2];
	    }
	    if(!reg.test(sMobile)){ 
	        popup("请输入输正确的手机号");
	        return false; 
	    } else {
			if (userName!=='请输入真实姓名'&&sMobile!=="11位手机号"&&province_City!=='省 &gt; 市 &gt; 区/县'&&xinagxi!=='详细地址') {
				$(".confirm-p2").html(userName+"&nbsp;&nbsp;"+sMobile);//二次确认添加文字
				$(".confirm-p3").html(confirm_p);
				$(".confirm").css('margin-top',-parseInt($(".confirm").css('height'))/2+'px');
				$(".mask_2,.confirm").show();	
			}else {
				popup("请完善个人收货地址");
			}
	    }
	})
	var recordbol = false;//地址传值给服务是否成功
	$("#suer_btn").click(function() {//地址二次确认按钮
		var sMobile = $("#iphone_input").attr('value'); //获取填写手机号
	    var userName = $("#name_input").attr('value'); //获取填写用户姓名
	    var province_City = $("dd").html();//获取省份城市地区
	    var xinagxi = $("#myinput").attr('value');//获取详细地址
	    var address = $("dd").html() +'-'+xinagxi;
	    var addresssplit = address.split("&gt;");
	    var addresss = '';
	    if (addresssplit.length<=2) {
	    	addresss = addresssplit[0]+'-'+addresssplit[1]
	    } else{
		    addresss = addresssplit[0]+'-'+addresssplit[1]+'-'+addresssplit[2];
	    }
		$('.confirm').hide();
		$(".list-a,.list-b,.iphone,#myinput").css('display','none');
		$(".confirm_btn").html("奖品已领取,返回!");//地址确认按钮点击  跳转隐藏地址栏(解决ios不刷新 )
		$(".confirm_btn").click(function () {//收货地址已经填写确认  
			$(".mask_2,.confirm").hide();
			history.go(-1);
		})
		ajxs(//收货地址
			""+url_api+"Gameinfo.asmx/UserAddress",
			'{winningid:"'+winid+'",userid:'+userid+',mobile:"'+sMobile+'",username:"'+userName+'",addresss:"'+addresss+'",token:"'+token+'",pwdcode:"'+pwdcode+'"}',
			true,
			function (data) {
				$(".box-wrap,.mask_2").show();//平台尽快发货提示框
				return recordbol = true;
				//window.location.href = ""+location_href+"lottery/Logistics.html?userid="+userid+"&winid="+winid+"&name="+prize_url+"";
			}
		)
		
	})
	$("#close_btn").click(function() {
		$('.confirm,.mask_2').hide();
	})
	$(".close-img").click(function() {
		$('.box-wrap,.mask_2').hide();
		window.location.href = ""+location_href+"/Logistics.html?userid="+userid+"&winid="+winid+"&name="+prize_url+"&pwdcode="+pwdcode+"&ran="+Math.random()+"";
	})
	$('.mask_2').click(function () {
		$('.confirm,.mask_2,.box-wrap').hide();
		console.log(recordbol);
		if (recordbol) {
			window.location.href = ""+location_href+"/Logistics.html?userid="+userid+"&winid="+winid+"&name="+prize_url+"&pwdcode="+pwdcode+"&ran="+Math.random()+"";
		}
	})
	
	//返回刷新页面
	var isPageHide = false; 
	window.addEventListener('pageshow', function () { 
	    if (isPageHide) { 
	      window.location.reload(); 
	    } 
	}); 
	window.addEventListener('pagehide', function () { 
	    isPageHide = true; 
	}); 
    
})