[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(ChatColors,"DarkHealingText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkHealingText"),json.get(ChatColors,"DarkHealingText"))]
};{
	[h:macro.return=if(json.get(ChatColors,"LightHealingText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightHealingText"),json.get(ChatColors,"LightHealingText"))]
}]