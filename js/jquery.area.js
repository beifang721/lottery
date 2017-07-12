/**
 * jquery.area.js
 * 移动端省市区三级联动选择插件
 * author: MinYong
 * date: 2017-06-17
**/
	
var expressArea, areaCont='', areaList = $("#areaList"), areaTop = areaList.offset().top;

/*初始化省份*/
function intProvince() {
	areaCont = "";
	ajxs(
		"" + url_api +"UserAddress.asmx/GetProvince",
		"{token:'"+token+"'}",
		false,
		function(data) {
			var data = JSON.parse(data.d).data;
			$.each(data, function(key,value) {
				areaCont += '<li onClick="selectP('+value.ID+',\''+value.AreaName+'\');">' + value.AreaName + '</li>';
			});
			areaList.html(areaCont);
			$("#areaBox").scrollTop(0);
			$("#backUp").removeAttr("onClick").hide();
		}
	)
}
intProvince();


/*选择省份*/
function selectP(provinceid,provinceName) {
	areaCont = "";
	areaList.html("");
	ajxs(
		"" + url_api +"UserAddress.asmx/GetCity",
		"{provinceid:'"+provinceid+"',token:'"+token+"'}",
		false,
		function (data) {
			var data = JSON.parse(data.d).data;
			console.log(data);
			$.each(data, function(key,value) {
				areaCont += '<li onClick="selectC(' +value.ID+ ','+provinceid+',\''+provinceName+'\',\''+value.AreaName+'\')">' + value.AreaName + '</li>';
			});
			areaList.html(areaCont);
			$("#areaBox").scrollTop(0);
			$("#backUp").attr("onClick", "intProvince();").show();
		}
	)
}

/*选择城市*/
function selectC (cityid,provinceid,provinceName,cityNmae){
	areaCont = "";
	ajxs(
		"" + url_api +"UserAddress.asmx/GetCity",
		"{provinceid:'"+cityid+"',token:'"+token+"'}",
		false,
		function (data) {
			var data = JSON.parse(data.d).data;
			$.each(data, function(key,value) {
				areaCont += '<li onClick="selectD(\''+provinceName+'\',\''+cityNmae+'\',\''+value.AreaName+'\');">' + value.AreaName + '</li>';
			});
			areaList.html(areaCont);
			$("#areaBox").scrollTop(0);			
			$("#backUp").attr("onClick", "selectP(" + provinceid + ",\""+provinceName+"\");").show();
		}
	)
}
/*选择区县*/
function selectD(p,c,d) {
	clockArea();
	expressArea = ""+p+" > "+c+" > "+d+""
	$("#expressArea dl dd").html(expressArea);
}

/*关闭省市区选项*/
function clockArea() {
	$("#areaMask").fadeOut();
	$("#areaLayer").animate({"bottom": "-100%"});
	intProvince();
}

$(function() {
	/*打开省市区选项*/
	$("#expressArea").click(function() {
		$("#areaMask").fadeIn();
		$("#areaLayer").animate({"bottom": 0});
	});
	/*关闭省市区选项*/
	$("#areaMask, #closeArea").click(function() {
		clockArea();
	});
});