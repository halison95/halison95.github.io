var page = 0;	//0:选关		1:过程		2：结束

var canvas = $('#mainCanvas')[0];
var ctx = canvas.getContext('2d');
var canvasOV = $('#overViewCanvas')[0];
var ctxov = canvasOV.getContext('2d');

var animeInv = 20;
var buildInv = 500;
var nowAt = 0;

var isWin;

var scale;
var overView = 0;
var ovcw, ovch;

var animeTimer;
var buildTimer;

var interval = 50;//间隔50毫秒检查按键
var cw=800,ch=600;//画布宽高
var pw=1600,ph=1200;
var cx = 0,cy = 0;
var arrObj = new Array();
var arrIn = new Array();
var keyState = {};
var minInterval = 25;

var mainTimer;

var player; 

var time;
var stageNum;

//type:0 v++; 1 v--; 

function Obj(x,y,r,t,vx,vy){
	this.x=x;
	this.y=y;
	this.sr=r;
	this.r=r;
	this.type=t;
	this.vx =vx;
	this.vy =vy;
	this.dx= signal(vx);
	this.dy= signal(vy);
}



function eat(A, B){
	var d = Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y));
	var Rs = {};
	var k = 1;
	//两球相离
	if (A.r+B.r<d){
		Rs['A'] = 0;
		Rs['B'] = 0;
		return Rs;
	}
	var R, r, big, small;
	//根据半径大小替换标记
	if (A.r >= B.r){
		R = A.r;
		r = B.r;
		big = 'A';
		small = 'B';
	}
	else{
		R = B.r;
		r = A.r;
		big = 'B';
		small = 'A';
	}
	//根据种类设置参量符号
	var typek = A.type == B.type ? 1 : -1;
	
	if (R >= d){//小球圆心在大球内部
		Rs[big] = r*r*r/R/R*k * typek;
		Rs[small] = -r;
	}
	else{//一般情况下的相交
		Rs[big] = (R+r-d)*r*r/R/R * typek;
		Rs[small] = d-R-r;
	}
	return Rs;
}

function absorbObj(){
	var d_r_p = 0, //player的累计r变化
		d_r = new Array(arrObj.length); //obj的累计r变化
	//初始化数组
	for (var i = 0; i < d_r.length; i++){
		d_r[i] = 0;
	}
	var Rs;
	//计算player与obj间的相互影响
	for (var i in arrObj){
		Rs = eat(player, arrObj[i]);
		d_r_p += Rs['A'];
		d_r[i] += Rs['B'];
	}
	//计算obj间的相互影响
	for (var i = 0; i < arrObj.length; i++){
		for (var j = i+1; j < arrObj.length; j++){
			Rs = eat(arrObj[i], arrObj[j])
			d_r[i] += Rs['A'];
			d_r[j] += Rs['B'];
		}
	}
	
	//将r的变化量作用到对应的r上，执行重绘检查
	player.r += d_r_p;
	if(d_r_p != 0)
		reDrawPlayer();
	for (var i in arrObj){
		arrObj[i].r += d_r[i];
		if (arrObj[i].r < 0){
			arrObj[i].r = 0;
		}
		if(d_r[i] != 0)
			reDraw(arrObj[i]);
	}
}

//特殊函数：只对arrObj进行处理，且不执行重绘检查
function absorbArr(){
	var d_r = new Array(arrObj.length);
	for (var i = 0; i < d_r.length; i++){
		d_r[i] = 0;
	}
	var Rs;
	for (var i = 0; i < arrObj.length; i++){
		for (var j = i+1; j < arrObj.length; j++){
			Rs = eat(arrObj[i], arrObj[j])
			d_r[i] += Rs['A'];
			d_r[j] += Rs['B'];
		}
	}
	for (var i in arrObj){
		arrObj[i].r += d_r[i];
		
	}
}

function moverBuilderX(e,t){
	if(e.timerX != undefined){
		clearTimeout(e.timerX);
	} 
	setTimeout(function(){
		e.x += e.dx;
		collisionWall(e);
		reDraw(e);
		e.timerX = setTimeout(arguments.callee,t);
	},t);
}

function moverBuilderY(e,t){
	if(e.timerY != undefined){
		clearTimeout(e.timerY);
	}
	setTimeout(function(){
		e.y += e.dy;
		collisionWall(e);
		reDraw(e);
		e.timerY = setTimeout(arguments.callee,t);
	},t);
}


