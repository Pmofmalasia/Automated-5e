[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkCritText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkCritText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkCritText"))]
};{
	[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightCritText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightCritText"),json.get(getProperty("a5e.stat.ChatColors"),"LightCritText"))]
}]