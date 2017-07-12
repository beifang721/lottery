$(function() {
	function timefn() {//获取当前时间
		var time = new Date();
		var m = time.getMonth() + 1;
	  	var now_time = time.getFullYear()+"."+m+"."+time.getDate() + " " + time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
//	  	$("#now_time").html(now_time);
	}
	timefn();//当前时间调用
	tokenfn();//token值掉用 公共方法
	var userid='',prize_url='',winid='';
	userid = GetQueryString("userid");
	winid = GetQueryString("winid");
	prize_url = GetQueryString("name");
	if (prize_url == "5") {
		$(".prize_img").attr('src','img/virtual/xu-50.png');
		$(".prize_name").html("20");
	} else if (prize_url == "6") {
		$(".prize_img").attr('src','img/virtual/xu-100.png');
		$(".prize_name").html("80");
	} else if (prize_url == "7") {
		$(".prize_img").attr('src','img/virtual/xu-200.png');
		$(".prize_name").html("200");
	} else if (prize_url == "8") {
		$(".prize_img").attr('src','img/virtual/xu-500.png');
		$(".prize_name").html("500");
	}
	
  	
})