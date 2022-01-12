[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(ChatColors,"DarkCritText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkCritText"),json.get(ChatColors,"DarkCritText"))]
};{
	[h:macro.return=if(json.get(ChatColors,"LightCritText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightCritText"),json.get(ChatColors,"LightCritText"))]
}]