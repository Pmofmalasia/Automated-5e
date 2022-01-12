[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(ChatColors,"DarkDamageText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkDamageText"),json.get(ChatColors,"DarkDamageText"))]
};{
	[h:macro.return=if(json.get(ChatColors,"LightDamageText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightDamageText"),json.get(ChatColors,"LightDamageText"))]
}]