
var ta = document.getElementById('ta');

var run_but = document.getElementById("run_but");

var save_but = document.getElementById("save_but");

run_but.onclick = function(){
			setTimeout(ta.value,1);
		}

save_but.onclick = function(){
			
			var a = document.createElement("a");
			a.href='data:javascript/plain;charset=utf-8, '+encodeURIComponent(ta.value);
			var s = prompt("Give your file a name...");

				// for boolean check (ok is pressed or cancel?)
			if(s==null){return;}

			if(s==undefined || s=="" || s==null){
				s="untitled.js";
			}else
			{
				s+='.js';
			}
			
			a.download=s;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			
			
		}