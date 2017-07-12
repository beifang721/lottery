$(function() {
	tokenfn();//token值掉用
    var pageSize = 10;
	var currentPage=1;
    function datefn(){
	    ajxs(
			""+url_api+"gameinfo.asmx/LoadUserDrawPrizeInfo",
			"{userid:'"+userid+"',pageindex:'"+currentPage+"',pagesize:'"+pageSize+"',token:'"+token+"',pwdcode:'"+pwdcode+"'}",
			true,
			function (data) {
				var str = data.d;
				var obj = JSON.parse(str);
				var result = '';
	            var left_icon = '';//定义左图标
	            var flag = '';//定义data-flag的值跳转不同界面
	            var xu_or_shi = '';//定义实物和虚拟物品
	            var no_or_yereceive = '';//是否领取
	            var receive_img = '';//领取,未领取,失效的图标
	            //console.log(obj);
	            if (obj.data.length >0) {
	            	creathtml (data,obj,result)
	            }else if(obj.data.length <= 0){
					$(".no_data").show();
	            }
			},
			function (xhr) {
				//alert('加载错误');
			}
		)
    }
   	datefn();
   	//下拉刷新
	var scroll = document.querySelector('.scroll');
	var outerScroller = document.getElementById("content_down");
	var touchStart = 0;
	var touchDis = 0;
	outerScroller.addEventListener('touchstart', function(event) {
		var touch = event.targetTouches[0];
		// 把元素放在手指所在的位置 
		touchStart = touch.pageY;
	}, false);
	outerScroller.addEventListener('touchmove', function(event) {
		var touch = event.targetTouches[0];
		scroll.style.top = scroll.offsetTop + touch.pageY - touchStart + 'px';
		console.log(scroll.style.top);
		touchStart = touch.pageY;
		touchDis = touch.pageY - touchStart;
		if (parseInt(scroll.style.top) < 50&&parseInt(scroll.style.top)>0) {
			$("#down").show().html('↓下拉刷新');
		}
		if(parseInt(scroll.style.top)>50){
			$("#down").show().html('↑释放更新');
		}
		if (parseInt(scroll.style.top) < 0) {//向上滑动到底部 不可拖动
			scroll.style.top = 0 + 'px';
		}
	}, false);
	outerScroller.addEventListener('touchend', function(event) {
		touchStart = 0;
		$("#down").hide()
		var top = scroll.offsetTop;
		if(top >= 50) {//下拉大于50松开  刷新
			$(".scroll").css('top',40+'px');
			$("#refresh").show();
			setTimeout(function() {
				window.location.reload(true);
			},1500)
		}
		if(top < 50 && top >0) {
			var time = setInterval(function() {
				scroll.style.top = scroll.offsetTop - 2 + 'px';
				if(scroll.offsetTop <= 0) clearInterval(time);
			}, 1)
		}
	}, false);
	
	
   	
   	
   	//上拉加载
    $(document).ready(function(){
        var range = 50;             //距下边界长度/单位px
        var maxnum = 50;            //设置加载最多次数
        var num = 1,mums= 1,numx=1;
        var totalheight = 0;
        var bol = 0; //控制数据是否请求完毕
        $(this).scroll(function(){
            var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
            totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
            if(($(".scroll").height()-range) <= totalheight  && num != maxnum && bol==0) {
            	bol = 1;
                num++;
                setTimeout(function (){
                	 ajxs(
						""+url_api+"gameinfo.asmx/LoadUserDrawPrizeInfo",
						"{userid:'"+userid+"',pageindex:'"+(currentPage+1)+"',pagesize:'"+pageSize+"',token:'"+token+"',pwdcode:'"+pwdcode+"'}",
						true,
						function (data) {
							var str = data.d;
							var obj = JSON.parse(str);
							var result = '';
				            var left_icon = '';//定义左图标
				            var flag = '';//定义data-flag的值跳转领取和未领取不同界面
				            var xu_or_shi = '';//定义实物和虚拟物品
				            var no_or_yereceive = '';//是否领取
				            var receive_img = '';//领取,未领取,失效的图标
				            $(".loading").remove();
			            	
			            	if(obj.data.length>0){
				    			creathtml (data,obj,result) 
								currentPage++;
						    }else{
						    	$(".load_end").html("没有更多了");
						    }
						    bol =0;
						},
						function (xhr) {
							alert('加载错误');
							bol =0;
						}
					)
	           	}, 1000); 
	           

            }
        });
    });
    function creathtml (data,obj,result) {
    	for(var i = 0; i < obj.data.length; i++){
        	//时间戳转化时间格式
//			var nuixtime = obj.data[i].UnixCreateDate;
//			var nuixTimestamp = new Date(parseInt(nuixtime) * 1000);
//			var creatime = nuixTimestamp.getFullYear()+'.'+(nuixTimestamp.getMonth() +1 )+'.'+nuixTimestamp.getDate()+' '+nuixTimestamp.getDate();
			
			var createDate = obj.data[i].CreateDate;
			var creatsplit = createDate.split("T");
			var creatarr = creatsplit[1].split(".");
			var creatime = creatsplit[0]+' '+creatarr[0];
			var flag ='';
        	if(obj.data[i].IsUse == 3) {//判断奖品是否领取,改变右字体颜色和图标
        		no_or_yereceive = '已领取';
        		receive_img = 'img/myprize/yescollar.png';//
        		var a = "yes_ling";
        		flag = 1;
        	}else if((obj.data[i].IsUse == 0)){
        		no_or_yereceive = '未领取';
        		receive_img = 'img/myprize/notcollar.png';
        		var a = "not_ling";
        		flag = 0;
        	} else if((obj.data[i].IsUse == 2)) {
        		no_or_yereceive = '已失效';
        		receive_img = 'img/myprize/close-img.png'
        		var a = "shi_ling";
        		flag = 2;
        	}else if((obj.data[i].IsUse == 1)) {
        		no_or_yereceive = '已发货';
        		flag = 1;
        		receive_img = 'img/myprize/yescollar.png';//
        		var a = "yes_ling";
        	}
        	if (obj.data[i].PrizeName.indexOf('贝壳') >-1) {
        		xu_or_shi = 'xu';
        		receive_img="img/myprize/yescollar.png";
        		no_or_yereceive="已领取";
        		var a = "yes_ling";
        	} else {
        		xu_or_shi = 'shi';
        	}
        	//判断虚拟或者实物
        	for (var j=0; j<prizeid_imgArr.length;j++) {//根据奖品id与加载的id对比 拿到图片
				if (prizeid_imgArr[j].prizeId == obj.data[i].PrizeID) {
					left_icon = ""+prizeid_imgArr[j].ico+"";
				}
			}
        	result 	+= 	"<ul class='list_wrap' data-flag ='"+flag+"' data-xu-shi='"+xu_or_shi+"'>"
        					+"<li class='list_each'>"
        						+"<img class='left' class='my_san' src='"+left_icon+"'></img>"
        						+"<div class='date'>"
									+"<p class='prize_p'>"+obj.data[i].PrizeName+"</p>"
									+"<p>"+creatime+"</p>"
									+"<p class='prize_id' style='display:none'>"+obj.data[i].PrizeID+"</p>"
								+"</div>"
								+"<div class='status'>"
									+"<img align='absmiddle' src='"+receive_img+"'/>"
									+"<span class='"+a+"'>"+no_or_yereceive+"</span>"
									+"<span class='wingid'>"+obj.data[i].ID+"</span>"
								+"</div>"
							+"</li>"
						+"</ul>"
        }
    	$('.lists').append(result);	//创建奖品列表 插入类名lists中
    	if (obj.data.length>=10) {
    		$('<p class="loading"><span></span> 加载中...</p>').appendTo(".lists");
    	}
    }
        
	$(".mask,#suer").on('touchend',function (event) {
		event.preventDefault();
		$(".mask,.confirm").hide();
	})
	$(document).on('click','.list_wrap',function(event){
	 	if ($(this).attr("data-flag") == 2) {
	 		$(".mask").css('height',$(".scroll").height());
	 		$(".confirm").css('top',$(window).height()/2+$(window).scrollTop()+'px');
			$(".confirm,.mask").css('display','block');
		}
	})
		
    var dragging = false;
   	$(document).on('touchmove','.list_wrap',function(event){
        dragging = true;
    });
   	$(document).on('touchend','.list_wrap',function(event){
//　　　　　event.preventDefault();
        if(dragging){
            return;
        }else{
			var winid = $(this).find(".wingid").html();//赢得奖品的id
			var prize_id = $(this).find(".prize_id").html();//初始奖品id
			if ($(this).attr("data-flag") == 0 && $(this).attr("data-xu-shi") == 'shi') {
				window.location.href = ""+location_href+"/receivePrize.html?userid="+userid+"&winid="+winid+"&name="+prize_id+"&pwdcode="+pwdcode+"&ran="+Math.random()+"";
			}else if ($(this).attr("data-flag") == 1 && $(this).attr("data-xu-shi") == 'shi') {
				window.location.href = ""+location_href+"/Logistics.html?userid="+userid+"&winid="+winid+"&name="+prize_id+"&pwdcode="+pwdcode+"&ran="+Math.random()+"";
			}
			if ($(this).attr("data-xu-shi") == 'xu') {
				window.location.href = ""+location_href+"/virtualPrize.html?userid="+userid+"&winid="+winid+"&name="+prize_id+"&pwdcode="+pwdcode+"&ran="+Math.random()+"";
			}
        }
    });
    $(document).on('touchstart','.list_wrap',function(event){
        dragging = false;
    });
})
