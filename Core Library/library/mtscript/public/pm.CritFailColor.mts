[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
	[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkCritFailText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkCritFailText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkCritFailText"))]
};{
	[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightCritFailText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightCritFailText"),json.get(getProperty("a5e.stat.ChatColors"),"LightCritFailText"))]
}]