function playerFixedMoverBuilderX(t){

	if(player.timerX != undefined){
		clearTimeout(player.timerX);
	}
	player.timerX = setTimeout(function(){
		player.x += player.dx;
		cx += player.dx;
		ctx.clearRect(0,0,cw,ch);
		reDrawWall();
		collisionWall(player);
		for(var i in arrObj){
			reDraw(arrObj[i]);
		}
		reDrawPlayer();
		player.timerX = setTimeout(arguments.callee,t);
	},t);
}

function playerFixedMoverBuilderY(t){
	if(player.timerY != undefined){
		clearTimeout(player.timerY);
	}
	player.timerY = setTimeout(function (){
		player.y += player.dy;
		cy += player.dy;
		ctx.clearRect(0,0,cw,ch);
		reDrawWall();
		collisionWall(player);
		for(var i in arrObj){
				reDraw(arrObj[i]);
		}
		reDrawPlayer();
		player.timerY = setTimeout(arguments.callee,t);
	},t);
}

function updateOverView(){
	ctxov.clearRect(1,1,ovcw-2,ovch-2);
	for(var i in arrObj){
		reDrawOV(arrObj[i]);
	}
	reDrawOVPlayer();
}

function update(){
	if(!(player.r > 0.5)){
		isWin = 0;
		return false;
	}
	if(stageNum != 0 && arrObj.length == 0){
		isWin = 1;
		return false;
	}
	for(var i = 0; i < arrObj.length; i++){
		if(!(arrObj[i].r >= 1)){
			clearTimeout(arrObj[i].timerX);
			clearTimeout(arrObj[i].timerY);
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.arc(arrObj[i].x - cx, arrObj[i].y - cy, 2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			arrObj.splice(i, 1);
			i--;
		}
	}
}

function logout(){
	console.log("stageNum:"+stageNum);
	if(stageNum != 0){
		clearTimeout(mainTimer);
		for(var i in arrObj){
			clearTimeout(arrObj[i].timerX);
			clearTimeout(arrObj[i].timerY);
		}
		clearTimeout(player.timerX);
		clearTimeout(player.timerY);
	}
	else{
		clearTimeout(animeTimer);
		clearTimeout(buildTimer);
		clearTimeout(player.timerX);
		clearTimeout(player.timerY);
	}
	ctxov.clearRect(0,0,200,150);
}

function checkKey(){
	if(keyState[27]){
		isWin = 0;
		return false;
	}
	if((keyState[37] && keyState[39])||(keyState[38] && keyState[40]))
		return;
	var v = keyState[32] ? 7 : 3;
	if(keyState[37] == 1 || keyState[39] == 1){
		if(keyState[37]){
			player.vx -= v;keyState[37]=2;
		}
		else if(keyState[39]){
			player.vx += v;keyState[39]=2;
		}
		if(player.vx == 0){
			player.dx == 0;
			clearTimeout(player.timerX);
		}
		else{
			player.dx = player.vx > 0 ? 1 : -1;
			tmp = (parseInt)(1000/player.vx);
			if(tmp < 0){
				tmp = -tmp;
			}
			if(tmp < minInterval){
				tmp = minInterval;
				player.vx = player.dx*1000/tmp;
			}
			playerFixedMoverBuilderX(tmp);
		}
	}
	if(keyState[38] == 1 || keyState[40] == 1){
		if(keyState[38]){
			player.vy -= v;
			keyState[38]=2;
		}
		else if(keyState[40]){
			player.vy += v;
			keyState[40]=2;
		}
		if(player.vy == 0){
			player.dy == 0;
			clearTimeout(player.timerY);
		}
		else{	
			player.dy = player.vy > 0 ? 1 : -1;
			tmp = (parseInt)(1000/player.vy);
			if(tmp < 0){
				tmp = -tmp;
			}
			if(tmp < minInterval){
				tmp = minInterval;
				player.vy = player.dy*1000/tmp;
			}
			playerFixedMoverBuilderY(tmp);
		}
	}
	
}

function signal(x){
	if(x < 0.9 && x > -0.9){return 0;}
	if(x > 0){return 1;}
	return -1;
}


function loadMap(map){
	for(var i in map){
		arrObj.push(new Obj(map[i].x,map[i].y,map[i].r,map[i].type,map[i].vx, map[i].vy));
		if(arrObj[i].vx != 0){moverBuilderX(arrObj[i],Math.abs(parseInt(1000/arrObj[i].vx)));}
		if(arrObj[i].vy != 0){moverBuilderY(arrObj[i],Math.abs(parseInt(1000/arrObj[i].vy)));}
	}	
}

function setSideA(attr){
	$('#title').css('display',attr);
	$('#start').css('display',attr);
	$('#rule').css('display',attr);
}

function setSideB(attr){
	$('#s1').css('display',attr);
	$('#s2').css('display',attr);
	$('#s3').css('display',attr);
	$('#s4').css('display',attr);
	$('#sr').css('display',attr);
	$('#sback').css('display',attr);
}

function pick(){
	setSideA('none');
	setSideB('block');
}

function unPick(){
	setSideA('block');
	setSideB('none');
}

function collisionWall(e){
	if(e.x - e.r < 0){e.dx = 1;if(e.vx<0)e.vx=-e.vx;}
	else if(e.x + e.r > pw){e.dx = -1;if(e.vx>0)e.vx=-e.vx;}
	if(e.y - e.r < 0){e.dy = 1;if(e.vy<0)e.vy=-e.vy;}
	else if(e.y + e.r > ph){e.dy = -1;if(e.vy>0)e.vy=-e.vy;}
}

function reDrawOV(e){
	ctxov.beginPath();
	if(e.type == 1){
		ctxov.fillStyle="black";
	}
	else{
		ctxov.fillStyle=e.r > player.r ? "red" : "blue";
	}
	var tmpr = e.r / scale;
	if(tmpr < 2){
		tmpr = 2;
	}
	ctxov.arc(e.x / scale , e.y / scale, tmpr, 0, 2 * Math.PI);
	ctxov.fill();
	ctxov.closePath();
}

function reDrawOVPlayer(){
	ctxov.beginPath();
	ctxov.fillStyle="green";
	var tmpr = player.r / scale;
	if(tmpr < 2){
		tmpr = 2;
	}
	ctxov.arc(player.x / scale , player.y / scale, tmpr, 0, 2 * Math.PI);
	ctxov.fill();
	ctxov.closePath();
	ctxov.beginPath();
	ctxov.strokeStyle="black";
	ctxov.moveTo(0,0);
	ctxov.lineTo(ovcw,0);
	ctxov.lineTo(ovcw,ovch);
	ctxov.lineTo(0,ovch);
	ctxov.lineTo(0,0);
	ctxov.stroke();
	ctxov.closePath();
}

function reDraw(e){
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(e.x - cx, e.y - cy, e.r + 2, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = "white";
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	var fs = ctx.createRadialGradient(e.x - cx, e.y - cy, 2, e.x - cx, e.y - cy, e.r);
	fs.addColorStop(0, '#fff');
	if (e.type == 1){
		fs.addColorStop(1, "#000");
	}
	else{
		fs.addColorStop(1, e.r > player.r ? "#f00" : "#00f");
	}
	
	ctx.fillStyle = fs;
	ctx.arc(e.x - cx, e.y - cy, e.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function reDrawPurple(purple){
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(purple.x - cx, purple.y - cy, purple.r + 1, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = "white";
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle="purple";
	ctx.arc(purple.x - cx, purple.y - cy, purple.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();	
}


function reDrawPlayer(){
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(player.x - cx, player.y - cy, player.r + 1, 0, 2 * Math.PI);
	ctx.fill();
	ctx.strokeStyle = "white";
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	$('#t').html((player.x - cx)+" "+(player.y-cy)+" "+player.r);
	var fs = ctx.createRadialGradient(player.x - cx, player.y - cy, 2, player.x - cx, player.y - cy, player.r);
	fs.addColorStop(0, '#fff');
	fs.addColorStop(1, '#0f0');
	ctx.fillStyle = fs;
	ctx.arc(player.x - cx, player.y - cy, player.r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();	
}

function reDrawWall(){
	ctx.strokeStyle="#000";
	if(cx < 0){ctx.moveTo(0-cx,0-cy);ctx.lineTo(0-cx,ph-cy);}
	if(cy < 0){ctx.moveTo(0-cx,0-cy);ctx.lineTo(pw-cx,0-cy);}
	if(cx + cw > pw){ctx.moveTo(pw-cx,0-cy);ctx.lineTo(pw-cx,ph-cy);}
	if(cy + ch > ph){ctx.moveTo(0-cx,ph-cy);ctx.lineTo(pw-cx,ph-cy);}
	ctx.stroke();
}

function page1Start(at){
	console.log(at);
	page = 1;
	overView = 1;
	time = 0;
	stageNum = at;
	$('#timeShow').css('display','block');
	$('#task').css('display','block');
	isWin = -1;
	setTimeout(function(){
		time++;
		if(isWin == -1){
			$('#timeShow').html('已用时间：'+time+'秒');
			setTimeout(arguments.callee, 1000);
		}
		else{
			$('#timeShow').css('display','none');
			$('#task').css('display','none');
		}
	},1);
	var stage = setStage(at);
	clearTimeout(animeTimer);
	clearTimeout(buildTimer);
	ctx.clearRect(0,0,cw,ch);
	$('#task').html(stage.view.task);

	setSideA('none');
	setSideB('none');

	interval = 50;
	cw=800,ch=600;
	console.log(stage.view);
	pw=stage.view.pw,ph=stage.view.ph;
	cx=stage.view.cx;cy=stage.view.cy;
	scale = Math.max(pw/200,ph/150);
	ovcw = pw / scale;
	ovch = ph / scale;
	arrObj = new Array();
	player = new Obj(stage.player.x,stage.player.y,stage.player.r,0,0,0);
	console.log(pw+','+ph);
	if(at != 0){
		loadMap(stage.map);
		for(var i in arrObj){
			reDraw(arrObj[i]);
		}
		reDrawPlayer();
		mainTimer = setTimeout(function(){
			absorbObj();
			updateOverView();
			if(checkKey() != false && update() != false){
				mainTimer = setTimeout(arguments.callee,interval);
			}
			else{
				logout();
				setTimeout(page2Start(),1);
			}
		},interval);
	}
	else{
		var purple = undefined,purple2 = undefined;
		animeTimer=setTimeout(function(){
			nowAt++;
			for(var i = 0; i < arrObj.length; i++){
				if(arrObj[i].r < 1){
					arrObj.splice(i, 1);
					i--;
					continue;
				}
				if(nowAt % arrObj[i].tx == 0){
					arrObj[i].x += arrObj[i].dx;
				}
				if(nowAt % arrObj[i].ty == 0){
					arrObj[i].y += arrObj[i].dy;
				}
				if(arrObj[i].x < -arrObj[i].r - 60 || arrObj[i].x > cw + arrObj[i].r + 60)
				{
					arrObj.splice(i,1);
					i--;
					continue;
				}
				if(arrObj[i].y < -arrObj[i].r - 60 || arrObj[i].y > ch + arrObj[i].r + 60)
				{
					arrObj.splice(i,1);
					i--;
					continue;
				}
				reDraw(arrObj[i]);
			}
			reDrawPlayer();
			absorbObj();
			updateOverView();
			if(time > 90){
				purple.x += purple.dx;
				purple.y += purple.dy;
				collisionWall(purple);
				if((purple.x-player.x)*(purple.x-player.x)+(purple.y-player.y)*(purple.y-player.y)<(8+player.r)*(8+player.r)-0.01){
					isWin = 0;
					logout();
					setTimeout(page2Start(),1);
					return;
				}
				reDrawPurple(purple);
				
				if(time > 240){
					purple2.x += purple2.dx;
					purple2.y += purple2.dy;
					collisionWall(purple2);
					if((purple2.x-player.x)*(purple2.x-player.x)+(purple2.y-player.y)*(purple2.y-player.y)<(8+player.r)*(8+player.r)-0.01){
						isWin = 0;
						logout();
						setTimeout(page2Start(),1);
						return;
					}
					reDrawPurple(purple2);
				}
				else if(time == 240 && purple2 == undefined){
					purple2 = new Obj(10,20,16,2,5,-5);

				}
			}
			else if(time == 90 && purple == undefined){
				purple = new Obj(10,10,8,2,5,5);
			}
			if(checkKey() != false && update() != false){
				animeTimer = setTimeout(arguments.callee,animeInv);
			}
			else{
				logout();
				setTimeout(page2Start(),1);
			}
		},animeInv);
		
		buildTimer=setTimeout(function(){
			var tx = Math.random();var ty = Math.random();
			var toPush = new Object();
			if(tx < 0.3) toPush.tx = 3;
			else if(tx < 0.6) toPush.tx = 2;
			else toPush.tx = 1;
			if(ty < 0.3) toPush.ty = 3;
			else if(ty < 0.6) toPush.ty = 2;
			else toPush.ty = 1;
			toPush.r = parseInt(50*Math.random() + 10);
			var from = Math.random();
			var from2 = Math.random() > 0.5 ? 1 : -1;
			if(from < 0.25){
				toPush.y = -60;
				toPush.x = cw * Math.random();
				toPush.dy = 1;
				toPush.dx = from2;
			}
			else if(from < 0.5){
				toPush.y = ch + 60;
				toPush.x = cw * Math.random();
				toPush.dy = -1;
				toPush.dx = from2;
			}
			else if(from < 0.75){
				toPush.x = -60;
				toPush.y = ch * Math.random();
				toPush.dx = 1;
				toPush.dy = from2;
			}
			else{
				toPush.x = cw + 60;
				toPush.y = ch * Math.random();
				toPush.dx = -1;
				toPush.dy = from2;
			}
			var c = Math.random();
			if(c > 0.65){
				toPush.type = 1;
			}
			else{
				toPush.type = 0;
			}
			arrObj.push(toPush);
			buildTimer = setTimeout(arguments.callee,buildInv);
		},buildInv);
	}
}
	
function page2Start(){
	page = 2;
	if(isWin == 0)$('#fail').attr('src','img/fail.png');
	else $('#fail').attr('src','img/success.png');
	$('#fail').css('display','block');
	setTimeout(function(){$('#fail').css('display','none');page0Start();},3000);
}

function page0Start(){
	setSideA('block');

	page = 0;
	arrObj = new Array();
	cx = cy = 0;
	nowAt = 0;
	
	ctx.clearRect(0,0,cw,ch);
	animeTimer=setTimeout(function(){
		var s = arrObj.length+'\n';
		nowAt++;
		var toDraw;
		ctx.clearRect(0,0,cw,ch);
		absorbArr();
		for(var i = 0; i < arrObj.length; i++){
			if(arrObj[i].r < 1){
				arrObj.splice(i, 1);
				i--;
				continue;
			}
			if(nowAt % arrObj[i].tx == 0){
				arrObj[i].x += arrObj[i].dx;
			}
			if(nowAt % arrObj[i].ty == 0){
				arrObj[i].y += arrObj[i].dy;
				
			}
			if(arrObj[i].x < -arrObj[i].r - 30 || arrObj[i].x > cw + arrObj[i].r + 30)
			{
				arrObj.splice(i,1);
				i--;
				continue;
			}
			if(arrObj[i].y < -arrObj[i].r - 30 || arrObj[i].y > ch + arrObj[i].r + 30)
			{
				arrObj.splice(i,1);
				i--;
				continue;
			}
			ctx.beginPath();
			var fs = ctx.createRadialGradient(arrObj[i].x - cx, arrObj[i].y - cy, 2, arrObj[i].x - cx, arrObj[i].y - cy, arrObj[i].r);
			fs.addColorStop(0, '#fff');
			fs.addColorStop(1, arrObj[i].color);

			ctx.fillStyle = fs;
			ctx.arc(arrObj[i].x - cx, arrObj[i].y - cy,arrObj[i].r, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
			s += parseInt(arrObj[i].x) + ' ' + parseInt(arrObj[i].y) +' '+parseInt(arrObj[i].r)+ '\n';
		}
		animeTimer = setTimeout(arguments.callee,animeInv);
	},animeInv);

	buildTimer=setTimeout(function(){
		var tx = Math.random();var ty = Math.random();
		var toPush = new Object();
		if(tx < 0.3) toPush.tx = 3;
		else if(tx < 0.6) toPush.tx = 2;
		else toPush.tx = 1;
		if(ty < 0.3) toPush.ty = 3;
		else if(ty < 0.6) toPush.ty = 2;
		else toPush.ty = 1;
		toPush.r = parseInt(20*Math.random() + 10);
		var from = Math.random();
		var from2 = Math.random() > 0.5 ? 1 : -1;
		if(from < 0.25){
			toPush.y = -30;
			toPush.x = cw * Math.random();
			toPush.dy = 1;
			toPush.dx = from2;
		}
		else if(from < 0.5){
			toPush.y = ch + 30;
			toPush.x = cw * Math.random();
			toPush.dy = -1;
			toPush.dx = from2;
		}
		else if(from < 0.75){
			toPush.x = -30;
			toPush.y = ch * Math.random();
			toPush.dx = 1;
			toPush.dy = from2;
		}
		else{
			toPush.x = cw + 30;
			toPush.y = ch * Math.random();
			toPush.dx = -1;
			toPush.dy = from2;
		}
		var c = Math.random();
		if(c > 0.8){
			toPush.color = "red";
		}
		else if(c > 0.6){
			toPush.color = "green";
		}
		else if(c > 0.4){
			toPush.color = "yellow";
		}
		else if(c > 0.2){
			toPush.color = "blue";
		}
		else{
			toPush.color = "black";
		}
		arrObj.push(toPush);
		buildTimer = setTimeout(arguments.callee,buildInv);
	},buildInv);
}

//////////////////////////////

document.addEventListener('keydown',function(e){
	if(keyState[e.keyCode] != 2)
	keyState[e.keyCode] = 1;
});

document.addEventListener('keyup',function(e){
	keyState[e.keyCode] = 0;
});

page0Start();