var Modal_flag = 0, Modal_vvx = 0, Modal_vvy = 0, Modal_dragable = 0, Modal_isOn = -1;
			var Modal_exit_key;
			var Modal_div_html_part1 = '<div id="Modal_divs_bg" style="background:rgba(255,255,255,0.7);height:100%;width:100%;position:fixed;top:0;z-Index:999999997;display:block" onmouseup="Modal_flag=0"><div id="Modal_divs_win" tagindex="0" style="background:rgba(255,255,255,1);max-width:90%;min-width:400px;position:fixed;top:200px;left:300px;z-Index:999999998;border:1px solid #000;text-align:center;box-shadow: 4px 4px 1px #888888;"onmousedown="Modal_flag = 1;Modal_vvx=event.clientX;Modal_vvy=event.clientY;" onmousemove="Modal_mouseMove(event)"><p style="font-size:20px;font-family:'+"'微软雅黑'"+';onfocus="return false" id="Modal_text">';
			var Modal_div_html_part2 = '</p><p style="font-size:18px;font-family:'+"'微软雅黑'"+';onfocus="return false" id="Modal_exit_key">';
			var Modal_div_html_part3 = '</p><br style="clear:both"></br></div></div>';
			document.addEventListener('keyup',function(e){
				if(Modal_isOn == 1 && e.keyCode == Modal_exit_key)
				{
					document.getElementById("Modal_divs_bg").style.display = "none";
					Modal_isOn = Modal_dragable = 0;
				}
			},true);
			function Modal_mouseMove(e)
			{
				console.log(1);
				if(Modal_flag ==1 && Modal_dragable == true)
				{
					console.log(2);
					var dx=e.clientX-Modal_vvx;console.log(dx);
					var dy=e.clientY-Modal_vvy;console.log(dy);
					var oldleft = parseInt(document.getElementById('Modal_divs_win').style.left);//console.log(oldleft);
					var oldtop = parseInt(document.getElementById('Modal_divs_win').style.top);//console.log(oldtop);
					if(oldleft+dx >= 0)
						document.getElementById('Modal_divs_win').style.left=oldleft+dx+"px";
					else
						document.getElementById('Modal_divs_win').style.left="0px";
					if(oldtop+dy >= 0)
						document.getElementById('Modal_divs_win').style.top=oldtop+dy+"px";
					else
						document.getElementById('Modal_divs_win').style.top="0px";
					Modal_vvx=e.clientX;
					Modal_vvy=e.clientY;
				}
			}
			var Modal={
				init : function(a){
					console.log(typeof(a));
					if(typeof(a) != "object")
					{
						console.log("no!");
						return;
					}
					if(Modal_isOn == -1)
					{
						var text = "这是一个警告";
						if(a.content != undefined)
							text = a.content.slice();
						if(a.closeKey != undefined)
							Modal_exit_key = a.closeKey;
						else
							Modal_exit_key = 27;
						if(a.draggable != undefined)
							Modal_dragable = a.draggable;
						else
							Modal_dragable = 1;
						var bodyHtml = document.getElementsByTagName("body")[0].innerHTML;
						var ch;
						switch(Modal_exit_key){
							case 27:
								ch = "Esc";break;
							case 8:
								ch = "Tab";break;
							case 9:
								ch = "Space";break;
							case 13:
								ch = 'Enter';break;
							default:
								ch = String.fromCharCode(Modal_exit_key);
						}
						document.getElementsByTagName("body")[0].innerHTML = bodyHtml + Modal_div_html_part1+text+Modal_div_html_part2+"按下"+ch+"退出"+Modal_div_html_part3;
						Modal_isOn = 1;
					}
					else{
						var text = "这是一个警告";
						if(a.content != undefined)
							text = a.content.slice();
						if(a.closeKey != undefined)
							Modal_exit_key = a.closeKey;
						else
							Modal_exit_key = 27;
						if(a.draggable != undefined)
							Modal_dragable = a.draggable;
						else
							Modal_dragable = 1;
						Modal_isOn = 1;
						document.getElementById("Modal_divs_bg").style.display = "block";
						document.getElementById("Modal_text").innerHTML = text;
						var ch;
						switch(Modal_exit_key){
							case 27:
								ch = "Esc";break;
							case 8:
								ch = "Tab";break;
							case 9:
								ch = "Space";break;
							case 13:
								ch = 'Enter';break;
							default:
								ch = String.fromCharCode(Modal_exit_key);
						}
						document.getElementById("Modal_exit_key").innerHTML = "按下"+ch+"退出";
					}
				}
			};
			