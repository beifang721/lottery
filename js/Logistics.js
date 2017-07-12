$(function() {
	tokenfn();//token值掉用 公共方法
	var prize_url='',winid='';
	winid = GetQueryString("winid");
	prize_url = GetQueryString("name");
	for (var i=0; i<prizeid_imgArr.length;i++) {//根据奖品id与加载的id对比 拿到图片
		if (prizeid_imgArr[i].prizeId == prize_url) {
			$(".prize_img").attr('src', ""+prizeid_imgArr[i].ico.replace("myprize","receive")+"");
			$(".prize_name").html(""+prizeid_imgArr[i].prizeName+"");
		}
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
	var nuixtime_record = '';
	var nuixTimestamp_record = '';//全局的抽中奖品创建时间
	ajxs(
		""+url_api+"GameInfo.asmx/LoadUserWinningRecordByID",
		'{userid:"'+userid+'",winid:"'+winid+'",token:"'+token+'",pwdcode:"'+pwdcode+'"}',
		true,
		function (data) {
			var str = data.d;
			var obj = JSON.parse(str);
			var data = obj.data[0];
			var expcode = data.ExpressNo;
			$('#name').html(data.UserName);
			$("#iphone_num").html(data.Mobile);
			$("#address").html(data.Address);
			nuixtime_record = obj.data[0].UnixCreateDate;
	 		nuixTimestamp_record = new Date(parseInt(nuixtime_record) * 1000);
			var result_div = '';
			var result_round = '';
			var now_time = '';
			//timefn(nuixTimestamp,now_time);//当前时间调用
			if (data.ExpressID == null) {
				result_div += 	"<div class='list_each mo_list'>"
										+"<p>您已领取,尚未发货!</p>"
										+"<p>"+timefn(nuixTimestamp_record,now_time)+"</p>"
										+"</div>";
				result_round +=  "<span class='round mo_round'></span>";
				$(".list_wrap").append(result_div);
				$("#progressBar").append(result_round);
			} else {
				console.log(expcode);
				getexpol(expcode);
			}
		}
	)
	
	function getexpol(expcode) {//快递信息请求
		ajxs(
			""+url_api+"Express.asmx/GetExpOL",
			'{expcode:"'+expcode+'",exp:"auto",token:"'+token+'",tp:0,pwdcode:"'+pwdcode+'"}',
			true,
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				console.log(obj);
				if (obj == null) {
					$('#warning').text('请求超时');
				}else{
					$('#warning').hide();
				}
				var exp_result = obj.result.list;
				var result_Txt = '';//创建每条信息
				var reselt_Span = '';//创建圆
				var list = '';
				var round = '';
				if (exp_result.length > 1) {
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
											+"<p>您已领取,尚未发货!</p>"
											+"<p>"+timefn(nuixTimestamp_record,now_time)+"</p>"
											+"</div>";
					result_round +=  "<span class='round mo_round'></span>";
					$(".list_wrap").append(result_div);
					$("#progressBar").append(result_round);
				}
			},
			function() {
				$(".real_info").append($("#warning"));
				$("#warning").text('正在处理，请稍等！')
			}()
		)
	}
	
	
})