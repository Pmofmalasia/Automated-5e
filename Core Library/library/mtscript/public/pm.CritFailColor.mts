[h,if(currentToken()==""),CODE:{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkCritFailText")]
	};{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightCritFailText")]
	}]
};{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkCritFailText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkCritFailText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkCritFailText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightCritFailText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightCritFailText"),json.get(getProperty("a5e.stat.ChatColors"),"LightCritFailText"))]
	}]
}]