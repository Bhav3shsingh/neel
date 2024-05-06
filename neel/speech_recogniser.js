var fin_pos = 0; var t; var car_pos; var roam = false; var s; 
if('webkitSpeechRecognition' in window){
		
	//beep
	var beep = new Audio('res/beep-sound.mp3');

	var voice_but = document.getElementById('voice_but');
	t = document.getElementById('ta');
	sel=t.value.substring(t.selectionStart,t.selectionEnd);
	car_pos=t.value.length;
	var interimp = document.getElementById('interimp');
	//var interimp;
	var speechRecognition = new webkitSpeechRecognition();
	speechRecognition.interimResults = true;
	speechRecognition.continuous = true;
	speechRecognition.lang = 'en';
	
	//shortcuts
	window.onkeydown=function(e){
		if(e.altKey && e.key=='h'){
			if(!begun){
				voice_but.click(); 
			}
		}   
	}
	
	voice_but.onclick=function(){
	//	interimp = document.createElement('p');
		if(!begun){
		interimp.innerHTML="hearing...";
			begun=true;
			speechRecognition.start();
			voice_but.style.backgroundColor='white';
			voice_but.style.color="#212121";
			beep.play();
		}else{
			interimp.innerHTML="";
			begun=false;
			speechRecognition.stop();
			voice_but.style.backgroundColor='#516ae8';
			voice_but.style.color="white";
		}
	}
	
	var finRes="";
	var interimRes = "";
		
		var begun=false;
	
	
	speechRecognition.onend = function(event){
		if(begun){
		voice_but.click(); voice_but.click();
		}
	};	
	
	speechRecognition.onerror=function(event){
		alert("ERR:"+event.error);
	};
	
	speechRecognition.onresult=function(event){

		for(var i=event.resultIndex; i<event.results.length; i++){
			finRes=t.value;
			if(event.results[i].isFinal){
				
				s = event.results[i][0].transcript;
				
				//neel commands
				if(s.indexOf("clear all")>-1){
					for( var k=0; k<event.results.length; k++){
						event.results[i][0]=null;
					}
					finRes="";
				}
				else if(s.indexOf("Neel bang")>-1){
					voice_but.click();
				}
				else if(s.toLowerCase().indexOf("neel voice")>-1){
					
					var speech = new SpeechSynthesisUtterance();
					speech.lang='en';
					speech.volume=63;
					speech.rate=0.9;
					speech.text=t.value;
					window.speechSynthesis.speak(speech);
					
					
				}
				else if(s.toLowerCase().indexOf("neel run")>-1){
					document.getElementById('run_but').click();
				}
				else if(s.indexOf("Neel save")>-1){
					document.getElementById('save_but').click();
				}
	
				// ta commands 
				// RELATIONs
				else if(s.toLowerCase().indexOf('not equal')>1 || s.toLowerCase().indexOf('does not equal')>-1){
					finRes=arrtoarr(finRes,'!=',t);
				}
				else if(s.toLowerCase().indexOf("less than or equal")>-1){
					finRes=arrtoarr(finRes,'<=',t);
				}
				else if(s.toLowerCase().indexOf('greater than or equal')>-1){
					finRes=arrtoarr(finRes,'>=',t);
				}
				else if(s.toLowerCase().indexOf('less than')>-1){
					finRes=arrtoarr(finRes,'<',t);
				}
				else if(s.toLowerCase().indexOf("greater than")>-1){
					finRes=arrtoarr(finRes,'>',t);
				}
				else if(s.indexOf("new line")>-1 && begun){
					var pos= t.selectionStart;
					var arr = finRes.split('');
					var res='';
					var arr2 = []; var gg = true;
					if(pos>=arr.length-1){
						res=finRes+'\n';
						gg=false;
					}
					
					for(var a =0; a<arr.length && gg; a++){
						if(a==pos){
							arr2[a]='\n'+((a==arr.length-1)?'':arr[a]);
						}
						else{
							arr2[a] = arr[a];
						}
					}
	
					res += arr2.join('');	
					finRes=res;
					
					roam=false;				
				}
				else if(s.indexOf("comment")>-1 && begun){
					finRes=arrtoarr(finRes,"//",t);
				}
				else if(s.indexOf('clear line')>-1||s.indexOf('clearline')>-1){
					var lines = finRes.split('\n');
					var that;
					var c = 0; var pos = t.selectionStart;
					var one = false;	var res='';
					
					out1:for(var l=0; l<lines.length; l++){
						var line = lines[l].split('');
						if(lines.length==1){
							res=''; one=true;
							break out1;
						}
						
						for(var n=0; n<line.length; n++){
							++c;
							if(c==pos){
								that=l; break out1;
								console.log(that);
							}
							
						}
					}
					
					
					for(var l=0; l<lines.length && !one; l++){
						if(l!=that){
							res+=lines[l]+"\n";
						}
					}
					
					
					finRes=res;
					
					for( var k=0; k<event.results.length; k++){
						event.results[i][0].transcript=null;
					}
					
				}
				else if(s.indexOf("backspace")>-1 && begun){
					var op = "";
					var pos=t.selectionStart;
					save_caret(pos,"");
					for(var i=0; i<finRes.length; i++)
					{
						if(i!=pos-1){
							op+=finRes[i];
						}
					}
					finRes=op;
					roam=true;
					
				}
				else if(s.indexOf("dot")>-1 && begun){					
					finRes=arrtoarr(finRes,'.',t);
				}
				else if(s.indexOf('semicolon')>-1 && begun){
					finRes=arrtoarr(finRes,';',t);
				}
				else if(s.indexOf('colon')>-1 && begun){
					finRes=arrtoarr(finRes,':',t);
				}
				else if(s.indexOf('variable')>-1 && begun){
					finRes=arrtoarr(finRes,'var',t);
				}
				else if(s.indexOf('square bracket close')>-1 || s.indexOf('square bracket end')>-1 && begun){
					finRes=arrtoarr(finRes,']',t);
				}
				else if(s.indexOf('square bracket')>-1 && begun){
					finRes=arrtoarr(finRes,'[',t);
				}
				else if(begun && s.indexOf('curly bracket close')>-1||s.indexOf('curly bracket end')>-1){
					finRes=arrtoarr(finRes,'}',t);
				}
				else if(s.indexOf('curly bracket')>-1 && begun){
					finRes=arrtoarr(finRes,'{',t);
				}
				else if(s.indexOf('tab')>-1 && begun){
					finRes=arrtoarr(finRes,'\t',t);
				}
				else if(begun && s.indexOf('bracket close')>-1 || s.indexOf("bracket end")>-1 || s.indexOf('parentheses end')>-1 || s.indexOf('parentheses close')>-1){
					finRes=arrtoarr(finRes,')',t);
				}
				else if(s.indexOf('bracket')>-1 || s.indexOf('bracket')>-1 && begun){
					finRes=arrtoarr(finRes,'(',t);
				}
				else if(s.indexOf('space')>-1 &&((s.charAt(s.indexOf('space')-1)=="" || s.charAt(s.indexOf('space')-1))==" " && (s.charAt(s.indexOf('space')-1)=="" || s.charAt(s.indexOf('space')-1)) ) && begun){
					finRes=arrtoarr(finRes,' ',t);
				}
				else{
					if(begun){
						finRes=arrtoarr(finRes,s,t);
					}
				}
			
			}else{
				interimRes=event.results[i][0].transcript;		
				interimp.innerHTML=interimRes;
			}
			
		}
	
		t.value=finRes;
		if(roam) {restore_caret();}
		beep.play();
	};	
	
}else{
	var voice_but = document.getElementById('voice_but');
	document.body.removeChild(voice_but);
	alert('Speech not available');
}


function arrtoarr(st, ch, t){
	cha=ch;
	var pos= t.selectionStart;
	save_caret(pos,ch);
	var arr = st.split('');
	var res='';
	var arr2 = [];
	if(pos>=arr.length-1){
		res=st+ch;
		return st+ch;
	}
	for(var a =0; a<arr.length; a++){
			
		if(a==pos){
			arr2[a]=ch+((a==arr.length-1)?'':arr[a]);
		}
		else{
			arr2[a] = arr[a];
		}
	}
	
	res += arr2.join('');	
	roam=true;
	return res;
}



function restore_caret(){
	t.setSelectionRange(car_pos,car_pos);
	t.focus();
}

function save_caret(p,ch){
	car_pos=p+ch.length;
}