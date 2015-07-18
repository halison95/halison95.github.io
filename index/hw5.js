var ListOfPicAlt = ["吐","哈哈","调皮","啊","帅","怒","汗","哭","黑线","鄙视","不爽","赞","疑问","阴险","委屈","大笑","滑稽","狂汗","可爱","吓哭"];//ListOfPicAlt[x]代表icon/x.png的含义，用于传输，如#哭#


	var isIconOn = 0;                  //记录当前表情弹出框是否显示
	var isIconPushed = 0;              //---
	var userList = new Object;         //本地同步到的用户列表
	var msgList = $('#msgList');       //信息列表
	var msgText = $('#msgText');       //信息输入框
	var nameLabel = $('#name');        //本人昵称显示框
	var onlineList = $('#userList');   //用户列表显示框
	var send = $('#send');             //发送按钮
	var addEm = $('#addEm');           //---
	var popup = $('#popup');           //弹出菜单
	var getUserList = false;           //是否开始获得数据
	var numLabel = $('#num');          //在线用户数量框
	var num = 0;                       //在线用户数

	var mainRef = new Firebase('https://halison95-server.firebaseio.com/');    
	var userRef = mainRef.child('user');       
	var msgRef = mainRef.child('msg');

	var name;              //本人昵称
	
    //向弹出框添加图像
		function buildImg(){
			for(var i = 0; i < 10; i++){
				var toAppend = "<img src=icon/" + i + ".png class='img' alt='"+ListOfPicAlt[i]+"' onclick=\"javascript:msgText.attr('value',msgText.attr('value')+'#" + ListOfPicAlt[i] + "#');\"/>";
				console.log(toAppend);
				$(toAppend).appendTo($(popupUpLine));
				//$('#popupUpLine').append(toAppend);
			}
			for(var i = 10; i < 20; i++){
				var toAppend = "<img src=icon/" + i + ".png class='img' alt='"+ListOfPicAlt[i]+"' onclick=\"javascript:msgText.attr('value',msgText.attr('value')+'#" + ListOfPicAlt[i] + "#');\"/>";
				console.log(toAppend);
				$(toAppend).appendTo($(popupDownLine));
				//$('#popupDownLine').append("<img src=icon/" + i + ".png class='img' alt='"+ListOfPicAlt[i]+"' onclick={javascript:msgText.attr('value') = msgText.attr('value') + '#" + ListOfPicAlt[i] + "#'}/>");
			}	
		}

    //开始获得数据
	mainRef.once("child_added",function(){
		getUserList = true;
	});

    //增加用户
	userRef.on("child_added", function(snapshot){
		userList[snapshot.val()] = true;
		$('#userList').append("<li>" + snapshot.val() +"</li>");
		num++;
		numLabel.html(num);
	});

    //用户离开用户
	userRef.on("child_removed", function(snapshot){
		userList[snapshot.val()] = false;
		onlineList.html("");
		for(var i in userList){
			if(userList[i] == true){
				onlineList.append("<li>" + i + "</li>");
			}
		}
		num--;
		numLabel.html(num);
	});

    //判断用户名合法性，并提示
	function isValid(str){
        if(str === null || str === "" || str === "null"){
			alert("昵称不能为空！");
			return false;
		}
        else if(!(str.length > 2)){
            alert("昵称不能少于2个汉字！");
            return false;
        }
		else if(str.length > 22){
			alert("昵称不能超过11个汉字！");
			return false;
		}
		else if(userList[str] == undefined || userList[str] == false){
			return true;
		}
		else{
			alert("昵称已存在！");
			return false;
		}
	}

    //  ：只有在获取到数据时才开始运行，否则会一直遮住
	setTimeout(function(){
		if(getUserList){
			start();
		}
		else setTimeout(arguments.callee, 1000);
	},1000);

    //把传来信息的转移符号换成图片HTML
	function replaceIcon(text){
		for(var i = 0; i < 20; i++){
			var toReplace = "<img src = 'icon/"+i+".png' alt='"+ListOfPicAlt[i]+"'/>";
			text = text.replace(new RegExp("#"+ListOfPicAlt[i]+"#", 'g'), toReplace);
		}
		return text;
	}

    //左侧的是别人的话
	function buildLeft(user,time, text){
		var ret = '<div style="margin-bottom:5px;float: left;"><div style="padding: 3px 20px 0 15px;background: transparent url(\'comment_box_main.png\') no-repeat;float: left;margin-bottom: 0px;width:400px"><small style="font-size: 12px;color:#4ac">';
		ret += user;
		ret += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style="color:#358477">';
		ret += time;
		ret += '</span></small><p style="margin:0px;max-width:370px">';
		ret += replaceIcon(text);
		ret += '</p></div><div style="background: url(\'comment_box_bottom.png\') no-repeat;width: 400px;height: 9px;clear:both"></div></div>';
		return ret;
	}

    //右侧的是自己的话
	function buildRight(user, time, text){
		var ret = '<div style="margin-bottom:5px;float:right;"><div style="padding: 3px 0 0 20px;background: transparent url(\'comment_box_main2.png\') no-repeat;float: right;margin-right: -20px;width:400px"><small style="font-size: 12px;color:#4ac">';
		ret += user;
		ret += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<span style="color:#358477">';
		ret += time;
		ret += '</span></small><p style="margin:0px;max-width:370px">';
		ret += replaceIcon(text);
		ret += '</p></div><div style="background: url(\'comment_box_bottom.png\') no-repeat;width: 400px;height: 9px;clear:both"></div>			</div>';
		return ret;
	}

    //发信息
	function sendMsg(){
		msgRef.push({name:name, time:new Date().toLocaleString(), text:msgText.attr('value')});
		msgText.attr('value',"");
	}


	function start(){
		name = prompt("请输入你的昵称","Guest");
		while(!isValid(name)){
			name = prompt("请重新输入昵称","Guest");
		}
        //本机在数据库中的记录位置
		var myNameRef = userRef.push();

        // ： 提醒服务器，断开连接时将本机删除
		myNameRef.onDisconnect().remove();

		myNameRef.set(name);
		nameLabel.html(name);
		$("#Modal_divs_bg").css("display","none");

		buildImg();

        //限定只允许获得最后20个元素
		msgRef.limitToLast(20).on("child_added",function(snapshot){
			var data = snapshot.val();
			var user = data.name;
			var time = data.time;
			var text = data.text;
			if(user == name){    //判断是否是本人
				msgList.append(buildRight(user, time, text));
			}
			else{
				msgList.append(buildLeft(user, time, text));
			}
			msgList[0].scrollTop = msgList[0].scrollHeight;
			console.log(msgList.scrollHeight+","+msgList.scrollTop);
		})

        //回车发送
		msgText.keypress(function(e){
			if(e.keyCode == 13){
				sendMsg();
			}
		});

        //点击按钮发送
		send.click(function(){
			sendMsg();
		});

	}
