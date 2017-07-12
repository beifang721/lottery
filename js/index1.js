var turnplate = {
    restaraunts:[],
    //大转盘奖品名称
    colors:[],
    //大转盘奖品区块对应背景颜色
    outsideRadius:185,
    //大转盘外圆的半径
    textRadius:135,
    //大转盘奖品位置距离圆心的距离
    insideRadius:55,
    //大转盘内圆的半径
    startAngle:0,
    //开始角度
    bRotate:false
};
$(function() {
		//图片预加载
		var loadingImgs = ["img/roundpan.png","img/roundpan2.png","img/receive.png","img/prize-50.png","img/prize-100.png","img/prize-200.png","img/prize-500.png","img/prize-bei.png","img/prize-ipad.png","img/prize-iphone.png","img/prize-san.png","img/balance-short"];
		var loadingNum = 0;
		for (var i = 0; i < loadingImgs.length; i++){
			var imgObj = new Image();//创建图片对象
			imgObj.src = loadingImgs[i];
			imgObj.onload = function(){
				loadingNum++;
				//判断接近加载完毕的时候进入页面
				
			}
		}
		
		tokenfn();//token值调用
		var userid='';
		userid = GetQueryString("userid");
		//获取当前用户可抽奖状态
		function loadprize() {
			ajxs(
				""+url_api+"gameinfo.asmx/LoadUserState",
			 	"{userid:'"+userid+"',token:'"+token+"'}",
				function(data) {
					var str = data.d;
					var obj = JSON.parse(str);
					console.log(obj);
					var user_Bk = obj.data.UserBK;
					$("#bk_num").html(user_Bk);
					//立即抽奖点击事件
				    $(".pointer").on('touchend',function(event) {
					    event.preventDefault();
						if ($("#bk_num").html() >= 100 && !turnplate.bRotate) {
					      	$(".confirm").css("margin-top",-parseInt($(".confirm").css('height'))/2+'px');
					      	$(".confirm,.cover-div").show();
						} else if ($("#bk_num").html() < 100 && !turnplate.bRotate) {
							$(".confirm_chong").css("margin-top",-parseInt($(".confirm_chong").css('height'))/2+'px');
					      	$(".cover-div,.confirm_chong").show();
						}
				    });
				}
			)
		}
		loadprize();//调用用户可抽奖状态方法
	    //动态添加大转盘的奖品与奖品区域背景颜色
	    ajxs(
			""+url_api+"gameinfo.asmx/LoadPrizeInfo",
		 	"{token:'"+token+"'}",
			function(data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var load_prize = obj.data;
				turnplate.restaraunts = [ ""+load_prize[1].PrizeName+"",""+load_prize[2].PrizeName+"",""+load_prize[3].PrizeName+"",""+load_prize[4].PrizeName+"", ""+load_prize[5].PrizeName+"", ""+load_prize[6].PrizeName+"" , ""+load_prize[7].PrizeName+"", ""+load_prize[0].PrizeName+""];
				//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
//				window.onload = function() {
				    drawRouletteWheel();
//				};
			}
		)
	    //获取实时抽中奖用户
	    function newlist() {
		    ajxs(
		    	""+url_api+"gameinfo.asmx/LoadDrawNewList",
		    	"{listType:0,pageSize:30,pageIndex:1,token:'"+token+"'}",
		    	function (data) {
		    		var str = data.d;
					var obj = JSON.parse(str);
					//obj.data.reverse();//将数组倒叙排列
					var result = '';
					var icon_url = '';//用户头像
					var name_margin = '';//用户名字margin
					if (obj.data.length >= 5) {
						for (var i = 0; i < obj.data.length;i++) {
							var subStr1 = obj.data[i].LoginName.substr(0,3);
			   				var subStr2 = obj.data[i].LoginName.substr(7,11);
			    			var subStr = subStr1 + "***" + subStr2 ;
			    			//时间戳转化时间格式
		 					var nuixtime = obj.data[i].UnixCreateDate;
		 					var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
		 					var date_str = nuixTimestamp.getFullYear()+'-'+(nuixTimestamp.getMonth() +1 )+'-'+nuixTimestamp.getDate()+' '+nuixTimestamp.getHours()+':'+nuixTimestamp.getMinutes()+':'+nuixTimestamp.getSeconds();
							obj.data[i].UserICon == "http://test.static.huanbay.com/"?icon_url="no_icon":icon_url="ye_icon";//判断用户有无头像
							obj.data[i].UserICon == "http://test.static.huanbay.com/"?name_margin="no_margin":name_margin="ye_margin";
							result += 	"<div class='list'>"
											+"<p>"
											+"恭喜!&nbsp;<span class='icon_wrap "+icon_url+"' style=background-image:url('"+obj.data[i].UserICon+"')></span>"
											+"&nbsp;<span class='"+name_margin+"'>"+obj.data[i].Nickname +"</span>&nbsp;抽到了&nbsp;"
											+"<span class='creat_pri_name'>"+ obj.data[i].PrizeName +"</span>"
											+"</p>"
										+"</div>";
						}
						$('.list_wrap').append(result);
						//(callback && typeof(callback) === "function") && callback();
					} else{
						$(".roller").hide();
						clearInterval(n_set);
					}
		    	}
		    )
	    }
	    
	    var scroll = 0;//滚动中奖用户
	    var n_set = setInterval(function() {
	    	scroll++;
	    	$(".list_wrap").css('margin-top',-scroll+'px');
	    	if (parseInt($(".list_wrap").css('height'))-scroll < parseInt($(".list").css('height'))) {
	    		newlist();//调用实时中奖方法
				$(".list").remove();
	    		scroll = 0;
	    	}
	    },100)
		newlist();//调用实时中奖方法
		
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
	    turnplate.colors = [ "#46c9fd","#fe866c", "#acc940", "#fe94c5","#ffd554","#feb344","#cb9cfd","#a8a1fd"];
	    var rotateTimeOut = function() {
	        $("#wheelcanvas").rotate({
	            angle:0,
	            animateTo:2160,
	            duration:8e3,
	            callback:function(){
	                alert("网络超时，请检查您的网络设置！");
	            }
	        });
	    };
	    //图片切换
		var light_timer = '';//图片切换定时器
		function light(){
			var bol = true;
			light_timer = setInterval(function () {
			    if (bol) {
					$(".turnplate").css('background-image','url(img/roundpan.png)');
					bol = false;
				}else {
					$(".turnplate").css('background-image','url(img/roundpan2.png)');
					bol = true;
				}
		     },300)
		}
	    //旋转转盘 item:奖品位置; txt：提示语;
	    var rotateFn = function(item, txt,type,winid) {
	        var angles = item * (360 / turnplate.restaraunts.length) - 360 / (turnplate.restaraunts.length * 2);
	        if (angles < 270) {
	            angles = 270 - angles;
	        } else {
	            angles = 360 - angles + 270;
	        }
	        $("#wheelcanvas").stopRotate();
	        $("#wheelcanvas").rotate({
	            angle:0,
	            animateTo:angles + 3600,
	            duration:8e3,
	            callback:function() {
	            	clearInterval(light_timer);//清楚幻灯片定时器
	            	$(".cover-div").show();//转盘停止弹框block
		            $(".prize_result").show();
	                //弹出抽到的奖品
	                //修改
	                if (type == 0) {
		                var prize = '';
		                if (txt.indexOf("20贝壳") > -1) {
		                	prize = "5";
		                } else if(txt.indexOf("80贝壳") > -1){
		                	prize = "6";
		                } else if(txt.indexOf("200贝壳") > -1){
		                	prize = "7";
		                } else if(txt.indexOf("500贝壳") > -1){
		                	prize = "8";
		                } 
		                $(".receive_btn").on('touchend',function(event) {
		                	event.preventDefault();
		                	$(".cover-div,.prize_result").hide();
		                	window.location.href = ""+location_href+"lottery/virtualPrize.html?userid="+userid+"&winid="+winid+"&name="+prize+"";
		                })
	                } else{
		                var prize = '';
		                if (txt.indexOf("定制雨伞") > -1) {
		                	$(".prize_img").attr('src',"img/prize-san.png");
		                	prize = "1";
		                } else if(txt.indexOf("定制马克杯") > -1){
		                	$(".prize_img").attr('src',"img/prize-bei.png");
		                	prize = "2";
		                } else if(txt.indexOf("Iphone7") > -1){
		                	$(".prize_img").attr('src',"img/prize-iphone.png");
		                	prize = "3";
		                } else if(txt.indexOf("IpadMini") > -1){
		                	$(".prize_img").attr('src',"img/prize-ipad.png");
		                	prize = "4";
		                }
		                $(".receive_btn").on('touchend',function(event) {
		                	event.preventDefault();
		                	$(".cover-div,.prize_result").hide();
		                	window.location.href = ""+location_href+"lottery/receivePrize.html?userid="+userid+"&winid="+winid+"&name="+prize+"";
		                })
		                
	                }
	                turnplate.bRotate = !turnplate.bRotate;
	            }
	        });
	    };
	    
	    //抽奖方法
	    function lotterymethod() {
	    	ajxs(
	        	""+url_api+"gameinfo.asmx/StartDraw",
	        	"{userid:'"+userid+"',type:0,token:'"+token+"'}",
	        	function(data){
	        		var str = data.d;
					var obj = JSON.parse(str);
					var prize_Name = obj.data.PrizeInfoName;//奖品名称
					var winning_recordId = obj.data.WinningRecordID;//奖品id编号
					setTimeout(function() {
						$("#bk_num").html(obj.data.ShellCount);
					},9e3)
					if (obj.data.PrizeType==0) {
						$(".receive_btn").find('img').attr('src','img/chakna_btn.png');
						$(".win_prize").html(obj.data.Tips);
						if (prize_Name.indexOf("20贝壳") > -1) {
		                	$(".prize_img").attr('src',"img/prize-50.png");
		                	prize = "5";
		                } else if(prize_Name.indexOf("80贝壳") > -1){
		                	$(".prize_img").attr('src',"img/prize-100.png");
		                	prize = "6";
		                } else if(prize_Name.indexOf("200贝壳") > -1){
		                	$(".prize_img").attr('src',"img/prize-200.png");
		                	prize = "7";
		                } else if(prize_Name.indexOf("500贝壳") > -1){
		                	$(".prize_img").attr('src',"img/prize-500.png");
		                	prize = "8";
		                } 
					} else{
						$(".receive_btn").find('img').attr('src','img/receive_btn.png');
						$(".win_prize").html(obj.data.Tips);
						if (prize_Name.indexOf("定制雨伞") > -1) {
		                	$(".prize_img").attr('src',"img/prize-san.png");
		                	prize = "1";
		                } else if(prize_Name.indexOf("定制马克杯") > -1){
		                	$(".prize_img").attr('src',"img/prize-bei.png");
		                	prize = "2";
		                } else if(prize_Name.indexOf("Iphone7") > -1){
		                	$(".prize_img").attr('src',"img/prize-iphone.png");
		                	prize = "3";
		                } else if(prize_Name.indexOf("IpadMini") > -1){
		                	$(".prize_img").attr('src',"img/prize-ipad.png");
		                	prize = "4";
		                }
					}
					if (obj.data == "奖品数量不足") {//如果奖品数量不足再次调用方法
						lotterymethod();
					}else{
						for (var i = 0;i < turnplate.restaraunts.length;i++) {
							if (turnplate.restaraunts[i] == prize_Name) {
								console.log(turnplate.restaraunts[i]);
								rotateFn(i+1, obj.data.Tips,obj.data.PrizeType,winning_recordId);//得到奖品名称,指针落在对应奖品区域的中心角度
							}
						}
					}
	        	}
	        )
	    }
	    //抽奖二次确认按钮确认点击事件
	    $("#suer_btn").on('touchend',function(event) {
	    	event.preventDefault();
	    	$("#bk_num").html(parseInt($("#bk_num").html())-100);
	    	$(".confirm,.cover-div").hide();
	    	light();
		    if (turnplate.bRotate) return;//转盘在转动不可点击
		    turnplate.bRotate = !turnplate.bRotate;
		    lotterymethod();
	    })
	    //充值点击事件
	    $("#suer_chong").on('touchend',function(event) {
	    	event.preventDefault();
	    	if(browser.versions.ios) {
					alert("quhuanbei://com.huanbay.release/home?urltype=20");
			} else if(browser.versions.android) {
				var data = "quhuanbei://com.huanbay.release/home?urltype=20";
				var strData = JSON.stringify(data);
				window.AndroidTehuiInfo.hui(strData);//与android约定相同的类和类下的方法名
			}
	    	$(".confirm,.confirm_chong,.cover-div").hide();
	    })
	    //二次确认按钮取消点击事件
	    $("#close_btn,#close_chong").on('touchend',function(event) {
	    	event.preventDefault();
	    	$(".confirm,.confirm_chong,.cover-div").hide();
	    })
	    //我的奖品点击事件
	    $(".person_prizebtn").on('touchend',function(event) {
	    	event.preventDefault();
	    	window.location.href = ""+location_href+"lottery/myprize.html?userid="+userid+"";
	    })
	    //蒙版点击事件
	    $(".cover-div").on('touchend',function(event) {
	    	event.preventDefault();
	    	$(".cover-div,.prize_result,.confirm,.confirm_chong").hide();
	    })
	    //点击close-img 隐藏弹框和蒙版
	    $(".close-img").on('touchend',function(event) {
	    	event.preventDefault();
	    	$(".cover-div,.prize_result,.confirm_chong").hide();
	    })
	    //全局提示弹框
		function popup(str){
		 	var info = $("<div class='Box'>"+str+"</div>");
		 	info.prependTo($("body"));
	    	info.animate({"opacity":0},3000,function(){
				info.remove();
		    });	
		}
		
		
		function drawRouletteWheel() {
		    var canvas = document.getElementById("wheelcanvas");
		    if (canvas.getContext) {
		        //根据奖品个数计算圆周角度
		        var arc = Math.PI / (turnplate.restaraunts.length / 2);
		        var ctx = canvas.getContext("2d");
		        ctx.scale(2,2);
		        //在给定矩形内清空一个矩形
		        ctx.clearRect(0, 0, 422, 422);
		        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
		        ctx.strokeStyle = "#FFBE04";
		        //font 属性设置或返回画布上文本内容的当前字体属性
		        ctx.font = "16px Microsoft YaHei";
		        for (var i = 0; i < turnplate.restaraunts.length; i++) {
		            var angle = turnplate.startAngle + i * arc;
		            ctx.fillStyle = turnplate.colors[i];
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
		            if (text.indexOf("N") > 0) {
		                //流量包
		                var texts = text.split("N");
		                for (var j = 0; j < texts.length; j++) {
		                    ctx.font = j == 0 ? "bold 20px Microsoft YaHei" :"16px Microsoft YaHei";
		                    if (j == 0) {
		                        ctx.fillText(texts[j] + "N", -ctx.measureText(texts[j] + "N").width / 2, j * line_height);
		                    } else {
		                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
		                    }
		                }
		            } else if (text.indexOf("N") == -1 && text.length > 15) {
		                //奖品名称长度超过一定范围 
		                text = text.substring(0, 6) + "||" + text.substring(6);
		                var texts = text.split("||");
		                for (var j = 0; j < texts.length; j++) {
		                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
		                }
		            } else {
		                //在画布上绘制填色的文本。文本的默认颜色是黑色
		                //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
		                ctx.fillText(text, -ctx.measureText(text).width / 2, 0-20);
		            }
		            //添加对应图标
		            if (text.indexOf("定制马克杯") >= 0) {
		                var img = document.getElementById("cup-img");
		//              drawImg();
		                img.onload = function() {
		                    ctx.drawImage(img, -20, 0,51,50);
		                };
		                ctx.drawImage(img, -20, 0,51,50);
		            } else if (text.indexOf("20贝壳") >= 0) {
		                var img = document.getElementById("halfcoupon-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -30, 10,60,30);
		                };
		                ctx.drawImage(img, -30, 10,60,30);
		            } else if (text.indexOf("80贝壳") >= 0) {
		                var img = document.getElementById("onecoupon-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -30, 10,60,30);
		                };
		                ctx.drawImage(img, -30, 10,60,30);
		            } else if (text.indexOf("200贝壳") >= 0) {
		                var img = document.getElementById("twocoupon-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -30, 10,60,30);
		                };
		                ctx.drawImage(img, -30, 10,60,30);
		            } else if (text.indexOf("500贝壳") >= 0) {
		                var img = document.getElementById("fivecoupon-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -30, 10,60,30);
		                };
		                ctx.drawImage(img, -30, 10,60,30);
		            } else if (text.indexOf("Iphone 7") >= 0) {
		                var img = document.getElementById("iphone-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -15, 0,30,61);
		                };
		                ctx.drawImage(img, -15, 0,30,61);
		            } else if (text.indexOf("IpadMini") >= 0) {
		                var img = document.getElementById("ipad-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -20, 0,65,62);
		                };
		                ctx.drawImage(img, -20, 0,65,62);
		            } else if (text.indexOf("定制雨伞") >= 0) {
		                var img = document.getElementById("umbrella-img");
		                img.onload = function() {
		                    ctx.drawImage(img, -40, 10,78,43);
		                };
		                ctx.drawImage(img, -40,10,78,43);
		            }
		            
		            function drawImg() {
		            	img.onload = function() {
		                    ctx.drawImage(img, -20, -5);//后两个参数调整小图标位置
		                };
		                ctx.drawImage(img, -20, -5);
		            }
		            //把当前画布返回（调整）到上一个save()状态之前 
		            ctx.restore();
		        }
		//      var nameImg = document.getElementById('name');
		//      nameImg.onload = function() {
		//          ctx.drawImage(nameImg, 35, 35,350,350);
		//      };
		//      ctx.drawImage(nameImg, 35, 35,350,350);
		    }
		} 

})
