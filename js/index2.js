var turnplate = {
	restaraunts: [],
	//大转盘奖品名称
	colors: [],
	//大转盘奖品区块对应背景颜色
	outsideRadius: 185,
	//大转盘外圆的半径
	textRadius: 135,
	//大转盘奖品位置距离圆心的距离
	insideRadius: 55,
	//大转盘内圆的半径
	startAngle: 0,
	//开始角度
	bRotate: false
};
$(function() {
	//图片预加载
	var loadingImgs = ["img/roundpan.png", "img/roundpan2.png", "img/receive.png", "img/prize-50.png", "img/prize-100.png", "img/prize-200.png", "img/prize-500.png", "img/prize-bei.png", "img/prize-ipad.png", "img/prize-iphone.png", "img/prize-san.png", "img/balance-short"];
	var loadingNum = 0;
	for(var i = 0; i < loadingImgs.length; i++) {
		var imgObj = new Image(); //创建图片对象
		imgObj.src = loadingImgs[i];
		imgObj.onload = function() {
			loadingNum++;
			//判断接近加载完毕的时候进入页面

		}
	}

	tokenfn(); //token值调用
	var userid = '';
	userid = GetQueryString("userid");
	//获取当前用户可抽奖状态
	function loadprize() {
		ajxs(
			"" + url_api + "gameinfo.asmx/LoadUserState",
			"{userid:'" + userid + "',token:'" + token + "'}",
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var user_Bk = obj.data.UserBK;
				var free_Count = $("#free_num");
				$("#bk_num").html(user_Bk); //初始贝壳
				free_Count.html(obj.data.FreeCount); //免费抽奖次数
				//立即抽奖点击事件
				$(".pointer").on('touchend', function(event) {
					if($("#bk_num").html() >= 100 && !turnplate.bRotate && free_Count.html() <= 0) { //满足1.贝壳大于100 2.转盘停止 3.无免费抽奖 (显示消费提示弹框)
						$(".confirm").css("margin-top", -parseInt($(".confirm").css('height')) / 2 + 'px');
						$(".confirm,.cover-div").show();
					} else if($("#bk_num").html() < 100 && !turnplate.bRotate && free_Count.html() <= 0) { //满足1.贝壳小于100 2.转盘停止 3.无免费抽奖 (提示去充值页面)
						$(".confirm_chong").css("margin-top", -parseInt($(".confirm_chong").css('height')) / 2 + 'px');
						$(".cover-div,.confirm_chong").show();
					}
					if(free_Count.html() > 0 && !turnplate.bRotate) {
						light(); //闪灯
						if(!turnplate.bRotate) {
							if(free_Count.html() > 0) {
								free_Count.html(parseInt(free_Count.html()) - 1);
							} else {
								free_Count.html(0);
							}
						}
						if(turnplate.bRotate) return; //转盘在转动不可点击
						turnplate.bRotate = !turnplate.bRotate;
						lotterymethod(1); //抽奖的方法
					}
					event.preventDefault();
				});
			}
		)
	}
	loadprize(); //调用用户可抽奖状态方法
	//动态添加大转盘的奖品与奖品区域背景颜色
	//	    ajxs(
	//			""+url_api+"gameinfo.asmx/LoadPrizeInfo",
	//		 	"{token:'"+token+"'}",
	//			function(data) {
	//				var str = data.d;
	//				var obj = JSON.parse(str);
	//				var load_prize = obj.data;
	//				//定制雨傘開始
	//				
	//				var prize="";
	//				var col="";
	//				for (var i=0;i<load_prize.length;i++) {
	//	
	//	prize+=","+load_prize[i].PrizeName;
	//	col+=","+load_prize[i].Col;
	//					//turnplate.restaraunts = [""+load_prize[0].PrizeName+"", ""+load_prize[1].PrizeName+"",""+load_prize[2].PrizeName+"",""+load_prize[3].PrizeName+"",""+load_prize[4].PrizeName+"", ""+load_prize[5].PrizeName+"" , ""+load_prize[6].PrizeName+"", ""+load_prize[7].PrizeName+"", ""+load_prize[8].PrizeName+"", ""+load_prize[9].PrizeName+""];
	//				}
	//				turnplate.restaraunts = "["+prize.substring(1)+"]";
	//					turnplate.colors="["+col.substring(1)+"]";
	//			 	console.log(turnplate.restaraunts);
	//			//	turnplate.colors = ["#ffb436","#65e17a", "#ff98c9", "#d0a0ff","#ff8f02","#14b6ff","#ff8769","#ffd40e","#afa5ff","#ff724b"];
	//				//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
	//					window.onload = function() {
	//drawRouletteWheel();
	//					};
	//			}
	//		)
	//获取实时抽中奖用户
	function newlist() {
		ajxs(
			"" + url_api + "gameinfo.asmx/LoadDrawNewList",
			"{listType:0,pageSize:30,pageIndex:1,token:'" + token + "'}",
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				//obj.data.reverse();//将数组倒叙排列
				var result = '';
				var icon_url = ''; //用户头像
				var name_margin = ''; //用户名字margin
				if(obj.data.length >= 5) {
					for(var i = 0; i < obj.data.length; i++) {
						var subStr1 = obj.data[i].LoginName.substr(0, 3);
						var subStr2 = obj.data[i].LoginName.substr(7, 11);
						var subStr = subStr1 + "***" + subStr2;
						//时间戳转化时间格式
						var nuixtime = obj.data[i].UnixCreateDate;
						var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
						var date_str = nuixTimestamp.getFullYear() + '-' + (nuixTimestamp.getMonth() + 1) + '-' + nuixTimestamp.getDate() + ' ' + nuixTimestamp.getHours() + ':' + nuixTimestamp.getMinutes() + ':' + nuixTimestamp.getSeconds();
						obj.data[i].UserICon == "http://test.static.huanbay.com/" ? icon_url = "no_icon" : icon_url = "ye_icon"; //判断用户有无头像
						obj.data[i].UserICon == "http://test.static.huanbay.com/" ? name_margin = "no_margin" : name_margin = "ye_margin";
						result += "<div class='list'>" +
							"<p>" +
							"恭喜!&nbsp;<span class='icon_wrap " + icon_url + "' style=background-image:url('" + obj.data[i].UserICon + "')></span>" +
							"&nbsp;<span class='" + name_margin + "'>" + obj.data[i].Nickname + "</span>&nbsp;抽到了&nbsp;" +
							"<span class='creat_pri_name'>" + obj.data[i].PrizeName + "</span>" +
							"</p>" +
							"</div>";
					}
					$('.list_wrap').append(result);
					//(callback && typeof(callback) === "function") && callback();
				} else {
					$(".roller").hide();
					clearInterval(n_set);
				}
			}
		)
	}

	var scroll = 0; //滚动中奖用户
	var n_set = setInterval(function() {
		scroll++;
		$(".list_wrap").css('margin-top', -scroll + 'px');
		if(parseInt($(".list_wrap").css('height')) - scroll < parseInt($(".list").css('height'))) {
			newlist(); //调用实时中奖方法
			$(".list").remove();
			scroll = 0;
		}
	}, 100)
	newlist(); //调用实时中奖方法

	/*
	    function scrollfn() { //用户抽奖滚轮列表
		    var divNums=$(".list_wrap").children().length;
			var divHeight=$(".list_wrap").children().eq(0).height();
		    $(".list_wrap").animate({"margin-top" : "-"+divHeight},2500, "linear",function(){
		    	var new_divNum=$(".list_wrap").children().length;
		        if (new_divNum == 2) {
		        	newlist();
		        } 
			    scrollfn();
		        $(this).css('margin-top','0').children().eq(0).remove();
		    });
	    }
	    newlist(scrollfn);
	    */
	//  turnplate.restaraunts = ["定制马克杯", "50贝壳", "100贝壳", "200贝壳", "500贝壳", "iphone 7" ,"ipad mini","定制雨伞"];

	var rotateTimeOut = function() {
		$("#wheelcanvas").rotate({
			angle: 0,
			animateTo: 2160,
			duration: 8e3,
			callback: function() {
				alert("网络超时，请检查您的网络设置！");
			}
		});
	};
	//图片切换 闪灯效果
	var light_timer = ''; //图片切换定时器
	function light() {
		var bol = true;
		light_timer = setInterval(function() {
			if(bol) {
				$(".turnplate").css('background-image', 'url(img/roundpan.png)');
				bol = false;
			} else {
				$(".turnplate").css('background-image', 'url(img/roundpan2.png)');
				bol = true;
			}
		}, 300)
	}
	//旋转转盘 item:奖品位置; prizeid：奖品id;
	var rotateFn = function(item, prizeid, type, winid) {
		var angles = item * (360 / turnplate.restaraunts.length) - 360 / (turnplate.restaraunts.length * 2);
		if(angles < 270) {
			angles = 270 - angles;
		} else {
			angles = 360 - angles + 270;
		}
		$("#wheelcanvas").stopRotate();
		$("#wheelcanvas").rotate({
			angle: 0,
			animateTo: angles + 3600,
			duration: 8e3,
			callback: function() {
				clearInterval(light_timer); //清楚幻灯片定时器
				$(".cover-div").show(); //转盘停止弹框block
				$(".prize_result").show();
				//弹出抽到的奖品
				//修改
				if(type == 0) {
					var prize = '';
					if(prizeid == 1) {
						prize = "5";
					} else if(prizeid == 2) {
						prize = "6";
					} else if(prizeid == 4) {
						prize = "7";
					} else if(prizeid == 3) {
						prize = "8";
					}
					$(".receive_btn").on('touchend', function(event) {
						event.preventDefault();
						$(".cover-div,.prize_result").hide();
						window.location.href = "" + location_href + "lottery/virtualPrize.html?userid=" + userid + "&winid=" + winid + "&name=" + prize + "";
					})
				} else {
					var prize = '';
					if(prizeid == 6) {
						$(".prize_img").attr('src', "img/prize-san.png");
						prize = "1";
					} else if(prizeid == 5) {
						$(".prize_img").attr('src', "img/prize-bei.png");
						prize = "2";
					} else if(prizeid == 8) {
						$(".prize_img").attr('src', "img/prize-iphone.png");
						prize = "3";
					} else if(prizeid == 7) {
						$(".prize_img").attr('src', "img/prize-ipad.png");
						prize = "4";
					} else if(prizeid == 10) {
						$(".prize_img").attr('src', "img/prize-mouse.png");
						prize = "11";
					} else if(prizeid == 9) {
						$(".prize_img").attr('src', "img/prize-powerBank.png");
						prize = "12";
					}
					$(".receive_btn").on('touchend', function(event) {
						event.preventDefault();
						$(".cover-div,.prize_result").hide();
						if(browser.versions.android) {
							var data = "" + location_href + "lottery/receivePrize.html?userid=" + userid + "&winid=" + winid + "&name=" + prize + "";
							var strData = JSON.stringify(data);
							window.AndroidTehuiInfo.hui(strData); //与android约定相同的类和类下的方法名
						} else {
							window.location.href = "" + location_href + "lottery/receivePrize.html?userid=" + userid + "&winid=" + winid + "&name=" + prize + "";
						}
					})

				}
				turnplate.bRotate = !turnplate.bRotate;
			}
		});
	};

	//抽奖方法
	function lotterymethod(type) {
		ajxs(
			"" + url_api + "gameinfo.asmx/StartDraw",
			"{userid:'" + userid + "',type:" + type + ",token:'" + token + "'}",
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var prize_Name = obj.data.PrizeInfoName; //奖品名称
				var prize_Id = obj.data.PrizeInfoID; //奖品Id
				var winning_recordId = obj.data.WinningRecordID; //奖品id编号
				//console.log(obj);
				setTimeout(function() {
					$("#bk_num").html(obj.data.ShellCount);
				}, 9e3)
				if(obj.data.PrizeType == 0) {
					$(".prize_result").addClass("add_bgsz");
					$(".receive_btn").hide();
					$(".win_prize").html(obj.data.Tips);
					if(prize_Id == 1) { //20贝壳
						$(".prize_img").attr('src', "img/prize-50.png");
						prize = "5";
					} else if(prize_Id == 2) { //80贝壳
						$(".prize_img").attr('src', "img/prize-100.png");
						prize = "6";
					} else if(prize_Id == 4) {
						$(".prize_img").attr('src', "img/prize-200.png");
						prize = "7";
					} else if(prize_Id == 3) {
						$(".prize_img").attr('src', "img/prize-500.png");
						prize = "8";
					}
				} else {
					$(".prize_result").removeClass("add_bgsz");
					$(".receive_btn").show();
					$(".receive_btn").find('img').attr('src', 'img/receive_btn.png');
					$(".win_prize").html(obj.data.Tips);
					if(prize_Id == 6) {
						$(".prize_img").attr('src', "img/prize-san.png");
						prize = "1";
					} else if(prize_Id == 5) {
						$(".prize_img").attr('src', "img/prize-bei.png");
						prize = "2";
					} else if(prize_Id == 8) {
						$(".prize_img").attr('src', "img/prize-iphone.png");
						prize = "3";
					} else if(prize_Id == 7) {
						$(".prize_img").attr('src', "img/prize-ipad.png");
						prize = "4";
					} else if(prize_Id == 10) {
						$(".prize_img").attr('src', "img/prize-mouse.png");
						prize = "11";
					} else if(prize_Id == 9) {
						$(".prize_img").attr('src', "img/prize-powerBank.png");
						prize = "12";
					}
				}
				if(obj.code == 17014) { //如果免费抽奖不足
					lotterymethod(0);
				} else {
					for(var i = 0; i < turnplate.restaraunts.length; i++) {
						if(turnplate.restaraunts[i] == prize_Name) {
							console.log(turnplate.restaraunts[i]);
							rotateFn(i + 1, prize_Id, obj.data.PrizeType, winning_recordId); //得到奖品名称,指针落在对应奖品区域的中心角度
						}
					}
				}
			}
		)
	}
	//抽奖二次确认按钮确认点击事件
	$("#suer_btn").on('touchend', function(event) { //消费一百贝壳二次弹框
		event.preventDefault();
		$("#bk_num").html(parseInt($("#bk_num").html()) - 100);
		$(".confirm,.cover-div").hide();
		light(); //闪灯
		if(turnplate.bRotate) return; //转盘在转动不可点击
		turnplate.bRotate = !turnplate.bRotate;
		lotterymethod(0); //抽奖的方法
	})
	//充值点击事件
	$("#suer_chong").on('touchend', function(event) {
		event.preventDefault();
		if(browser.versions.ios) {
			alert("quhuanbei://com.huanbay.release/home?urltype=20");
		} else if(browser.versions.android) {
			var data = "quhuanbei://com.huanbay.release/home?urltype=20";
			var strData = JSON.stringify(data);
			window.AndroidTehuiInfo.hui(strData); //与android约定相同的类和类下的方法名
		}
		$(".confirm,.confirm_chong,.cover-div").hide();
	})
	//二次确认按钮取消点击事件
	$("#close_btn,#close_chong").on('touchend', function(event) {
		event.preventDefault();
		$(".confirm,.confirm_chong,.cover-div").hide();
	})
	//我的奖品点击事件
	$(".person_prizebtn").on('touchend', function(event) {
		event.preventDefault();
		window.location.href = "" + location_href + "lottery/myprize.html?userid=" + userid + "";
	})
	//蒙版点击事件
	$(".cover-div").on('touchend', function(event) {
		event.preventDefault();
		$(".cover-div,.prize_result,.confirm,.confirm_chong").hide();
	})
	//点击close-img 隐藏弹框和蒙版
	$(".close-img").on('touchend', function(event) {
		event.preventDefault();
		$(".cover-div,.prize_result,.confirm_chong").hide();
	})
	//全局提示弹框
	function popup(str) {
		var info = $("<div class='Box'>" + str + "</div>");
		info.prependTo($("body"));
		info.animate({ "opacity": 0 }, 3000, function() {
			info.remove();
		});
	}

	function drawRouletteWheel() {

		ajxs(
			"" + url_api + "gameinfo.asmx/LoadPrizeInfo",
			"{token:'" + token + "'}",
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var load_prize = obj.data;

//				$(".divimg").html("");
//				for(var i = 0; i < load_prize.length; i++) {
//					$(".divimg").append("<img src='" + load_prize[i].ICO.replace("myprize/","") + "' id='icon" + i + "' style='display:none'>")
//				}

				//					var prize = "";
				//					var col = "";
				//					for(var i = 0; i < load_prize.length; i++) {
				//
				//						prize += "," + load_prize[i].PrizeName;
				//						col += "," + load_prize[i].Col;
				//					}
				//					turnplate.restaraunts = "[" + prize.substring(1) + "]";
				//					turnplate.colors = "[" + col.substring(1) + "]";

				var canvas = document.getElementById("wheelcanvas");
				if(canvas.getContext) {

					//根据奖品个数计算圆周角度
					var arc = Math.PI / (load_prize.length / 2);
					var ctx = canvas.getContext("2d");
					ctx.clearRect(0, 0, 422, 422);
					ctx.scale(2, 2);
					//strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
					ctx.strokeStyle = "#FFBE04";
					//font 属性设置或返回画布上文本内容的当前字体属性
					ctx.font = "16px Microsoft YaHei";

					for(var i = 0; i < load_prize.length; i++) {
						//$(".divimg").append("<img src='"+load_prize[i].ICO+"' id='icon"+i+"' style='display:none'>")	

						var angle = turnplate.startAngle + i * arc;
						ctx.fillStyle = load_prize[i].Col;
						ctx.beginPath();
						//arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
						ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
						ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
						ctx.stroke();
						ctx.fill();
						//锁画布(为了保存之前的画布状态)
						ctx.save();
						//----绘制奖品开始----
						ctx.fillStyle = "#FFF";
						var text = load_prize[i].PrizeName;
						var line_height = 17;
						//translate方法重新映射画布上的 (0,0) 位置
						ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
						//rotate方法旋转当前的绘图
						ctx.rotate(angle + arc / 2 + Math.PI / 2);
						/** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
//						if(text.indexOf("N") > 0) {
//							var texts = text.split("N");
//							for(var j = 0; j < texts.length; j++) {
//								ctx.font = j == 0 ? "bold 20px Microsoft YaHei" : "16px Microsoft YaHei";
//								if(j == 0) {
//									ctx.fillText(texts[j] + "N", -ctx.measureText(texts[j] + "N").width / 2, j * line_height);
//								} else {
//									ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
//								}
//							}
//						} else if(text.indexOf("N") == -1 && text.length > 15) {
//							//奖品名称长度超过一定范围 
//							text = text.substring(0, 6) + "||" + text.substring(6);
//							var texts = text.split("||");
//							for(var j = 0; j < texts.length; j++) {
//								ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
//							}
//						} else {
//							//在画布上绘制填色的文本。文本的默认颜色是黑色
//							//measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
							ctx.fillText(text, -ctx.measureText(text).width / 2, 0 - 20);
//						}
						//						var img = load_prize[i].ICO;
						//$("<img id='icos"+i+"' src="+load_prize[i].ICO.replace("myprize/","")+">").appendTo($('body'));
						switch(i) {
							case 0:
								drawImg(-15, 0, 30, 56);
								break;
							case 1:
								drawImg(-25, 10, 50, 25); //
								break;
							case 2:
								drawImg(-18, 0, 55, 53);
								break;
							case 3:
								drawImg(-25, 10, 50, 25); //
								break;
							case 4:
								drawImg(-15, 0, 30, 57);
								break;
							case 5:
								drawImg(-25, 10, 50, 25); //
								break;
							case 6:
								drawImg(-25, 10, 50, 25); //
								break;
							case 7:
								drawImg(-15, 0, 27, 54);
								break;
							case 8:
								drawImg(-20, 0, 51, 50)
								break;
							case 9:
								drawImg(-35, 0, 65, 36);
								break;

						}

						function drawImg(x, y, w, h) {
							//$(".divimg").append("<img src='" + load_prize[i].ICO.replace("myprize/","") + "' id='icon" + i + "' style='display:none'>")
//							var creatImg = document.createElement("img");
//							creatImg.setAttribute("id","icon"+i)
//							creatImg.setAttribute("src",load_prize[i].ICO.replace("myprize/",""))
							var img =  document.getElementById("icon" + i + "");
//							img.setAttribute("src","img/cup.png");
//							img.setAttribute("style","display:none");
							console.log(img);
							img.onload = function() {
								ctx.drawImage(img, x, y, w, h); //后两个参数调整小图标位置
							};
							ctx.drawImage(img, x, y, w, h);
						}
						//						把当前画布返回（调整）到上一个save()状态之前 
						ctx.restore();
					}
				}
			}
		)

	}
})

//			//根据奖品个数计算圆周角度
//			var arc = Math.PI / (turnplate.restaraunts.length / 2);
//			var ctx = canvas.getContext("2d");
//			ctx.scale(2, 2);
//			//在给定矩形内清空一个矩形
//			ctx.clearRect(0, 0, 422, 422);
//			//strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
//			ctx.strokeStyle = "#FFBE04";
//			//font 属性设置或返回画布上文本内容的当前字体属性
//			ctx.font = "16px Microsoft YaHei";
//			for(var i = 0; i < turnplate.restaraunts.length; i++) {
//				var angle = turnplate.startAngle + i * arc;
//				ctx.fillStyle = turnplate.colors[i];
//				ctx.beginPath();
//				//arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
//				ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
//				ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
//				ctx.stroke();
//				ctx.fill();
//				//锁画布(为了保存之前的画布状态)
//				ctx.save();
//				//----绘制奖品开始----
//				ctx.fillStyle = "#FFF";
//				var text = turnplate.restaraunts[i];
//				var line_height = 17;
//				//translate方法重新映射画布上的 (0,0) 位置
//				ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
//				//rotate方法旋转当前的绘图
//				ctx.rotate(angle + arc / 2 + Math.PI / 2);
//				/** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
//				if(text.indexOf("N") > 0) {
//					//流量包
//					var texts = text.split("N");
//					for(var j = 0; j < texts.length; j++) {
//						ctx.font = j == 0 ? "bold 20px Microsoft YaHei" : "16px Microsoft YaHei";
//						if(j == 0) {
//							ctx.fillText(texts[j] + "N", -ctx.measureText(texts[j] + "N").width / 2, j * line_height);
//						} else {
//							ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
//						}
//					}
//				} else if(text.indexOf("N") == -1 && text.length > 15) {
//					//奖品名称长度超过一定范围 
//					text = text.substring(0, 6) + "||" + text.substring(6);
//					var texts = text.split("||");
//					for(var j = 0; j < texts.length; j++) {
//						ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
//					}
//				} else {
//					//在画布上绘制填色的文本。文本的默认颜色是黑色
//					//measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
//					ctx.fillText(text, -ctx.measureText(text).width / 2, 0 - 20);
//				}
//				//添加对应图标
//				if(text.indexOf("定制马克杯") >= 0) {
//					var img = document.getElementById("cup-img");
//					drawImg(-20, 0, 51, 50)
//				} else if(text.indexOf("20贝壳") >= 0) {
//					var img = document.getElementById("halfcoupon-img");
//					drawImg(-25, 10, 50, 25);
//				} else if(text.indexOf("80贝壳") >= 0) {
//					var img = document.getElementById("onecoupon-img");
//					drawImg(-25, 10, 50, 25);
//				} else if(text.indexOf("200贝壳") >= 0) {
//					var img = document.getElementById("twocoupon-img");
//					drawImg(-25, 10, 50, 25);
//				} else if(text.indexOf("500贝壳") >= 0) {
//					var img = document.getElementById("fivecoupon-img");
//					drawImg(-25, 10, 50, 25);
//				} else if(text.indexOf("Iphone 7") >= 0) {
//					var img = document.getElementById("iphone-img");
//					drawImg(-15, 0, 27, 54);
//				} else if(text.indexOf("IpadMini") >= 0) {
//					var img = document.getElementById("ipad-img");
//					drawImg(-18, 0, 55, 53);
//				} else if(text.indexOf("定制雨伞") >= 0) {
//					var img = document.getElementById("umbrella-img");
//					img.onload = function() {
//						ctx.drawImage(img, -35, 0, 65, 36);
//					};
//					ctx.drawImage(img, -35, 0, 65, 36);
//				} else if(text.indexOf("定制鼠标") >= 0) {
//					var img = document.getElementById("mouse-img");
//					img.onload = function() {
//						ctx.drawImage(img, -15, 0, 30, 57);
//					};
//					ctx.drawImage(img, -15, 0, 30, 57);
//				} else if(text.indexOf("充电宝") >= 0) {
//					var img = document.getElementById("power-img");
//					drawImg(-15, 0, 30, 56);
//				}
//
//				function drawImg(x, y, w, h) {
//					img.onload = function() {
//						ctx.drawImage(img, x, y, w, h); //后两个参数调整小图标位置
//					};
//					ctx.drawImage(img, x, y, w, h);
//				}
//				//把当前画布返回（调整）到上一个save()状态之前 
//				ctx.restore();
//			}
//}
//}

//})