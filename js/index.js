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
	goodsimgArr: [],//奖品图片页面标签 
	goodsidimgArr:[],//奖品id对应的图片
	//大转盘内圆的半径
	startAngle: 0,
	//开始角度
	bRotate: false
};

$(function() {
	
	//本地图片预加载
	var loadingImgs = ["img/roundpan.png", "img/roundpan2.png", "img/receive.png", "img/boxprize/20.png", "img/boxprize/80.png", "img/boxprize/200.png", "img/boxprize/500.png", "img/boxprize/cup.png", "img/boxprize/ipadmini.png", "img/boxprize/iphone.png", "img/boxprize/san.png", "img/balance-short.png"];
	var loadingNum = 0;
	for(var i = 0; i < loadingImgs.length; i++) {
		var imgObj = new Image(); //创建图片对象
		imgObj.src = loadingImgs[i];
		imgObj.onload = function() {
			loadingNum++;
		}
	}
	ajxs(
		"" + url_api + "gameinfo.asmx/LoadPrizeInfo",
		"{token:'" + token + "',pwdcode:'"+pwdcode+"'}",
		false,
		function(data) {
			var str = data.d;
			var obj = JSON.parse(str);
			var load_prize = obj.data;
			$.each(load_prize, function(key, value) {//遍历奖品信息
				var obj = {};//创建对象
				obj.prizeId = value.ID;
				obj.ico = value.ICO;
				turnplate.restaraunts.push(value.PrizeName);//奖品名称push数组
				turnplate.goodsimgArr.push(value.ICO.replace("/myprize",""));//奖品图片push数组
				turnplate.colors.push(value.Col);//奖品颜色push数组
				turnplate.goodsidimgArr.push(obj);//奖品和对应的奖品图片对象 push数组
				
			})
			//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
			preloadimages(turnplate.goodsimgArr).done(function(images){
			 	drawRouletteWheel();
			});
		});
	//获取当前用户可抽奖状态
	function loadprize(){
		ajxs(
			"" + url_api + "gameinfo.asmx/LoadUserState",
			"{userid:'" + userid + "',token:'" + token + "',pwdcode:'"+pwdcode+"'}",
			true,
			function(data){
				var str = data.d;
				var obj = JSON.parse(str);
				console.log(obj);
				var user_Bk = obj.data.UserShell;
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
	function newlist() {
		ajxs(
			"" + url_api + "gameinfo.asmx/LoadDrawNewList",
			"{listtype:0,pagesize:30,pageindex:1,token:'" + token + "',pwdcode:'"+pwdcode+"'}",
			true,
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				//obj.data.reverse();//将数组倒叙排列
				var result = '';
				var name_margin = ''; //用户名字margin
				var icon_img = '';//头像地址
				if(obj.data.length >= 5) {
					for(var i = 0; i < obj.data.length; i++) {
						var subStr1 = obj.data[i].LoginName.substr(0, 3);
						var subStr2 = obj.data[i].LoginName.substr(7, 11);
						var subStr = subStr1 + "***" + subStr2;
						//时间戳转化时间格式
						var nuixtime = obj.data[i].UnixCreateDate;
						var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
						var date_str = nuixTimestamp.getFullYear() + '-' + (nuixTimestamp.getMonth() + 1) + '-' + nuixTimestamp.getDate() + ' ' + nuixTimestamp.getHours() + ':' + nuixTimestamp.getMinutes() + ':' + nuixTimestamp.getSeconds();
						if (obj.data[i].UserICon==="http://test.static.huanbay.com/" || obj.data[i].UserICon==null) {
							icon_img = "img/default-user.png";
						}else{
							icon_img = obj.data[i].UserICon;
						}
						result += "<div class='list'>" +
							"<p>" +
							"恭喜!&nbsp;<span class='icon_wrap' style=background-image:url('" + icon_img + "')></span>" +
							"&nbsp;<span class='ye_margin'>" + obj.data[i].Nickname + "</span>&nbsp;抽到了&nbsp;" +
							"<span class='creat_pri_name'>" + obj.data[i].PrizeName + "</span>" +
							"</p>" +
							"</div>";
					}
					$('.list_wrap').append(result);//创建抽奖用户滚动列表 插入到类名(list_wrap)
					//(callback && typeof(callback) === "function") && callback();
				} else {
					$(".roller").hide();
					clearInterval(n_set);
				}
			}
		)
	}
	var scroll = 0; //滚动中奖用户
	var n_set = setInterval(function(){
		scroll++;
		$(".list_wrap").css('margin-top', -scroll + 'px');
		if(parseInt($(".list_wrap").css('height')) - scroll < parseInt($(".list").css('height'))) {
			newlist(); //调用实时中奖方法
			$(".list").remove();
			scroll = 0;
		}
	}, 100)
	newlist(); //调用实时中奖方法
	
//	var rotateTimeOut = function() {
//		$("#wheelcanvas").rotate({
//			angle: 0,
//			animateTo: 2160,
//			duration: 8e3,
//			callback: function() {
//				//alert("网络超时，请检查您的网络设置！");
//			}
//		});
//	};
	//图片切换 闪灯效果
	var light_timer = '';
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
	var rotateFn = function(item, prizeid, type, winid){
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
				turnplate.bRotate = !turnplate.bRotate;
			}
		});
	};
	
	//抽奖方法
	function lotterymethod(type){
		ajxs(
			"" + url_api + "gameinfo.asmx/StartDraw",
			"{userid:'" + userid + "',type:" + type + ",token:'" + token + "',pwdcode:'"+pwdcode+"'}",
			true,
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var prize_Name = obj.data.PrizeInfoName; //奖品名称
				var prize_Id = obj.data.PrizeInfoID; //奖品Id
				var winning_recordId = obj.data.WinningRecordID; //奖品id编号
				setTimeout(function() {//转盘停止  重置贝壳数量
					$("#bk_num").html(obj.data.ShellCount);
				}, 9e3)
				for (var i=0; i<turnplate.goodsidimgArr.length;i++) {//根据奖品id与初始加载奖品id对比 拿到相应图片
					if (turnplate.goodsidimgArr[i].prizeId == prize_Id) {
						$(".prize_img").attr('src', ""+turnplate.goodsidimgArr[i].ico.replace("myprize","boxprize")+"");
					}
				}
				if(obj.data.PrizeType == 0) {//虚拟物品 无领取按钮
					$(".prize_result").addClass("add_bgsz");
					$(".receive_btn").hide();
					$(".win_prize").html(obj.data.Tips);
				} else {//实物 可领取 跳转领取界面
					$(".prize_result").removeClass("add_bgsz");
					$(".receive_btn").show();
					$(".receive_btn").find('img').attr('src', 'img/receive_btn.png');
					$(".win_prize").html(obj.data.Tips);
					$(".receive_btn").on('touchend', function(event) {
						event.preventDefault();
						$(".cover-div,.prize_result").hide();
						window.location.href = "" + location_href + "/receivePrize.html?userid=" + userid + "&winid=" + winning_recordId + "&name=" + prize_Id + "&ran="+Math.random()+"&pwdcode="+pwdcode+"";
					})
				}
				if(obj.code == 17012) { //如果免费抽奖不足
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
	$("#suer_chong").on('touchend', function(event){
		event.preventDefault();
		if(browser.versions.ios) {
			alert("quhuanbei://com.huanbay.release/home?urltype=48");
		} else if(browser.versions.android) {
			var data = "quhuanbei://com.huanbay.release/home?urltype=48";
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
		window.location.href = "" + location_href + "/myprize.html?userid=" + userid + "&ran="+Math.random()+"&pwdcode="+pwdcode+"";
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
	
	//对奖品图片预加载
	function preloadimages(arr) {
		var newimages = [],
			loadedimages = 0
		var postaction = function() {} //此处增加了一个postaction函数
		var arr = (typeof arr != "object") ? [arr] : arr

		function imageloadpost() {
			loadedimages++
			if(loadedimages == arr.length) {
				postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
			}
		}
		for(var i = 0; i < arr.length; i++) {
			newimages[i] = new Image()
			newimages[i].src = arr[i]
			newimages[i].onload = function() {
				imageloadpost()
			}
			newimages[i].onerror = function() {
				imageloadpost()
			}
		}
		return { //此处返回一个空白对象的done方法
			done: function(f) {
				postaction = f || postaction
			}
		}
	}

	function drawRouletteWheel(){//绘制转盘,渲染方法
		var canvas = document.getElementById("wheelcanvas");
		if(canvas.getContext) {
			//根据奖品个数计算圆周角度
			var arc = Math.PI / (turnplate.restaraunts.length / 2);
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, 422, 422);
			ctx.scale(2, 2);
			//strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
			ctx.strokeStyle = "#FFBE04";
			//font 属性设置或返回画布上文本内容的当前字体属性
			ctx.font = "16px Microsoft YaHei";
			for(var i = 0; i < turnplate.restaraunts.length; i++) {
				var angle = turnplate.startAngle + i * arc;
				//根据奖品参数 绘制扇形填充颜色
				ctx.fillStyle = turnplate.colors[i];
				//开始绘制扇形
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
				var text = turnplate.restaraunts[i];
				var line_height = 17;
				//translate方法重新映射画布上的 (0,0) 位置
				ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
				//rotate方法旋转当前的绘图
				ctx.rotate(angle + arc / 2 + Math.PI / 2);
				/** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
				ctx.fillText(text, -ctx.measureText(text).width / 2, 0 - 20);
				drawImg(-25, 0, 50, 50);//绘制图片到画布
				function drawImg(x, y, w, h) {
					var img = new Image();
					img.src = turnplate.goodsimgArr[i];
					ctx.drawImage(img, x, y, w, h);
				}
				//把当前画布返回（调整）到上一个save()状态之前 
				ctx.restore();
				ctx.save();
			}
		}
	}
		
});