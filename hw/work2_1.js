//***********$*********
//一个相对成熟的￥函数实现。此段代码源自网络。


function $(arg){
	var attr=function(args)	{
		if(arguments.length == 1){
		if(this.hasAttribute(args)){
			return this.getAttribute(args);
		}
		else{
				return undefined;
			}
		}
		else if(arguments.length == 2){
			if(!arguments[0].match(/^\w+$/)){
				return undefined
			}
			attribute = arguments[0];
			value = arguments[1];
			this.setAttribute(attribute,value);
		}
	}

	if (typeof(arg) !== 'string'){
		return undefined;
	}
	if (arg[0] === '#'){
		var re =[];
		re.push(document.getElementById(arg.slice(1)));
	}
	else if (arg[0] === '.'){
		var re = document.getElementsByClassName(arg.slice(1));
	}
	else{
		var re = document.getElementsByTagName(arg);
	}
	for (var i = re.length - 1; i >= 0; i--) {
		re[i].attr = attr;
	}
	if (re.length ===1){
		return re[0];
	}
	else{
		return re;
	}
}


//////////////////////////////////////////////////////////////////////////



function GoToTop(){
}
GoToTop.prototype.init = function(e){
	var dis = "5%";
	btn = document.createElement('div');
	triangle = document.createElement('div');
	btn.id='button';
	triangle.className+='triangle-up';
	document.write("<style>#button {  display:none; box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.56), 0 2px 10px 0 rgba(0, 0, 0, 0.12);border-radius: 50%;width: 60px; height: 60px; padding: 0;position: fixed; overflow: hidden;  z-index: 98;background-color: #37d968; }.triangle-up {position:relative;width: 3px;height: 3px;border-left: 18px solid transparent;	border-right: 18px solid transparent;border-bottom: 23px solid #eee;margin:15px auto;}</style>")
	btn.appendChild(triangle);
	if (e==undefined) {
		console.log("ERROR");
		return;
	}//This shouldn't be called;
	if (e.hasOwnProperty('x') && e.hasOwnProperty('y') ) {
		btn.style.left = e.x;
		btn.style.top = e.y;
	}
	else if (e.hasOwnProperty('LeftUp') && e.LeftUp) {
		btn.style.left = dis;
		btn.style.top  = dis;
	}
	else if (e.hasOwnProperty('LeftDown') && e.LeftDown) {
		btn.style.left = dis;
		btn.style.bottom  = dis;	
	}
	else if (e.hasOwnProperty('RightUp') && e.RightUp) {
		btn.style.right = dis;
		btn.style.top  = dis;
	}
	else if (e.hasOwnProperty('RightDown') && e.RightDown) {
		btn.style.right = dis;
		btn.style.bottom  = dis;
	}

	document.body.appendChild(btn);
	document.getElementById("button").addEventListener("click", clickButton);
}

function getScrollTop() {  
    return ('pageYOffset' in window)?window.pageYOffset:document.compatMode === "BackCompat"&&document.body.scrollTop||document.documentElement.scrollTop ;  
} 

function clickButton(){
	var top = getScrollTop();  
	if (top > 0) {  
		window.scrollTo(0, top / 1.06)  
		setTimeout(arguments.callee, 10);  
	}
}

window.onscroll = function(){ 
    var t = document.documentElement.scrollTop || document.body.scrollTop;  
    var button = document.getElementById( "button" ); 
    button.style.display = t >= 200 ? "inline" : "none";	//200 距离设定  
} 

window.onkeydown =function(key){
	if (key.keyCode ==90 && key.ctrlKey && key.shiftKey){	//'z'
		clickButton()
	}
} 