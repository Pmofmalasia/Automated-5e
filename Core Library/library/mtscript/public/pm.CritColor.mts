[h,if(currentToken()==""),CODE:{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkCritText")]
	};{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightCritText")]
	}]
};{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkCritText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkCritText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkCritText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightCritText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightCritText"),json.get(getProperty("a5e.stat.ChatColors"),"LightCritText"))]
	}]
}]