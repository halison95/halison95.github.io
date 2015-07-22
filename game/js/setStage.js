function setStage(x){
	//返回参量的结构
	var stage = {
		map: [],//obj设定
		player: {},//player设定
		view: {}//画布设定
	}
	
	switch (x)
	{
		case 0://第0关
		{
			stage.view.task = "活下去。";
			stage.view.cx = 0;
			stage.view.cy = 0;
			stage.view.pw = 800;
			stage.view.ph = 600;
			stage.player.x = 400;
			stage.player.y = 300;
			stage.player.r = 30;
			break;
		}
		case 1://第1关
		{
			stage.view.task = "尽可能快地把他们剿灭干净。";
			stage.view.cx = 300;
			stage.view.cy = 200;
			stage.view.pw = 1400;
			stage.view.ph = 1000;
			stage.player.x = 700;
			stage.player.y = 500;
			stage.player.r = 30;
			
			stage.map = [
				{x:110, y:110, r:100, type:0, vx:0, vy:0},
				{x:200, y:530, r:40, type:0, vx:0, vy:0},
				{x:230, y:860, r:90, type:0, vx:0, vy:0},
				{x:390, y:630, r:60, type:0, vx:0, vy:0},
				{x:410, y:270, r:30, type:0, vx:0, vy:0},
				{x:420, y:490, r:30, type:0, vx:0, vy:0},
				{x:475, y:400, r:15, type:0, vx:0, vy:0},
				{x:520, y:330, r:35, type:0, vx:0, vy:0},
				{x:580, y:440, r:50, type:0, vx:0, vy:0},
				{x:600, y:350, r:15, type:0, vx:0, vy:0},
				{x:670, y:300, r:20, type:0, vx:0, vy:0},
				{x:710, y:770, r:90, type:0, vx:0, vy:0},
				{x:815, y:360, r:85, type:0, vx:0, vy:0},
				{x:835, y:675, r:30, type:0, vx:0, vy:0},
				{x:950, y:920, r:45, type:0, vx:0, vy:0},
				{x:1020, y:640, r:120, type:0, vx:0, vy:0},
				{x:1180, y:300, r:155, type:0, vx:0, vy:0}
			];
		}
		break;
		case 2://第2关
		{
			stage.view.task = "尽可能快地把他们剿灭干净。";
			stage.view.cx = 300;
			stage.view.cy = 200;
			stage.view.pw = 1400;
			stage.view.ph = 1000;
			stage.player.x = 700;
			stage.player.y = 500;
			stage.player.r = 30;
			
			stage.map = [
				{x:110, y:110, r:80, type:0, vx:-5, vy:-5},
				{x:200, y:530, r:40, type:0, vx:-10, vy:-1},
				{x:230, y:860, r:70, type:0, vx:5, vy:8},
				{x:390, y:630, r:60, type:0, vx:5, vy:-4},
				{x:410, y:270, r:30, type:0, vx:8, vy:10},
				{x:420, y:490, r:30, type:0, vx:7, vy:0},
				{x:475, y:400, r:15, type:0, vx:0, vy:0},
				{x:520, y:330, r:35, type:0, vx:5, vy:-10},
				{x:550, y:610, r:20, type:0, vx:5, vy:-7},
				{x:580, y:440, r:30, type:0, vx:3, vy:3},
				{x:600, y:350, r:15, type:0, vx:10, vy:0},
				{x:660, y:610, r:15, type:0, vx:8, vy:3},
				{x:670, y:300, r:20, type:0, vx:1, vy:10},
				{x:710, y:770, r:60, type:0, vx:-2, vy:3},
				{x:800, y:520, r:15, type:0, vx:-15, vy:-3},
				{x:815, y:360, r:65, type:0, vx:1, vy:1},
				{x:835, y:675, r:30, type:0, vx:0, vy:1},
				{x:950, y:920, r:45, type:0, vx:3, vy:10},
				{x:1020, y:640, r:80, type:0, vx:4, vy:1},
				{x:1180, y:300, r:95, type:0, vx:5, vy:-5}
			];
		}
		break;
		case 3://第3关
		{
			stage.view.task = "尽可能快地把他们剿灭干净。";
			stage.view.cx = 300;
			stage.view.cy = 200;
			stage.view.pw = 1400;
			stage.view.ph = 1000;
			stage.player.x = 700;
			stage.player.y = 500;
			stage.player.r = 30;
			
			stage.map = [
				{x:110, y:110, r:80, type:0, vx:-5, vy:-5},
				{x:200, y:530, r:40, type:1, vx:-10, vy:-1},
				{x:230, y:860, r:70, type:0, vx:5, vy:8},
				{x:390, y:630, r:60, type:0, vx:5, vy:-4},
				{x:410, y:270, r:30, type:1, vx:8, vy:10},
				{x:420, y:490, r:30, type:0, vx:7, vy:0},
				{x:475, y:400, r:15, type:0, vx:0, vy:0},
				{x:520, y:330, r:35, type:0, vx:5, vy:-10},
				{x:550, y:610, r:20, type:1, vx:5, vy:-7},
				{x:580, y:440, r:30, type:0, vx:3, vy:3},
				{x:600, y:350, r:15, type:0, vx:10, vy:0},
				{x:660, y:610, r:15, type:0, vx:8, vy:3},
				{x:670, y:300, r:20, type:0, vx:1, vy:10},
				{x:710, y:770, r:60, type:0, vx:-2, vy:3},
				{x:800, y:520, r:15, type:0, vx:-15, vy:-3},
				{x:815, y:360, r:65, type:0, vx:1, vy:1},
				{x:835, y:675, r:30, type:0, vx:0, vy:1},
				{x:875, y:470, r:20, type:1, vx:-20, vy:3},
				{x:950, y:920, r:35, type:1, vx:3, vy:10},
				{x:1020, y:640, r:80, type:0, vx:4, vy:1},
				{x:1180, y:300, r:80, type:0, vx:5, vy:-5}
			];
		}
		break;
		case 4://第4关
		{
			stage.view.task = "尽可能快地把他们剿灭干净。";
			stage.view.cx = 300;
			stage.view.cy = 200;
			stage.view.pw = 1400;
			stage.view.ph = 1000;
			stage.player.x = 700;
			stage.player.y = 500;
			stage.player.r = 30;
			
			var objnum = 30;
			var isGoodObj = true;
			var objt;
			for (var i = 0; i < objnum; i++){
				objt = new Object;
				do{
					isGoodObj = true;
					//随机构造obj
					objt.x = Math.floor(Math.random()*1200)+100;
					objt.y = Math.floor(Math.random()*800)+100;
					objt.r = Math.floor(Math.random()*50)+5;
					objt.vx = Math.floor(Math.random()*30)-15;
					objt.vy = Math.floor(Math.random()*30)-15;
					objt.type = Math.random()>0.2 ? 0 : 1;
					//若构建的obj与player初始位置过近，则重新生成一个obj
					var dd;
					dd = Math.sqrt((objt.x-stage.player.x)*(objt.x-stage.player.x)+(objt.y-stage.player.y)*(objt.y-stage.player.y))-stage.player.r-objt.r;
					console.log("P:"+dd);
					if (dd < 15){
						isGoodObj = false;
						continue;
					}
					
					for (var j = 0; j < i; j++){
						dd = Math.sqrt((objt.x-stage.map[j].x)*(objt.x-stage.map[j].x)+(objt.y-stage.map[j].y)*(objt.y-stage.map[j].y))-stage.map[j].r-objt.r;
						console.log(objt);
						console.log(j);
						console.log(stage.map[j]);
						debugger;
						//alert("O:"+dd);
						if (dd < 10){
							isGoodObj = false;
							break;
						}
					}
				}while(!isGoodObj);
				stage.map.push(objt);
			}
		}
		break;
	}
	return stage;
}