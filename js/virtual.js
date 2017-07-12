$(function() {
	tokenfn();//token值掉用 公共方法
	var userid='',prize_url='',winid='';
	userid = GetQueryString("userid");
	winid = GetQueryString("winid");
	prize_url = GetQueryString("name");
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
	  	$("#now_time").html(now_time);
	  	console.log(now_time);
	  	return now_time;
	}
	
	ajxs(
		""+url_api+"GameInfo.asmx/LoadUserWinningRecordByID",
		"{userid:"+userid+",winid:'"+winid+"',token:'"+token+"',pwdcode:'"+pwdcode+"'}",
		true,
		function (data) {
			var str = data.d;
			var obj = JSON.parse(str);
			//时间戳转化时间格式
	 		var nuixtime = obj.data[0].UnixCreateDate;
	 		var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
	 		var now_time = '';
			timefn(nuixTimestamp,now_time);//当前时间调用
			
		}
	)
	
	for (var i=0; i<prizeid_imgArr.length;i++) {//根据奖品id与加载的id对比 拿到图片
		if (prizeid_imgArr[i].prizeId == prize_url) {
			$(".prize_img").attr('src', ""+prizeid_imgArr[i].ico.replace("myprize","virtual")+"");
			$(".prize_name").html(""+prizeid_imgArr[i].prizeName+"");
		}
	}
})