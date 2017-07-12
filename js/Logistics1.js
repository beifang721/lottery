$(function() {
	tokenfn();//token值掉用 公共方法
	
	var userid='',prize_url='',winid='';
	userid = GetQueryString("userid");
	winid = GetQueryString("winid");
	prize_url = GetQueryString("name");
	if (prize_url == "1") {
		$(".prize_img").attr('src','img/myprize/my_san.png');
		$(".prize_name").html("定制雨伞");
	} else if (prize_url == "2") {
		$(".prize_img").attr('src','img/myprize/my_bei.png');
		$(".prize_name").html("定制马克杯");
	} else if (prize_url == "3") {
		$(".prize_img").attr('src','img/myprize/my_iphone.png');
		$(".prize_name").html("Iphone 7");
	} else if (prize_url == "4") {
		$(".prize_img").attr('src','img/myprize/my_ipadmini.png');
		$(".prize_name").html("IpadMini");
	}
	function timefn(timer,now_time) {//获取当前时间自动补零
		var time = timer;
		var year = time.getFullYear();
		var month = time.getMonth() + 1;
		var dat = time.getDate();
		var hours = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();
		month < 10 ? month = "0"+month : month=month; 
		dat < 10 ? dat = "0"+ dat : dat=dat; 
		hours < 10 ? hours = "0"+ hours : hours = hours; 
		minute < 10 ? minute = "0"+ minute : minute = minute; 
		second < 10 ? second = "0"+ second : second = second; 
	  	now_time = year+"-"+month+"-"+dat + " " + hours+":"+minute+":"+second;
	  	$(".caption_time").html(now_time);
	  	return now_time;
	}
	ajxs(
		""+url_api+"GameInfo.asmx/LoadUserWinningRecordByID",
		'{userid:"'+userid+'",winid:"'+winid+'",token:"'+token+'",tp:0}',
		function (data) {
			var str = data.d;
			var obj = JSON.parse(str);
			var data = obj.data[0];
			var expcode = data.ExpressNo;
			$('#name').html(data.UserName);
			$("#iphone_num").html(data.Mobile);
			$("#address").html(data.Address);
			var result_div = '';
			var result_round = '';
			var now_time = '';
			timefn(new Date(),now_time);//当前时间调用
			if (data.ExpressID == null) {
				result_div += 	"<div class='list_each mo_list'>"
										+"<p>系统正在发货</p>"
										+"<p>"+timefn(new Date(),now_time)+"</p>"
										+"</div>";
				result_round +=  "<span class='round mo_round'></span>";
				$(".list_wrap").append(result_div);
				$("#progressBar").append(result_round);
			} else {
				getexpol(expcode);
			}
		}
	)
	function getexpol(expcode) {//快递信息请求
		ajxs(
			""+url_api+"Express.asmx/GetExpOL",
			'{expcode:"'+expcode+'",exp:"auto",token:"'+token+'",tp:0}',
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var exp_result = obj.result.list;
				var result_Txt = '';//创建每条信息
				var reselt_Span = '';//创建圆
				var list = '';
				var round = '';
				console.log(obj);
				if (exp_result.length > 0) {
					for (var i=0;i < exp_result.length;i++) {
						var nuixtime = exp_result[i].time;
						var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
						var creatime = nuixTimestamp.getFullYear()+'.'+(nuixTimestamp.getMonth() +1 )+'.'+nuixTimestamp.getDate();
						var now_time = '';
						timefn(nuixTimestamp,now_time);
						i==0?list='mo_list':list='tou_list';
						i==0?round='mo_round':round='tou_round';
						result_Txt += 	"<div class='list_each "+list+" list"+i+"'>"
											+"<p>"+exp_result[i].status+"</p>"
											+"<p>"+timefn(nuixTimestamp,now_time)+"</p>"
											+"</div>";
						reselt_Span +=  "<span class='round "+round+" round"+i+"'></span>";					
					}
					$(".list_wrap").append(result_Txt);
					$("#progressBar").append(reselt_Span);
					for (var i=0;i < exp_result.length;i++) {
						$(".round"+i+"").css('top',$(".list"+i+"").offset().top-$(".list_wrap").offset().top+'px');
					}
					var a_list_top = $(".mo_list").offset().top; //第一行距离顶部距离
					var mo_list_top = $(".list"+(exp_result.length-1)+"").offset().top //最后一条信息距离顶部距离
					var a_mo_distance = mo_list_top - a_list_top;
					$("#progressBar").css('height',(a_mo_distance)+'px');//线条高度
				} else {
					var result_div = '';
					var result_round = '';
					var now_time = '';
					timefn(new Date(),now_time);//当前时间调用
					result_div += 	"<div class='list_each mo_list'>"
											+"<p>系统正在发货</p>"
											+"<p>"+timefn(new Date(),now_time)+"</p>"
											+"</div>";
					result_round +=  "<span class='round mo_round'></span>";
					$(".list_wrap").append(result_div);
					$("#progressBar").append(result_round);
				}
			}
		)
	}
	
	
})